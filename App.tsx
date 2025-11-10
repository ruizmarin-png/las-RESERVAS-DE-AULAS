import React, { useState, useCallback, useEffect } from 'react';
import type { Booking, SelectedSlot } from './types';
import ClassroomSchedule from './components/ClassroomSchedule';
import BookingModal from './components/BookingModal';
import { CLASSROOMS, DAYS } from './constants';

const App: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
        const savedBookings = localStorage.getItem('classroomBookings');
        return savedBookings ? JSON.parse(savedBookings) : [];
    } catch (error) {
        console.error("Failed to parse bookings from localStorage", error);
        return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [currentDay, setCurrentDay] = useState<string>(() => {
    const dayIndex = new Date().getDay();
    // Sunday is 0, Monday is 1... Default to Monday if it's weekend.
    return dayIndex > 0 && dayIndex < 6 ? DAYS[dayIndex - 1] : DAYS[0];
  });
  const [currentClassroom, setCurrentClassroom] = useState<string>(CLASSROOMS[0]);

  useEffect(() => {
    try {
        localStorage.setItem('classroomBookings', JSON.stringify(bookings));
    } catch (error) {
        console.error("Failed to save bookings to localStorage", error);
    }
  }, [bookings]);

  const handleSelectSlot = useCallback((shift: 'Mañana' | 'Tarde', period: string) => {
    setSelectedSlot({ classroom: currentClassroom, day: currentDay, shift, period });
    setIsModalOpen(true);
  }, [currentDay, currentClassroom]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedSlot(null);
  }, []);

  const handleBookSlot = useCallback((user: string) => {
    if (selectedSlot) {
      const newBooking: Booking = {
        id: `${selectedSlot.day}-${selectedSlot.classroom}-${selectedSlot.shift}-${selectedSlot.period}-${Date.now()}`,
        ...selectedSlot,
        user,
      };
      setBookings((prevBookings) => [...prevBookings, newBooking]);
      handleCloseModal();
    }
  }, [selectedSlot, handleCloseModal]);

  const handleRemoveBooking = useCallback((bookingId: string) => {
      setBookings(prev => prev.filter(b => b.id !== bookingId));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
            Sistema de Reserva de Aulas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Selecciona un día y un aula para ver su disponibilidad.
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Día de la semana</label>
                    <div className="flex flex-wrap justify-start gap-2">
                        {DAYS.map(day => (
                            <button 
                                key={day} 
                                onClick={() => setCurrentDay(day)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 flex-grow md:flex-grow-0 ${
                                    currentDay === day 
                                    ? 'bg-indigo-600 text-white shadow' 
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Aula</label>
                    <div className="flex flex-wrap justify-start gap-2">
                        {CLASSROOMS.map(classroom => (
                            <button 
                                key={classroom} 
                                onClick={() => setCurrentClassroom(classroom)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 flex-grow md:flex-grow-0 ${
                                    currentClassroom === classroom 
                                    ? 'bg-indigo-600 text-white shadow' 
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {classroom}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        
        <ClassroomSchedule 
            classroom={currentClassroom}
            bookings={bookings.filter(b => b.day === currentDay && b.classroom === currentClassroom)} 
            onSelectSlot={handleSelectSlot} 
            onRemoveBooking={handleRemoveBooking}
        />
      </main>

      <BookingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onBook={handleBookSlot}
        selectedSlot={selectedSlot}
      />
    </div>
  );
};

export default App;
