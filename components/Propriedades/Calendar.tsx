'use client';

import React, { useState } from 'react';

interface CalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateSelect }) => {
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

  const handleDayClick = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = selected.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    onDateSelect(formattedDate);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-64">
      {/* Cabeçalho do Calendário */}
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

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-500">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>

      {/* Dias do Mês */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* Espaços vazios antes do primeiro dia */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {daysArray.map((day) => {
          const dateStr = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            .toISOString()
            .split('T')[0];
          const isSelected = selectedDate === dateStr;
          return (
            <div
              key={day}
              onClick={() => handleDayClick(day)}
              className={`p-2 rounded-full cursor-pointer ${
                isSelected ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
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