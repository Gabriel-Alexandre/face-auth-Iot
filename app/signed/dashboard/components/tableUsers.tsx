"use client";

import { useState } from "react";

// Definindo interface para tipar corretamente os usuários
interface User {
  id: string;
  name: string;
  email: string;
  status: number;
  lastLogin: string;
  disabled?: boolean;
  banned?: boolean;
}

interface NewUserForm {
  name: string;
  email: string;
  status: number;
}

export default function TableUsers() {
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newUser, setNewUser] = useState<NewUserForm>({
    name: "",
    email: "",
    status: 1
  });
  
  // Estado para gerenciar o dropdown aberto
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // Estado para controlar a paginação
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  
  // Estado para armazenar os usuários
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Neil Sims",
      email: "neil.sims@flowbite.com",
      status: 1,
      lastLogin: "Há 2 horas",
    },
    {
      id: "2",
      name: "Bonnie Green",
      email: "bonnie@flowbite.com",
      status: 1,
      lastLogin: "Há 5 horas",
    },
    {
      id: "3",
      name: "Thomas Lean",
      email: "thomes@flowbite.com",
      status: 0,
      lastLogin: "Há 1 dia",
    },
    {
      id: "4",
      name: "Leslie Livingston",
      email: "leslie@flowbite.com",
      status: 0,
      lastLogin: "Há 2 dias",
      banned: true,
      disabled: true,
    },
    {
      id: "5",
      name: "Teste 1",
      email: "teste@flowbite.com",
      status: 1,
      lastLogin: "Há 30 minutos",
    },
    {
      id: "6",
      name: "Teste 2",
      email: "teste2@flowbite.com",
      status: 1,
      lastLogin: "Há 1 hora",
    },
    {
      id: "7",
      name: "Teste 3",
      email: "teste3@flowbite.com",
      status: 0,
      lastLogin: "Há 3 dias",
      banned: true,
    },
    {
      id: "8",
      name: "Maria Silva",
      email: "maria@exemplo.com",
      status: 1,
      lastLogin: "Há 4 horas",
    },
    {
      id: "9",
      name: "João Santos",
      email: "joao@exemplo.com",
      status: 0,
      lastLogin: "Há 6 dias",
    },
    {
      id: "10",
      name: "Pedro Oliveira",
      email: "pedro@exemplo.com",
      status: 1,
      lastLogin: "Há 1 semana",
    },
    {
      id: "11",
      name: "Ana Castro",
      email: "ana@exemplo.com",
      status: 1,
      lastLogin: "Há 2 horas",
    },
    {
      id: "12",
      name: "Carlos Pereira",
      email: "carlos@exemplo.com",
      status: 0,
      lastLogin: "Há 5 dias",
      disabled: true,
    },
  ]);

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };

  // Função para abrir/fechar dropdown
  const toggleDropdown = (userId: string) => {
    if (openDropdownId === userId) {
      setOpenDropdownId(null);
    } else {
      setOpenDropdownId(userId);
    }
  };

  // Fechar dropdown quando clicar fora
  const handleDocumentClick = () => {
    if (openDropdownId) {
      setOpenDropdownId(null);
    }
  };

  // Filtrar usuários com base na pesquisa
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Cálculos para paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

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

  // Função para adicionar um novo usuário
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    
    setLoading(true);
    // Simulando um atraso de rede
    setTimeout(() => {
      const newId = (users.length + 1).toString();
      const userToAdd: User = {
        id: newId,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status,
        lastLogin: "Agora mesmo"
      };
      
      setUsers([...users, userToAdd]);
      setNewUser({ name: "", email: "", status: 1 });
      setShowAddModal(false);
      setLoading(false);
    }, 500);
  };

  // Função para remover um usuário
  const handleRemoveUser = (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setUsers(users.filter(user => user.id !== userId));
      setLoading(false);
      setOpenDropdownId(null);
    }, 500);
  };

  // Função para banir um usuário
  const handleBanUser = (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, banned: true, status: 0 } 
          : user
      ));
      setLoading(false);
      setOpenDropdownId(null);
    }, 500);
  };

  // Função para desbanir um usuário
  const handleUnbanUser = (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, banned: false } 
          : user
      ));
      setLoading(false);
      setOpenDropdownId(null);
    }, 500);
  };

  // Função para desabilitar um usuário
  const handleDisableUser = (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, disabled: true, status: 0 } 
          : user
      ));
      setLoading(false);
      setOpenDropdownId(null);
    }, 500);
  };

  // Função para habilitar um usuário
  const handleEnableUser = (userId: string) => {
    setLoading(true);
    setTimeout(() => {
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, disabled: false } 
          : user
      ));
      setLoading(false);
      setOpenDropdownId(null);
    }, 500);
  };

  // Função para lidar com ações do dropdown
  const handleAction = (action: string, userId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    switch(action) {
      case "remover":
        handleRemoveUser(userId);
        break;
      case "banir":
        handleBanUser(userId);
        break;
      case "desbanir":
        handleUnbanUser(userId);
        break;
      case "desabilitar":
        handleDisableUser(userId);
        break;
      case "habilitar":
        handleEnableUser(userId);
        break;
      default:
        break;
    }
  };

  const renderRow = (item: User, index: number) => {
    const { id, name, email, status, lastLogin, disabled, banned } = item;
    const initials = getInitials(name);
    
    return (
      <tr key={id} className="border-b dark:border-gray-700">
        <th
          scope="row"
          className="flex items-center px-6 py-4 whitespace-nowrap dark:text-white"
        >
          <div className="flex items-center justify-center w-10 h-10 bg-gray-600 rounded-full">
            <span className="text-sm text-white">{initials}</span>
          </div>
          <div className="ps-3">
            <div className="font-semibold">{name}</div>
            <div className="text-sm text-gray-400">
              {email}
            </div>
            <div className="flex flex-col mt-1 space-y-1">
              {banned && <span className="text-xs text-red-400 px-2 py-0.5 bg-red-900 bg-opacity-20 rounded-sm inline-block w-fit">Usuário banido</span>}
              {disabled && <span className="text-xs text-yellow-400 px-2 py-0.5 bg-yellow-900 bg-opacity-20 rounded-sm inline-block w-fit">Usuário desabilitado</span>}
            </div>
          </div>
        </th>
        <td className="px-6 py-4">
          <div className="flex items-center">
            {status ? 
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> : 
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>}
            <span className="text-sm">
              {status ? "Autenticado" : "Não Autenticado"}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm">
          {lastLogin}
        </td>
        <td className="px-6 py-4 text-right">
          <div className="relative">
            <button 
              className="flex items-center justify-center w-8 h-8"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="19" cy="12" r="1"></circle>
                <circle cx="5" cy="12" r="1"></circle>
              </svg>
            </button>
            {openDropdownId === id && (
              <div className="absolute right-0 z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-700 bg-gray-800 text-white shadow-md">
                <div 
                  className="block px-3 py-2 text-sm hover:bg-gray-700 cursor-pointer"
                  onClick={(e) => handleAction("remover", id, e)}
                >
                  Remover
                </div>
                {banned ? 
                  <div 
                    className="block px-3 py-2 text-sm hover:bg-gray-700 cursor-pointer text-green-400"
                    onClick={(e) => handleAction("desbanir", id, e)}
                  >
                    Desbanir
                  </div>
                  :
                  <div 
                    className="block px-3 py-2 text-sm hover:bg-gray-700 cursor-pointer"
                    onClick={(e) => handleAction("banir", id, e)}
                  >
                    Banir
                  </div>
                }
                {disabled ? 
                  <div 
                    className="block px-3 py-2 text-sm hover:bg-gray-700 cursor-pointer text-green-400"
                    onClick={(e) => handleAction("habilitar", id, e)}
                  >
                    Habilitar
                  </div>
                  :
                  <div 
                    className="block px-3 py-2 text-sm hover:bg-gray-700 cursor-pointer"
                    onClick={(e) => handleAction("desabilitar", id, e)}
                  >
                    Desabilitar
                  </div>
                }
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-lg dark:bg-gray-800" onClick={handleDocumentClick}>
      <div className="w-full">
        <div className="flex justify-between items-center p-4">
          <h3 className="text-xl font-bold text-white">Clientes Registrados</h3>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="search"
                className="bg-gray-700 border-none text-white text-sm rounded-lg block w-full pl-10 p-2.5"
                placeholder="Buscar clientes"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Resetar para a primeira página ao pesquisar
                }}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </div>
            </div>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowAddModal(true);
              }}
            >
              Adicionar Cliente
            </button>
          </div>
        </div>
      </div>
      
      <table className="w-full text-left text-gray-400">
        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              CLIENTE
            </th>
            <th scope="col" className="px-6 py-3">
              STATUS
            </th>
            <th scope="col" className="px-6 py-3">
              ÚLTIMO ACESSO
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              AÇÕES
            </th>
          </tr>
        </thead>

        <tbody>
          {currentItems.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
      
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center text-sm text-gray-400">
          Mostrando <span className="font-medium mx-1">{currentItems.length}</span> de <span className="font-medium mx-1">{filteredUsers.length}</span> clientes (Página {currentPage} de {totalPages})
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
            disabled={currentPage === totalPages}
          >
            Próximo
          </button>
        </div>
      </div>

      {/* Modal para adicionar cliente */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowAddModal(false)}
        >
          <div 
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Adicionar Novo Cliente</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Nome</label>
              <input
                type="text"
                className="bg-gray-700 border-none text-white text-sm rounded-lg block w-full p-2.5"
                placeholder="Nome do cliente"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                className="bg-gray-700 border-none text-white text-sm rounded-lg block w-full p-2.5"
                placeholder="email@exemplo.com"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                className="bg-gray-700 border-none text-white text-sm rounded-lg block w-full p-2.5"
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: parseInt(e.target.value)})}
              >
                <option value={1}>Autenticado</option>
                <option value={0}>Não Autenticado</option>
              </select>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm"
                onClick={() => setShowAddModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                onClick={handleAddUser}
                disabled={loading}
              >
                {loading ? "Adicionando..." : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
