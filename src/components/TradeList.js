// components/TradeList.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';

const TradeList = ({ trades, onDeleteTrade }) => {
  const [expandedTrade, setExpandedTrade] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const handleTradeClick = (tradeId) => {
    if (expandedTrade === tradeId) {
      setExpandedTrade(null);
    } else {
      setExpandedTrade(tradeId);
    }
  };

  // Sort trades by entry date, most recent first
  const sortedTrades = [...trades].sort((a, b) => {
    const dateA = a.entryDate ? new Date(a.entryDate) : new Date();
    const dateB = b.entryDate ? new Date(b.entryDate) : new Date();
    return dateB - dateA;
  });

  return (
    <div className="trade-list">
      <div className="trade-list-header">
        <div>Symbol</div>
        <div>Date</div>
        <div className="hide-on-mobile">Direction</div>
        <div>P&L</div>
        <div>Actions</div>
      </div>
      
      <AnimatePresence>
        {sortedTrades.map(trade => (
          <React.Fragment key={trade.id}>
            <motion.div 
              className="trade-list-item"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
              onClick={() => handleTradeClick(trade.id)}
            >
              <div><strong>{trade.symbol}</strong></div>
              <div>{formatDate(trade.entryDate)}</div>
              <div className="hide-on-mobile">{trade.direction === 'long' ? 'Long' : 'Short'}</div>
              <div className={trade.pnl >= 0 ? 'profit' : 'loss'}>
                {formatCurrency(trade.pnl)}
              </div>
              <div className="trade-actions">
                <button 
                  className="action-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTrade(trade.id);
                  }}
                >
                  ×
                </button>
              </div>
            </motion.div>
            
            <AnimatePresence>
              {expandedTrade === trade.id && (
                <motion.div 
                  className="trade-detail"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="trade-detail-header">
                    <div className="trade-detail-title">{trade.symbol} Trade Details</div>
                  </div>
                  
                  <div className="trade-detail-grid">
                    <div className="trade-detail-item">
                      <div className="trade-detail-label">Entry Date</div>
                      <div className="trade-detail-value">
                        {formatDate(trade.entryDate)} {trade.entryTime}
                      </div>
                    </div>
                    
                    <div className="trade-detail-item">
                      <div className="trade-detail-label">Exit Date</div>
                      <div className="trade-detail-value">
                        {formatDate(trade.exitDate)} {trade.exitTime}
                      </div>
                    </div>
                    
                    <div className="trade-detail-item">
                      <div className="trade-detail-label">Entry Price</div>
                      <div className="trade-detail-value">
                        {formatCurrency(trade.entryPrice)}
                      </div>
                    </div>
                    
                    <div className="trade-detail-item">
                      <div className="trade-detail-label">Exit Price</div>
                      <div className="trade-detail-value">
                        {formatCurrency(trade.exitPrice)}
                      </div>
                    </div>
                    
                    <div className="trade-detail-item">
                      <div className="trade-detail-label">Quantity</div>
                      <div className="trade-detail-value">
                        {trade.quantity}
                      </div>
                    </div>
                    
                    <div className="trade-detail-item">
                      <div className="trade-detail-label">Direction</div>
                      <div className="trade-detail-value">
                        {trade.direction === 'long' ? 'Long' : 'Short'}
                      </div>
                    </div>
                    
                    <div className="trade-detail-item">
                      <div className="trade-detail-label">P&L</div>
                      <div className={`trade-detail-value ${trade.pnl >= 0 ? 'profit' : 'loss'}`}>
                        {formatCurrency(trade.pnl)}
                      </div>
                    </div>
                    
                    <div className="trade-detail-item">
                      <div className="trade-detail-label">Win/Loss</div>
                      <div className={`trade-detail-value ${trade.pnl >= 0 ? 'profit' : 'loss'}`}>
                        {trade.pnl >= 0 ? 'Win' : 'Loss'}
                      </div>
                    </div>
                  </div>
                  
                  {trade.notes && (
                    <div className="trade-detail-item">
                      <div className="trade-detail-label">Notes</div>
                      <div className="trade-detail-value">
                        {trade.notes}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </React.Fragment>
        ))}
      </AnimatePresence>
      
      {trades.length === 0 && (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          No trades found. Add your first trade to get started!
        </div>
      )}
    </div>
  );
};

export default TradeList;