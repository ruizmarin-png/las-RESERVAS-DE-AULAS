import React, { useState, useCallback, useEffect } from 'react';
import type { Booking, SelectedSlot } from './types';
import ClassroomSchedule from './components/ClassroomSchedule';
import BookingModal from './components/BookingModal';
import DatePicker from './components/DatePicker';
import { CLASSROOMS } from './constants';
import TrashIcon from './components/icons/TrashIcon';

const getInitialDate = (): Date => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay();

    if (dayOfWeek === 6) { // Saturday
        today.setDate(today.getDate() + 2);
    } else if (dayOfWeek === 0) { // Sunday
        today.setDate(today.getDate() + 1);
    }
    return today;
};

const formatDateForStorage = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

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
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate);
  const [currentClassroom, setCurrentClassroom] = useState<string>(CLASSROOMS[0]);

  useEffect(() => {
    try {
        localStorage.setItem('classroomBookings', JSON.stringify(bookings));
    } catch (error) {
        console.error("Failed to save bookings to localStorage", error);
    }
  }, [bookings]);
  
  const handleDateChange = (date: Date) => {
    date.setHours(0, 0, 0, 0);
    setSelectedDate(date);
  };

  const handleSelectSlot = useCallback((shift: 'Mañana' | 'Tarde', period: string) => {
    const day = formatDateForStorage(selectedDate);
    setSelectedSlot({ classroom: currentClassroom, day, shift, period });
    setIsModalOpen(true);
  }, [selectedDate, currentClassroom]);

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

  const handleResetAllBookings = useCallback(() => {
    if (window.confirm('¿Estás seguro de que quieres eliminar TODAS las reservas? Esta acción no se puede deshacer.')) {
      setBookings([]);
    }
  }, []);
  
  const selectedDateForFiltering = formatDateForStorage(selectedDate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
            Sistema de Reserva de Aulas
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Selecciona una fecha y un aula para ver su disponibilidad.
          </p>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 lg:max-w-sm">
                    <label className="block text-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Selecciona una fecha</label>
                    <DatePicker selectedDate={selectedDate} onDateChange={handleDateChange} />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Aula</label>
                        <div className="flex flex-wrap justify-start gap-2">
                            {CLASSROOMS.map(classroom => (
                                <button 
                                    key={classroom} 
                                    onClick={() => setCurrentClassroom(classroom)}
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 flex-grow sm:flex-grow-0 ${
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
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleResetAllBookings}
                            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white dark:border-red-500 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                            aria-label="Borrar todas las reservas"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            <span>Borrar Todas las Reservas</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Horario para el <span className="text-indigo-600 dark:text-indigo-400">{selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
        </h2>
        
        <ClassroomSchedule 
            classroom={currentClassroom}
            bookings={bookings.filter(b => b.day === selectedDateForFiltering && b.classroom === currentClassroom)} 
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