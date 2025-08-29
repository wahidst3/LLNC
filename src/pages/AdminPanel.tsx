import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut,
  Eye,
  CheckCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import emailjs from "@emailjs/browser";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
// import { useAuth } from '../context/AuthContext';
import {  ChevronDown, ChevronRight, MapPin, Mail, Phone, Calendar,X, RotateCcw } from 'lucide-react';
// import { CheckCircle, , ChevronDown, ChevronRight, MapPin, Mail, Phone, Calendar, Package } from 'lucide-react';
import CategoryManager from '../components/Catogery';
const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { products, orders, users, loading, addProduct, updateProduct, deleteProduct, updateOrderStatus } = useAdmin();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [orderOpen, setOrderOpen] = useState(false)
const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
    const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, "categories"));
    const categoriesData = querySnapshot.docs.map(doc => doc.data().name);
    setCategories(categoriesData);
  };
  useEffect(() => {
    fetchCategories();
  }, []);

// Function to toggle order expansion
const toggleOrder = (orderId) => {
  const newExpanded = new Set(expandedOrders);
  if (newExpanded.has(orderId)) {
    newExpanded.delete(orderId);
  } else {
    newExpanded.add(orderId);
  }
  setExpandedOrders(newExpanded);
};
  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin');
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Total Users', value: users.length, icon: Users, color: 'bg-purple-500' },
    { label: 'Revenue', value: `$${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}`, icon: BarChart3, color: 'bg-yellow-500' }
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'users', label: 'Users', icon: Users }
  ];
// Helper function to generate the email message
const getOrderStatusEmailMessage = (orderId, status) => {
  const baseMessage = `
Hello,

Your Order with ID ${orderId} is now ${status}.

If you have any questions or concerns, feel free to contact our support team at llnc@gmail.com.

We truly value you as part of the LLNC family and are always here to serve you.

Best regards,
The LLNC Team
  `;

  if (status.toLowerCase() === 'cancelled') {
    return `
Hello,

Your Order with ID ${orderId} has been cancelled.

If this cancellation was due to a system mistake or a technical issue, please don't worry — we will restore your order and notify you immediately once it's fixed.

If you have any questions or concerns, feel free to contact our support team at llnc@gmail.com.

We truly value you as part of the LLNC family and are always here to serve you.

Best regards,
The LLNC Team
    `;
  }

  return baseMessage;
};

