// components/TradeStats.js
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const TradeStats = ({ trades }) => {
  const stats = useMemo(() => {
    // Initial values
    const initialStats = {
      totalPnL: 0,
      totalTrades: trades.length,
      winCount: 0,
      lossCount: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      profitFactor: 0,
      bestTrade: null,
      worstTrade: null
    };
    
    if (trades.length === 0) return initialStats;
    
    // Calculate stats
    const calculated = trades.reduce((acc, trade) => {
      // P&L
      acc.totalPnL += trade.pnl;
      
      // Win/Loss
      if (trade.pnl > 0) {
        acc.winCount++;
        acc.totalWinAmount += trade.pnl;
        
        // Track best trade
        if (!acc.bestTrade || trade.pnl > acc.bestTrade.pnl) {
          acc.bestTrade = trade;
        }
      } else {
        acc.lossCount++;
        acc.totalLossAmount += Math.abs(trade.pnl);
        
        // Track worst trade
        if (!acc.worstTrade || trade.pnl < acc.worstTrade.pnl) {
          acc.worstTrade = trade;
        }
      }
      
      return acc;
    }, {
      ...initialStats,
      totalWinAmount: 0,
      totalLossAmount: 0
    });
    
    // Derived stats
    calculated.winRate = calculated.totalTrades > 0 
      ? (calculated.winCount / calculated.totalTrades * 100) 
      : 0;
      
    calculated.avgWin = calculated.winCount > 0 
      ? calculated.totalWinAmount / calculated.winCount 
      : 0;
      
    calculated.avgLoss = calculated.lossCount > 0 
      ? calculated.totalLossAmount / calculated.lossCount 
      : 0;
      
    calculated.profitFactor = calculated.totalLossAmount > 0 
      ? calculated.totalWinAmount / calculated.totalLossAmount 
      : calculated.totalWinAmount > 0 ? Infinity : 0;
    
    return calculated;
  }, [trades]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="stats-container">
      <motion.div 
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="stat-title">Total P&L</div>
        <div className={`stat-value ${stats.totalPnL >= 0 ? 'profit' : 'loss'}`}>
          {formatCurrency(stats.totalPnL)}
        </div>
      </motion.div>
      
      <motion.div 
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="stat-title">Win Rate</div>
        <div className="stat-value">
          {stats.winRate.toFixed(1)}%
        </div>
      </motion.div>
      
      <motion.div 
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="stat-title">Total Trades</div>
        <div className="stat-value">
          {stats.totalTrades}
        </div>
      </motion.div>
      
      <motion.div 
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="stat-title">Profit Factor</div>
        <div className="stat-value">
          {stats.profitFactor === Infinity ? '∞' : stats.profitFactor.toFixed(2)}
        </div>
      </motion.div>
      
      <motion.div 
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <div className="stat-title">Avg. Win</div>
        <div className="stat-value profit">
          {formatCurrency(stats.avgWin)}
        </div>
      </motion.div>
      
      <motion.div 
        className="stat-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="stat-title">Avg. Loss</div>
        <div className="stat-value loss">
          {formatCurrency(stats.avgLoss)}
        </div>
      </motion.div>
    </div>
  );
};

export default TradeStats;