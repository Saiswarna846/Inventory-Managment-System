import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

export default function Transactions({ product, refreshProducts }) {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('IN');
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStock, setCurrentStock] = useState(product?.current_stock || 0);

  // Update currentStock when product changes
  useEffect(() => {
    setCurrentStock(product?.current_stock || 0);
  }, [product?.current_stock]);

  const fetchTransactions = useCallback(async () => {
    if (!product?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('product_id', product.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [product?.id]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!product?.id) {
      setError('No product selected');
      return;
    }

    const quantityNum = parseInt(quantity);
    if (isNaN(quantityNum)) {
      setError('Please enter a valid quantity');
      return;
    }

    if (quantityNum <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (type === 'OUT' && quantityNum > currentStock) {
      setError(`Not enough stock available (Current: ${currentStock})`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calculate new stock before making changes
      const newStock = type === 'IN' 
        ? currentStock + quantityNum
        : currentStock - quantityNum;

      // Start transaction
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .insert([{
          product_id: product.id,
          type,
          quantity: quantityNum,
          timestamp: new Date().toISOString(),
        }])
        .select();

      if (txError) throw txError;

      // Update product stock
      const { error: productError } = await supabase
        .from('products')
        .update({ current_stock: newStock })
        .eq('id', product.id);

      if (productError) throw productError;

      // Update local state
      setCurrentStock(newStock);
      setQuantity(1);
      
      // Refresh both transactions and products list
      await Promise.all([
        fetchTransactions(),
        refreshProducts?.()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="transactions-container">
        <h2>No Product Selected</h2>
        <p>Please select a product to view transactions</p>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <h2>Transactions for {product.name}</h2>
      <p>Current Stock: <strong>{currentStock}</strong></p>
      
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="transaction-form">
        <h3>Add Transaction</h3>
        
        <div className="form-group">
          <label>Type:</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            disabled={isLoading}
          >
            <option value="IN">Stock In</option>
            <option value="OUT">Stock Out</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Processing...' : 'Add Transaction'}
        </button>
      </form>
      
      <div className="transaction-history">
        <h3>Transaction History</h3>
        {isLoading && !transactions.length ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found for this product.</p>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Stock After</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => {
                  // Calculate stock after this transaction
                  const stockAfter = tx.type === 'IN' 
                    ? tx.stock_before + tx.quantity
                    : tx.stock_before - tx.quantity;

                  return (
                    <tr key={tx.id}>
                      <td>{new Date(tx.timestamp).toLocaleString()}</td>
                      <td className={`type-${tx.type.toLowerCase()}`}>
                        {tx.type}
                      </td>
                      <td>{tx.quantity}</td>
                      <td>{stockAfter}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}