// App.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import './App.css';
import TradeForm from './components/TradeForm';
import TradeCalendar from './components/TradeCalendar';
import TradeStats from './components/TradeStats';
import TradeList from './components/TradeList';

function App() {
  const [trades, setTrades] = useState(() => {
    const savedTrades = localStorage.getItem('trades');
    return savedTrades ? JSON.parse(savedTrades) : [];
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState('calendar'); // 'calendar' or 'list'
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);

  const addTrade = (trade) => {
    const newTrade = {
      ...trade,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTrades([...trades, newTrade]);
    setIsFormOpen(false);
  };

  const deleteTrade = (id) => {
    setTrades(trades.filter(trade => trade.id !== id));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Trading Journal</h1>
        <div className="view-controls">
          <button 
            className={`view-button ${currentView === 'calendar' ? 'active' : ''}`}
            onClick={() => setCurrentView('calendar')}
          >
            Calendar
          </button>
          <button 
            className={`view-button ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => setCurrentView('list')}
          >
            List
          </button>
        </div>
      </header>

      <TradeStats trades={trades} />
      
      <div className="main-content">
        <AnimatePresence mode="wait">
          {currentView === 'calendar' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TradeCalendar 
                trades={trades} 
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                onDeleteTrade={deleteTrade}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <TradeList 
                trades={trades} 
                onDeleteTrade={deleteTrade}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <button className="close-button" onClick={() => setIsFormOpen(false)}>×</button>
              <TradeForm onSubmit={addTrade} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        className="add-trade-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsFormOpen(true)}
      >
        + Add Trade
      </motion.button>
    </div>
  );
}

export default App;