import React, { useState } from 'react';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
  const [displayDate, setDisplayDate] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const daysOfWeek = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

  const changeMonth = (offset: number) => {
    setDisplayDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const renderCalendar = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon,...
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Adjust for week starting on Monday (0=Mon, 6=Sun)
    const startOffset = (firstDayOfMonth === 0) ? 6 : firstDayOfMonth - 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // FIX: Changed JSX.Element[] to React.ReactElement[] to fix "Cannot find namespace 'JSX'" error.
    const cells: React.ReactElement[] = [];

    // Blank cells before the first day
    for (let i = 0; i < startOffset; i++) {
      cells.push(<div key={`blank-${i}`} className="w-full h-12"></div>);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dayOfWeek = currentDate.getDay(); // 0=Sun, 6=Sat
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const isSelected = selectedDate.getTime() === currentDate.getTime();
      const isToday = today.getTime() === currentDate.getTime();

      let cellClasses = 'w-full h-12 flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-150 ';
      if (isWeekend) {
        cellClasses += 'text-gray-400 dark:text-gray-600 cursor-not-allowed';
      } else {
        if (isSelected) {
          cellClasses += 'bg-indigo-600 text-white shadow-lg';
        } else if (isToday) {
          cellClasses += 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-200';
        } else {
          cellClasses += 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700';
        }
      }

      cells.push(
        <button
          key={day}
          disabled={isWeekend}
          onClick={() => onDateChange(currentDate)}
          className={cellClasses}
          aria-label={`Select date ${day}`}
          aria-pressed={isSelected}
        >
          {day}
        </button>
      );
    }

    return cells;
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Previous month">
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {displayDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' }).replace(/^\w/, c => c.toUpperCase())}
        </h3>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Next month">
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>
    </div>
  );
};

export default DatePicker;