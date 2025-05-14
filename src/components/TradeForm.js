// components/TradeForm.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TradeForm = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    symbol: '',
    direction: 'long',
    entryDate: '',
    entryTime: '',
    entryPrice: '',
    exitDate: '',
    exitTime: '',
    exitPrice: '',
    quantity: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate P&L
    const entryValue = parseFloat(formData.entryPrice) * parseFloat(formData.quantity);
    const exitValue = parseFloat(formData.exitPrice) * parseFloat(formData.quantity);
    let pnl;
    
    if (formData.direction === 'long') {
      pnl = exitValue - entryValue;
    } else {
      pnl = entryValue - exitValue;
    }
    
    // Calculate win percentage
    const isWin = pnl > 0;
    
    onSubmit({
      ...formData,
      pnl,
      isWin,
      winRate: isWin ? 100 : 0,
      entryValue,
      exitValue
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Trade' : 'Add New Trade'}</h2>
      
      <div className="form-row">
        <div className="form-col">
          <div className="form-group">
            <label htmlFor="symbol">Symbol</label>
            <input
              type="text"
              id="symbol"
              name="symbol"
              value={formData.symbol}
              onChange={handleChange}
              placeholder="e.g. AAPL"
              required
            />
          </div>
        </div>
        <div className="form-col">
          <div className="form-group">
            <label htmlFor="direction">Direction</label>
            <select
              id="direction"
              name="direction"
              value={formData.direction}
              onChange={handleChange}
              required
            >
              <option value="long">Long</option>
              <option value="short">Short</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-col">
          <div className="form-group">
            <label htmlFor="entryDate">Entry Date</label>
            <input
              type="date"
              id="entryDate"
              name="entryDate"
              value={formData.entryDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-col">
          <div className="form-group">
            <label htmlFor="entryTime">Entry Time</label>
            <input
              type="time"
              id="entryTime"
              name="entryTime"
              value={formData.entryTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-col">
          <div className="form-group">
            <label htmlFor="entryPrice">Entry Price</label>
            <input
              type="number"
              id="entryPrice"
              name="entryPrice"
              step="0.01"
              min="0"
              value={formData.entryPrice}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
        </div>
        <div className="form-col">
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="0"
              step="0.01"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-col">
          <div className="form-group">
            <label htmlFor="exitDate">Exit Date</label>
            <input
              type="date"
              id="exitDate"
              name="exitDate"
              value={formData.exitDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-col">
          <div className="form-group">
            <label htmlFor="exitTime">Exit Time</label>
            <input
              type="time"
              id="exitTime"
              name="exitTime"
              value={formData.exitTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-col">
          <div className="form-group">
            <label htmlFor="exitPrice">Exit Price</label>
            <input
              type="number"
              id="exitPrice"
              name="exitPrice"
              step="0.01"
              min="0"
              value={formData.exitPrice}
              onChange={handleChange}
              placeholder="0.00"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="notes">Notes</label>
        <input
          type="text"
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Optional trade notes"
        />
      </div>
      
      <motion.button
        type="submit"
        className="button button-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {initialData ? 'Update Trade' : 'Add Trade'}
      </motion.button>
    </form>
  );
};

export default TradeForm;