// Usage in your order update function

 const ProductForm = ({ product, onSave, onCancel }: any) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      price: product?.price || '',
      description: product?.description || '',
      category: product?.category || 'Soap',
      image: product?.image || '',
      stock: product?.stock || 0
    });

    const [imageUploadType, setImageUploadType] = useState('url'); // 'url' or 'file'
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Cloudinary configuration - Replace with your actual values
    const CLOUDINARY_CLOUD_NAME = 'dohpexp01'; // Replace with your Cloudinary cloud name
    const CLOUDINARY_UPLOAD_PRESET = 'ali22234'; // Replace with your upload preset

    const handleFileUpload = async (file: File) => {
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, or WebP)');
        return;
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        alert('File size should be less than 5MB');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      try {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(progress));
          }
        });

        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            setIsUploading(false);
            setUploadProgress(0);
            
            if (xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              setFormData(prev => ({ ...prev, image: response.secure_url }));
            } else {
              alert('Upload failed. Please try again.');
              console.error('Upload error:', xhr.responseText);
            }
          }
        };

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`);
        xhr.send(formData);

      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Upload failed. Please try again.');
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.image) {
        alert('Please provide an image URL or upload an image');
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (product) {
        updateProduct(product.id, productData);
      } else {
        addProduct(productData);
      }
      
      onSave();
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">{product ? 'Edit Product' : 'Add Product'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>
            
            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium mb-2">Product Image</label>
              
              {/* Toggle between URL and File Upload */}
              <div className="flex mb-3 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setImageUploadType('url')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    imageUploadType === 'url' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageUploadType('file')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    imageUploadType === 'file' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {/* URL Input */}
              {imageUploadType === 'url' && (
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="Enter image URL"
                />
              )}

              {/* File Upload */}
              {imageUploadType === 'file' && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="w-full p-2 border rounded file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    disabled={isUploading}
                  />
                  
                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Image Preview */}
              {formData.image && !isUploading && (
                <div className="mt-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md border"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiIGZpbGw9IiM5OTkiLz4KPHBhdGggZD0ibTIxIDEzLTUtNUwxMSAxMyIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isUploading}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : (product ? 'Update' : 'Add')} Product
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">LNCC Organics Admin</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${stat.color} text-white mr-4`}>
                        <stat.icon size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Order ID</th>
                        <th className="text-left py-2">Customer</th>
                        <th className="text-left py-2">Total</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="py-2">#{order.id?.slice(-6)}</td>
                          <td className="py-2">{order.customerInfo?.name}</td>
                          <td className="py-2">${order.total?.toFixed(2)}</td>
                          <td className="py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'completed' 
                                ? 'bg-green-100 text-green-600'
                                : 'bg-yellow-100 text-yellow-600'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Products</h2>
                <div className='flex items-center space-x-2'>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  <Plus size={20} />
                  <span>Add Product</span>
                </button>
                 <button
        onClick={() => setShowCategoryManager(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Manage Categories
      </button>
      </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6">Product</th>
                      <th className="text-left py-4 px-6">Category</th>
                      <th className="text-left py-4 px-6">Price</th>
                      <th className="text-left py-4 px-6">Stock</th>
                      <th className="text-left py-4 px-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">{product.description?.slice(0, 50)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">{product.category}</td>
                        <td className="py-4 px-6">${product.price}</td>
                        <td className="py-4 px-6">{product.stock}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

       {activeTab === 'orders' && (
  <div>
    <h2 className="text-3xl font-bold text-gray-800 mb-8">Orders</h2>
    
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-4 px-6">Order ID</th>
            <th className="text-left py-4 px-6">Customer</th>
            <th className="text-left py-4 px-6">Items</th>
            <th className="text-left py-4 px-6">Total</th>
            <th className="text-left py-4 px-6">Status</th>
            <th className="text-left py-4 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              {/* Main Order Row */}
              <tr 
                className={`border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  expandedOrders.has(order.id) ? 'bg-blue-50' : ''
                }`} 
                onClick={() => toggleOrder(order.id)}
              > 
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    {expandedOrders.has(order.id) ? (
                      <ChevronDown size={16} className="text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="text-gray-400" />
                    )}
                    <span>#{order.id?.slice(-6)}</span>
                  </div>
                </td> 
                <td className="py-4 px-6"> 
                  <div> 
                    <p className="font-medium">{order.customerInfo?.name}</p> 
                    <p className="text-sm text-gray-500">{order.customerInfo?.email}</p> 
                  </div> 
                </td> 
                <td className="py-4 px-6"> 
                  <div className="text-sm text-gray-900">
                    {order.items?.length} item{order.items?.length > 1 ? 's' : ''}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.items?.slice(0, 2).map((item, index) => (
                      <span key={item.id}>
                        {item.name}
                        {index < Math.min(1, order.items.length - 1) && ', '}
                      </span>
                    ))}
                    {order.items?.length > 2 && '...'}
                  </div>
                </td> 
                <td className="py-4 px-6">
                  PKR {order.total?.toLocaleString()}
                </td> 
                <td className="py-4 px-6"> 
                  <span className={`px-2 py-1 rounded-full text-xs border ${
                    order.status === 'completed'  
                      ? 'bg-green-100 text-green-600 border-green-200' 
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-600 border-yellow-200'
                      : 'bg-blue-100 text-blue-600 border-blue-200'
                  }`}> 
                    {order.status} 
                  </span> 
                </td> 
                <td className="py-4 px-6"> 
                 <div className="flex items-center space-x-2">
                    {order.status === 'pending' && (
                      <>
                        <button 
                          onClick={async(e) => {
                            e.stopPropagation();

                            updateOrderStatus(order.id, 'completed');
          await emailjs.send(
  "service_amunl5e",
  "template_3n5kq0d",
  {
    email: order.customerInfo.email,
    name: order.customerInfo.name,
    orderd: order.id,
    orderstatus: order.status,
    message: getOrderStatusEmailMessage(order.id, "Completed")
  },
  "Di7YqJtjoZ6VOO4EU"
);
                          }}

                           
                          className="flex items-center space-x-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors text-md" 
                          title="Mark as Completed"
                        > 
                          <CheckCircle size={14} /> 
                          <span>Complete</span> 
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            updateOrderStatus(order.id, 'cancelled');
                              emailjs.send(
          "service_amunl5e",   // replace
          "template_3n5kq0d",  // replace
          {
            email: order.customerInfo.email,   // dynamic customer email
            orderid: order.id,              // pass order details
            // order_status: "completed",
              orderstatus: "Cancelled", 
              message: getOrderStatusEmailMessage(order.id, "Cancelled") 
          },
          "Di7YqJtjoZ6VOO4EU" // replace with your EmailJS public key
        ).then(
          (result) => {
            console.log("Email sent:", result.text);
          },
          (error) => {
            console.error("Email send error:", error.text);
          }
        );
                          }} 
                          className="flex items-center space-x-1 text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors text-md" 
                          title="Cancel Order"
                        > 
                          <X size={14} /> 
                          <span>Cancel</span> 
                        </button>
                      </>
                    )}
                    
                    {order.status === 'completed' && (
                      <span className="text-md text-gray-500 px-2 py-1">
                        Order Completed
                      </span>
                    )}
                    
                    {order.status === 'cancelled' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateOrderStatus(order.id, 'pending');
             emailjs.send(
          "service_amunl5e",   // replace
          "template_3n5kq0d",  // replace
          {
            email: order.customerInfo.email,   // dynamic customer email
            orderid: order.id,              // pass order details
            // order_status: "completed",
              orderstatus: order.status,  
              message: getOrderStatusEmailMessage(order.id, "Restored to pending")
          },
          "Di7YqJtjoZ6VOO4EU" // replace with your EmailJS public key
        ).then(
          (result) => {
            console.log("Email sent:", result.text);
          },
          (error) => {
            console.error("Email send error:", error.text);
          }
        );
                        }} 
                        className="flex items-center space-x-1 text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors text-md" 
                        title="Restore Order"
                      > 
                        <RotateCcw size={14} /> 
                        <span>Restore</span> 
                      </button>
                    )}
                  </div>
                </td> 
              </tr>

              {/* Expanded Content Row */}
              {expandedOrders.has(order.id) && (
                <tr className="bg-gray-50">
                  <td colSpan="6" className="px-6 py-6">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Details */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Customer Information
                          </h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <Mail size={16} className="text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="text-sm font-medium text-gray-900">{order.customerInfo?.email}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <Phone size={16} className="text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="text-sm font-medium text-gray-900">{order.customerInfo?.phone}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <MapPin size={16} className="text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-600">Delivery Address</p>
                                <p className="text-sm font-medium text-gray-900">{order.customerInfo?.address}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Order Details
                          </h4>
                          
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <Calendar size={16} className="text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-600">Order Date</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3">
                              <Package size={16} className="text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-sm text-gray-600">Status</p>
                                <p className="text-sm font-medium text-gray-900 capitalize">{order.status}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                          Order Items
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="space-y-3">
                            {order.items?.map((item) => (
                              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center space-x-4 flex-1">
                                  {item.image && (
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                                      }}
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                      <span>Category: {item.category}</span>
                                      <span>Qty: {item.quantity}</span>
                                      {item.stock && <span>Stock: {item.stock}</span>}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <p className="text-sm font-medium text-gray-900">
                                    PKR {(item.price * item.quantity).toLocaleString()}
                                  </p>
                                  <p className="text-xs text-gray-500">PKR {item.price.toLocaleString()} each</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                              <span className="text-lg font-bold text-gray-900">PKR {order.total?.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Users</h2>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6">User</th>
                      <th className="text-left py-4 px-6">Email</th>
                      <th className="text-left py-4 px-6">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-4 px-6 font-medium">{user.name || 'N/A'}</td>
                        <td className="py-4 px-6">{user.email}</td>
                        <td className="py-4 px-6">{user.orders?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
 <CategoryManager
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
      {/* Modals */}
      {showAddProduct && (
        <ProductForm
          onSave={() => setShowAddProduct(false)}
          onCancel={() => setShowAddProduct(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSave={() => setEditingProduct(null)}
          onCancel={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default AdminPanel;