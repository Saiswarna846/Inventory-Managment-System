import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Products({ setActiveTab, setSelectedProduct }) {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [currentStock, setCurrentStock] = useState(0);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name,
            sku,
            category,
            current_stock: currentStock,
          })
          .eq('id', editingProduct.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert([{
            name,
            sku,
            category,
            current_stock: currentStock,
          }]);

        if (error) throw error;
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSku('');
    setCategory('');
    setCurrentStock(0);
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setName(product.name);
    setSku(product.sku);
    setCategory(product.category);
    setCurrentStock(product.current_stock);
    setEditingProduct(product);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Also delete related transactions
      await supabase
        .from('transactions')
        .delete()
        .eq('product_id', id);

      fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const viewTransactions = (product) => {
    setSelectedProduct(product);
    setActiveTab('transactions');
  };

  return (
    <div className="products-container">
      <h2>Product Management</h2>
      
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="product-form">
        <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
        
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>SKU:</label>
          <input
            type="text"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Initial Stock:</label>
          <input
            type="number"
            min="0"
            value={currentStock}
            onChange={(e) => setCurrentStock(parseInt(e.target.value) || 0)}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : editingProduct ? 'Update' : 'Add'} Product
        </button>
        
        {editingProduct && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>
      
      <div className="product-list">
        <h3>Product List</h3>
        {isLoading && !products.length ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found. Add one above.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.category}</td>
                  <td>{product.current_stock}</td>
                  <td>
                    <button onClick={() => handleEdit(product)}>Edit</button>
                    <button onClick={() => viewTransactions(product)}>Transactions</button>
                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}