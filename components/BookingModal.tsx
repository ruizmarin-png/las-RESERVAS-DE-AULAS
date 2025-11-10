import React, { useState, useEffect, useRef } from 'react';
import type { SelectedSlot } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (user: string) => void;
  selectedSlot: SelectedSlot | null;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onBook, selectedSlot }) => {
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUser('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen || !selectedSlot) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.trim() === '') {
      setError('El nombre no puede estar vacío.');
      return;
    }
    onBook(user);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md transform transition-all duration-300 ease-out scale-95 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">Reservar Aula</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Reservando aula <span className="font-semibold text-indigo-500 dark:text-indigo-400">{selectedSlot.classroom}</span> para el <span className="font-semibold text-indigo-500 dark:text-indigo-400">{selectedSlot.day}</span>,
          turno de <span className="font-semibold text-indigo-500 dark:text-indigo-400">{selectedSlot.shift}</span> a <span className="font-semibold text-indigo-500 dark:text-indigo-400">{selectedSlot.period}</span> hora.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tu Nombre
            </label>
            <input
              ref={inputRef}
              type="text"
              id="name"
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
                if (error) setError('');
              }}
              placeholder="Ej: Juan Pérez"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
            >
              Confirmar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
