import React from 'react';
import type { Booking } from '../types';
import { MORNING_PERIODS, AFTERNOON_PERIODS } from '../constants';
import PlusIcon from './icons/PlusIcon';
import UserIcon from './icons/UserIcon';
import ClockIcon from './icons/ClockIcon';

interface ClassroomScheduleProps {
  classroom: string;
  bookings: Booking[];
  onSelectSlot: (shift: 'Mañana' | 'Tarde', period: string) => void;
  onRemoveBooking: (bookingId: string) => void;
}

const ClassroomSchedule: React.FC<ClassroomScheduleProps> = ({
  classroom,
  bookings,
  onSelectSlot,
  onRemoveBooking,
}) => {
  const renderPeriodRow = (period: string, shift: 'Mañana' | 'Tarde') => {
    const booking = bookings.find(
      (b) => b.shift === shift && b.period === period
    );

    return (
      <div key={`${shift}-${period}`} className="grid grid-cols-3 items-center border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        {/* Period Name */}
        <div className="col-span-1 bg-white dark:bg-gray-800 flex items-center p-3 font-semibold text-sm text-gray-600 dark:text-gray-300">
          <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{period} hora</span>
        </div>
        
        {/* Booking status */}
        <div className="col-span-2 p-2 bg-white dark:bg-gray-800 min-h-[70px]">
          {booking ? (
            <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg flex items-center justify-between h-full">
              <div className="flex items-center min-w-0">
                <UserIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                <span className="font-semibold break-words truncate">{booking.user}</span>
              </div>
              <button
                onClick={() => onRemoveBooking(booking.id)}
                className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium ml-4 transition-colors flex-shrink-0"
              >
                Liberar
              </button>
            </div>
          ) : (
            <button
              onClick={() => onSelectSlot(shift, period)}
              className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 hover:bg-green-50 dark:hover:bg-green-900/30 hover:border-green-400 dark:hover:border-green-600 hover:text-green-600 dark:hover:text-green-400 transition-all duration-200 group"
            >
              <PlusIcon className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
              <span className="ml-2 text-sm font-medium">Reservar</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Morning Shift */}
      <div className="p-3 font-bold text-lg text-center bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 rounded-t-xl">
        Turno de Mañana
      </div>
      <div className="border-x border-gray-200 dark:border-gray-700">
        {MORNING_PERIODS.map((period) => renderPeriodRow(period, 'Mañana'))}
      </div>

      {/* Afternoon Shift */}
      <div className="mt-4 p-3 font-bold text-lg text-center bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 rounded-t-xl">
        Turno de Tarde
      </div>
      <div className="border-x border-b border-gray-200 dark:border-gray-700 rounded-b-xl">
        {AFTERNOON_PERIODS.map((period) => renderPeriodRow(period, 'Tarde'))}
      </div>
    </div>
  );
};

export default ClassroomSchedule;
