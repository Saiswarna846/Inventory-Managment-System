import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import Products from './Products';
import Transactions from './Transactions';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="App">
      <header>
        <h1>Inventory Management System</h1>
        <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
      </header>
      
      <nav>
        <button 
          onClick={() => setActiveTab('products')} 
          className={activeTab === 'products' ? 'active' : ''}
        >
          Products
        </button>
        <button 
          onClick={() => setActiveTab('transactions')} 
          className={activeTab === 'transactions' ? 'active' : ''}
        >
          Transactions
        </button>
      </nav>

      <main>
        {activeTab === 'products' ? (
          <Products 
            setActiveTab={setActiveTab} 
            setSelectedProduct={setSelectedProduct} 
          />
        ) : (
          <Transactions product={selectedProduct} />
        )}
      </main>
    </div>
  );
}

export default App;