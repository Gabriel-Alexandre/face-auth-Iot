'use client';

import { useState } from 'react';

// Dados mockados para a atividade recente
const activityMockData = [
  { id: 1, type: 'success', message: 'Login bem-sucedido', time: 'Há 1 minuto', user: 'Maria Silva' },
  { id: 2, type: 'error', message: 'Falha de autenticação', time: 'Há 2 minutos', user: 'João Santos' },
  { id: 3, type: 'success', message: 'Login bem-sucedido', time: 'Há 3 minutos', user: 'Pedro Oliveira' },
  { id: 4, type: 'error', message: 'Falha de autenticação', time: 'Há 4 minutos', user: 'Ana Costa' },
  { id: 5, type: 'success', message: 'Login bem-sucedido', time: 'Há 5 minutos', user: 'Carlos Pereira' },
  { id: 6, type: 'error', message: 'Tempo esgotado', time: 'Há 7 minutos', user: 'Laura Mendes' },
  { id: 7, type: 'success', message: 'Login bem-sucedido', time: 'Há 10 minutos', user: 'Thiago Souza' },
  { id: 8, type: 'error', message: 'Falha de autenticação', time: 'Há 12 minutos', user: 'Juliana Lima' },
  { id: 9, type: 'success', message: 'Login bem-sucedido', time: 'Há 15 minutos', user: 'Marcos Oliveira' },
  { id: 10, type: 'error', message: 'Tempo esgotado', time: 'Há 20 minutos', user: 'Fernanda Costa' },
  { id: 11, type: 'success', message: 'Login bem-sucedido', time: 'Há 25 minutos', user: 'Ricardo Santos' },
  { id: 12, type: 'error', message: 'Falha de autenticação', time: 'Há 30 minutos', user: 'Camila Alves' },
];

export default function ActivityLog() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const itemsPerPage = 5;

  // Função para filtrar atividades
  const filteredActivities = activityMockData.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  // Cálculos para paginação
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredActivities.slice(indexOfFirstItem, indexOfLastItem);

  // Navegar para página anterior
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navegar para próxima página
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h3 className="text-xl font-bold text-white">Atividade Recente</h3>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button 
              className={`px-3 py-1 text-xs rounded-md transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
              onClick={() => {
                setFilter('all');
                setCurrentPage(1);
              }}
            >
              Todos
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded-md transition-colors ${filter === 'success' ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
              onClick={() => {
                setFilter('success');
                setCurrentPage(1);
              }}
            >
              Sucessos
            </button>
            <button 
              className={`px-3 py-1 text-xs rounded-md transition-colors ${filter === 'error' ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
              onClick={() => {
                setFilter('error');
                setCurrentPage(1);
              }}
            >
              Erros
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-700">
        {currentItems.map((activity) => (
          <div 
            key={activity.id} 
            className="flex items-center gap-4 p-4 hover:bg-gray-700 transition-colors"
          >
            <div className={`w-3 h-3 rounded-full ${activity.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium text-white">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-400">
                  {activity.time}
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Usuário: {activity.user}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
        <div className="flex items-center text-sm text-gray-400">
          Mostrando <span className="font-medium mx-1">{currentItems.length}</span> de <span className="font-medium mx-1">{filteredActivities.length}</span> atividades
        </div>
        <div className="flex gap-1">
          <button 
            className={`px-3 py-1 text-sm text-gray-400 bg-gray-700 border border-gray-600 rounded ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-600 cursor-pointer'}`}
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <button 
            className={`px-3 py-1 text-sm text-gray-400 bg-gray-700 border border-gray-600 rounded ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-600 cursor-pointer'}`}
            onClick={goToNextPage}
            disabled={currentPage === totalPages || filteredActivities.length === 0}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
} 