import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './CartContext';
import { 
  addProduct as addFirebaseProduct,
  updateProduct as updateFirebaseProduct,
  deleteProduct as deleteFirebaseProduct,
  subscribeToProducts,
  subscribeToOrders,
  updateOrderStatus as updateFirebaseOrderStatus,
  getUsers,
  Order
} from '../services/firebaseService';

interface AdminContextType {
  products: Product[];
  orders: Order[];
  users: any[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribeProducts = subscribeToProducts((products) => {
      setProducts(products);
      setLoading(false);
    });

    const unsubscribeOrders = subscribeToOrders((orders) => {
      setOrders(orders);
    });

    // Load users
    const loadUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };

    loadUsers();

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await addFirebaseProduct(product);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      await updateFirebaseProduct(id, product);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteFirebaseProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateFirebaseOrderStatus(orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <AdminContext.Provider value={{
      products,
      orders,
      users,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;