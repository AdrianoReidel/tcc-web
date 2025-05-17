'use client';

import React, { useState } from 'react';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  minDate?: string;
  reservedDates?: { start: Date; end: Date }[];
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect, minDate, reservedDates = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateReserved = (date: Date) => {
    return reservedDates.some((range) => {
      const start = new Date(range.start);
      const end = new Date(range.end);
      return date >= start && date <= end;
    });
  };

  const handleDayClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = selected.toISOString().split('T')[0];

    if (minDate) {
      const min = new Date(minDate);
      if (selected < min) {
        return;
      }
    }

    if (isDateReserved(selected)) {
      return;
    }

    onDateSelect(formattedDate);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-64">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-blue-500 hover:text-blue-700">
          &lt;
        </button>
        <span className="text-lg font-medium">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <button onClick={nextMonth} className="text-blue-500 hover:text-blue-700">
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {daysArray.map((day) => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const dateStr = date.toISOString().split('T')[0];
          const isSelected = selectedDate === dateStr;
          const isPastDate = minDate ? date < new Date(minDate) : false;
          const isReserved = isDateReserved(date);

          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`p-2 rounded-full cursor-pointer ${
                isSelected
                  ? 'bg-blue-500 text-white'
                  : isPastDate || isReserved
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'hover:bg-blue-100'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;