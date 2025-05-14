// components/TradeCalendar.js
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  addDays, isSameMonth, isToday, parseISO, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';

const TradeCalendar = ({ trades, currentMonth, setCurrentMonth, onDeleteTrade }) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const dateStart = startOfWeek(monthStart);
  const dateEnd = endOfWeek(monthEnd);

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const renderTradesForDay = (day) => {
    const dayTrades = trades.filter(trade => {
      const entryDate = trade.entryDate ? parseISO(trade.entryDate) : new Date(trade.entryValue);
      return isSameDay(entryDate, day);
    });

    if (dayTrades.length === 0) return null;

    // Calculate daily P&L
    const dailyPnL = dayTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const winCount = dayTrades.filter(trade => trade.isWin).length;
    const winRate = dayTrades.length > 0 ? (winCount / dayTrades.length) * 100 : 0;

    return (
      <motion.div 
        className={`trade-cell ${dailyPnL >= 0 ? 'trade-profit' : 'trade-loss'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div>{formatCurrency(dailyPnL)}</div>
        <div>{dayTrades.length} {dayTrades.length === 1 ? 'trade' : 'trades'}</div>
        <div>{winRate.toFixed(0)}% win</div>
      </motion.div>
    );
  };

  const renderDays = () => {
    const dateFormat = 'd';
    const days = [];
    let day = dateStart;

    while (day <= dateEnd) {
      const formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      days.push(
        <div
          className={`calendar-day ${
            !isSameMonth(day, monthStart)
              ? 'disabled'
              : isToday(day)
              ? 'today'
              : ''
          }`}
          key={day}
        >
          <div className="day-number">{formattedDate}</div>
          {renderTradesForDay(cloneDay)}
        </div>
      );
      
      day = addDays(day, 1);
    }
    
    return days;
  };

  const renderHeader = () => {
    const dateFormat = 'MMMM yyyy';
    return (
      <div className="calendar-header">
        <div className="month-label">
          {format(currentMonth, dateFormat)}
        </div>
        <div className="calendar-nav">
          <button onClick={prevMonth}>&lt;</button>
          <button onClick={nextMonth}>&gt;</button>
        </div>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = daysOfWeek.map(day => (
      <div className="calendar-day-header" key={day}>
        {day}
      </div>
    ));
    return <div className="calendar-grid">{days}</div>;
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDaysOfWeek()}
      <div className="calendar-grid">
        {renderDays()}
      </div>
    </div>
  );
};

export default TradeCalendar;