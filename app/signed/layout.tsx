"use client";

import Toggle from "./components/toggle";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react";

function SignedLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const [userData, setUserData] = useState({
    id: "user-id",
    email: "teste@exemplo.com",
    created_at: new Date().toISOString(),
    image_url: "/avatar-placeholder.jpg",
    name: "Usuário Teste"
  });

  // Simulação de obtenção de dados do usuário - substituir por sua lógica real
  useEffect(() => {
    // Esta seria a chamada real para buscar dados do usuário
    // const getUserData = async () => {
    //   const data = await fetchUserData();
    //   setUserData(data);
    // };
    // getUserData();
  }, []);

  function formatElapsedTime(dateTime: Date): string {
    const currentDate = new Date();
    const difference = currentDate.getTime() - dateTime.getTime();
    const msPerMonth = 1000 * 60 * 60 * 24 * 30.4375; // média de dias em um mês
    const msPerYear = msPerMonth * 12;
    
    const monthsElapsed = Math.floor(difference / msPerMonth);
    const yearsElapsed = Math.floor(monthsElapsed / 12);
    
    let elapsedTimeStr = "";

    if (yearsElapsed === 0) {
        if (monthsElapsed === 1) {
            elapsedTimeStr = "criado há 1 mês";
        } else {
            elapsedTimeStr = `criado há ${monthsElapsed} meses`;
        }
    } else if (yearsElapsed === 1) {
        if (monthsElapsed % 12 === 0) {
            elapsedTimeStr = "criado há 1 ano";
        } else {
            elapsedTimeStr = `criado há 1 ano e ${monthsElapsed % 12} meses`;
        }
    } else {
        if (monthsElapsed % 12 === 0) {
            elapsedTimeStr = `criado há ${yearsElapsed} anos`;
        } else {
            elapsedTimeStr = `criado há ${yearsElapsed} anos e ${monthsElapsed % 12} meses`;
        }
    }

    return elapsedTimeStr;
  }

  // Função para verificar qual link está ativo
  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  // Classe para links ativos e inativos
  const getLinkClass = (path: string) => {
    return `flex items-center p-2 rounded-lg transition-colors duration-200 ${
      isActiveLink(path)
        ? "bg-blue-600 text-white" 
        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
    } group`;
  };

  return (
    <div className="w-full flex-grow">
      <div className="w-full flex-grow">
        <button
          data-drawer-target="logo-sidebar"
          data-drawer-toggle="logo-sidebar"
          aria-controls="logo-sidebar"
          type="button"
          className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>

        <aside
          id="logo-sidebar"
          className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="h-full flex flex-col px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            <a href="/signed/dashboard" className="flex items-center ps-2.5 mb-5">
              <div className="bg-blue-600 p-1 rounded-lg mr-2">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                FaceAuth
              </span>
            </a>

            <ul className="space-y-2 font-medium">
              {/* Dashboard */}
              <li>
                <a
                  href="/signed/dashboard"
                  className={getLinkClass("/signed/dashboard")}
                >
                  <svg
                    className={`w-5 h-5 transition duration-75 ${
                      isActiveLink("/signed/dashboard") 
                        ? "text-white" 
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  <span className="ms-3">Dashboard</span>
                </a>
              </li>

              {/* Cadastrar Usuário */}
              <li>
                <a
                  href="/signed/register-user"
                  className={getLinkClass("/signed/register-user")}
                >
                  <svg
                    className={`w-5 h-5 transition duration-75 ${
                      isActiveLink("/signed/register-user") 
                        ? "text-white" 
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                  </svg>

                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Cadastrar Cliente
                  </span>
                </a>
              </li>

              {/* Verificar Autenticador*/}
              <li>
                <a
                  href="/signed/verify-auth"
                  className={getLinkClass("/signed/verify-auth")}
                >
                  <svg
                    className={`w-5 h-5 transition duration-75 ${
                      isActiveLink("/signed/verify-auth") 
                        ? "text-white" 
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M6 3a3 3 0 0 0-3 3v1.5a.75.75 0 0 0 1.5 0V6A1.5 1.5 0 0 1 6 4.5h1.5a.75.75 0 0 0 0-1.5H6ZM16.5 3a.75.75 0 0 0 0 1.5H18A1.5 1.5 0 0 1 19.5 6v1.5a.75.75 0 0 0 1.5 0V6a3 3 0 0 0-3-3h-1.5ZM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5ZM4.5 16.5a.75.75 0 0 0-1.5 0V18a3 3 0 0 0 3 3h1.5a.75.75 0 0 0 0-1.5H6A1.5 1.5 0 0 1 4.5 18v-1.5ZM21 16.5a.75.75 0 0 0-1.5 0V18a1.5 1.5 0 0 1-1.5 1.5h-1.5a.75.75 0 0 0 0 1.5H18a3 3 0 0 0 3-3v-1.5Z" />
                  </svg>

                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Verificar Autenticador
                  </span>
                </a>
              </li>
              
              {/* Perfil - link adicional */}
              <li>
                <a
                  href="/signed/profile"
                  className={getLinkClass("/signed/profile")}
                >
                  <svg
                    className={`w-5 h-5 transition duration-75 ${
                      isActiveLink("/signed/profile") 
                        ? "text-white" 
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                  </svg>

                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Meu Perfil
                  </span>
                </a>
              </li>
            </ul>

            <div className="flex flex-1 items-end mb-6">
              <div className="flex justify-center items-center gap-2 ml-2">
                <img
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                  src={userData.image_url}
                  alt="Avatar do usuário"
                />
                <div className="font-medium text-sm dark:text-white">
                  <div>{userData.email}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatElapsedTime(new Date(userData.created_at))}
                  </div>
                </div>
                
                <Toggle />
              </div>
            </div>
          </div>
        </aside>

        <div className="p-4 flex-1 sm:ml-64">{children}</div>
      </div>
    </div>
  );
}

export default SignedLayout;
