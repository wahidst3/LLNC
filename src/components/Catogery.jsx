import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; // Import your Firebase config

const CategoryManager = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Fetch categories from Firebase
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const categoriesRef = collection(db, 'categories');
      const snapshot = await getDocs(categoriesRef);
      const categoriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error fetching categories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add new category to Firebase
  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    // Check if category already exists
    const categoryExists = categories.some(
      cat => cat.name.toLowerCase() === newCategoryName.toLowerCase()
    );
    
    if (categoryExists) {
      alert('Category already exists');
      return;
    }

    setIsAddingCategory(true);
    try {
      const categoriesRef = collection(db, 'categories');
      const docRef = await addDoc(categoriesRef, {
        name: newCategoryName.trim(),
        createdAt: new Date(),
        isActive: true
      });

      // Add to local state
      setCategories(prev => [...prev, {
        id: docRef.id,
        name: newCategoryName.trim(),
        createdAt: new Date(),
        isActive: true
      }]);

      setNewCategoryName('');
      alert('Category added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    } finally {
      setIsAddingCategory(false);
    }
  };

  // Update category in Firebase
  const updateCategory = async (categoryId) => {
    if (!editCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    // Check if category name already exists (excluding current category)
    const categoryExists = categories.some(
      cat => cat.name.toLowerCase() === editCategoryName.toLowerCase() && cat.id !== categoryId
    );
    
    if (categoryExists) {
      alert('Category name already exists');
      return;
    }

    try {
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, {
        name: editCategoryName.trim(),
        updatedAt: new Date()
      });

      // Update local state
      setCategories(prev => 
        prev.map(cat => 
          cat.id === categoryId 
            ? { ...cat, name: editCategoryName.trim() }
            : cat
        )
      );

      setEditingCategory(null);
      setEditCategoryName('');
      alert('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
    }
  };

  // Delete category from Firebase
  const deleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete "${categoryName}" category?`)) {
      try {
        await deleteDoc(doc(db, 'categories', categoryId));
        
        // Remove from local state
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        alert('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category. Please try again.');
      }
    }
  };

  // Start editing category
  const startEditing = (category) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.name);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCategory(null);
    setEditCategoryName('');
  };

  // Load categories when component mounts
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Manage Categories</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Add New Category */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-3">Add New Category</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 p-2 border rounded"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
            />
            <button
              onClick={addCategory}
              disabled={isAddingCategory || !newCategoryName.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAddingCategory ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-2">
          <h4 className="font-medium mb-3">Existing Categories</h4>
          
          {isLoading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No categories found</p>
          ) : (
            categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                {editingCategory === category.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="flex-1 p-1 border rounded"
                      onKeyPress={(e) => e.key === 'Enter' && updateCategory(category.id)}
                    />
                    <button
                      onClick={() => updateCategory(category.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 font-medium">{category.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(category)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id, category.name)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={fetchCategories}
            disabled={isLoading}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Refresh Categories'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;