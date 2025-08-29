import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { registerUser, loginUser, logoutUser, addOrder as addFirebaseOrder, getUserOrders } from '../services/firebaseService';
import { Order } from '../services/firebaseService';
import { doc, setDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string | null;
  name: string;
  orders: Order[];
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  users: UserProfile[];
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      if (firebaseUser) {
        // Get user orders
        try {
          const orders = await getUserOrders(firebaseUser.uid);
          const userProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || 'User',
            orders: orders
          };
          setUser(userProfile);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginUser(email, password);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      await registerUser(email, password, name);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // In AuthContext.tsx
 const addOrder = async (order: Omit<Order, 'id'>, customId?: string) => {
  if (user && firebaseUser) {
    try {
      const orderWithUserId = { ...order, userId: user.uid };
      
      // Save to Firebase
      let orderId = customId;
      if (!orderId) {
        orderId = await addFirebaseOrder(orderWithUserId);
      } else {
        await addFirebaseOrder(orderWithUserId, orderId);
      }
      
      // Update local user state
      const completeOrder = { ...orderWithUserId, id: orderId };
      const updatedOrders = [...user.orders, completeOrder];
      setUser({ ...user, orders: updatedOrders });
      
      // Also update user document in Firestore
      await setDoc(
        doc(db, "users", firebaseUser.uid),
        {
          orders: updatedOrders,
        },
        { merge: true }
      );
      
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  }
};

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      login,
      register,
      logout,
      users,
      addOrder
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;