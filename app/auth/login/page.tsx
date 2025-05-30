'use client'

import { signIn } from "@/lib/auth/auth";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const router = useRouter();
  const pathName = usePathname();

  const [loading, setLoading] = useState<boolean| undefined>(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget); 
    const response = await signIn(formData);
    
    if(response[0] === 0) {
      toast.error(response[1]);
    } else {
      toast.success(response[1]);
      console.log("Login bem-sucedido, redirecionando...");
      console.log("PathName atual:", pathName);
      
      // Redirecionamento direto para o dashboard
      router.push("/signed/dashboard");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2"> 
      <a href="/" className="flex justify-center items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
          FaceAuth    
      </a>
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={submit}>
          <span className="text-2xl flex items-center font-extrabold dark:text-white">Acessar conta</span>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="email"
            >
              E-mail
            </label>
            <input
              className=" border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-300 dark:border-gray-200 dark:placeholder-gray-400 dark:text-gray-800"
              name="email"
              defaultValue="teste@exemplo.com"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              className=" border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-300 dark:border-gray-200 dark:placeholder-gray-400 dark:text-gray-800"
              type="password"
              name="password"
              defaultValue="senha123"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                />
              </div>
              <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                Lembre de mim
              </label>
            </div>
            <a
              href="#"
              className="ms-auto text-sm text-color4 hover:underline dark:text-color4"
            >
              Esqueceu a senha?
            </a>
          </div>

          <button
            disabled={loading}
            type={'submit'}
            className="w-full text-white bg-color4 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {loading ? 'Entrando...' : 'Entrar'} 
          </button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Não é cadastrado ainda?{" "}
            <a
              href="/auth/register"
              className="text-color4 hover:underline dark:text-color4"
            >
              Crie uma conta
            </a>
          </div>
        </form>
      </div>
      <ToastContainer position="bottom-center" autoClose={2000}/>
    </div>
  );
}
