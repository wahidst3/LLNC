import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  where,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { Product } from '../context/CartContext';

// Product Services
export const addProduct = async (product: Omit<Product, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'products'))
      // query(collection(db, 'products'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  try {
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, {
      ...product,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// User Authentication Services
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store additional user info in Firestore
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      email: user.email,
      name: name,
      createdAt: Timestamp.now()
    });
    
    return user;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Order Services
export interface Order {
  id?: string;
  userId?: string;
  items: any[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export const addOrder = async (order: Omit<Order, 'id'>, customId?: string) => {
  try {
    if (customId) {
     
      await setDoc(doc(db, 'orders', customId), {
        ...order,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return customId;
    } else {
    
      const docRef = await addDoc(collection(db, 'orders'), {
        ...order,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};
export const getOrders = async (): Promise<Order[]> => {
  try {
    const querySnapshot = await getDocs(
      // query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      query(collection(db, 'orders'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const querySnapshot = await getDocs(
      query(
        collection(db, 'orders'), 
        where('userId', '==', userId),
        // orderBy('createdAt', 'desc')
      )
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// User Services
export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, 'users'))
      // query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// Real-time listeners
export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const q = query(collection(db, 'products'));
  // const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
    callback(products);
  });
};

export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  const q = query(collection(db, 'orders'));
  // const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
    callback(orders);
  });
};