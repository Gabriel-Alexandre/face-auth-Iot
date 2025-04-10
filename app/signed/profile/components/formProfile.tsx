"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function FormProfile(props: any) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const updateProfile = async (data: any) => {
    // Simulação de atualização do perfil
    return new Promise((resolve) => {
      console.log("Dados a serem atualizados:", data);
      setTimeout(() => {
        resolve([1, "Perfil atualizado com sucesso"]);
      }, 1000);
    });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeat-password") as string;

    // Validação
    if ((password || repeatPassword) && password !== repeatPassword) {
      toast.error("As senhas digitadas não são iguais.");
      setIsSubmitting(false);
      return;
    }

    try {
      let response: any;
      
      if (name && (password || repeatPassword)) {
        // Atualizar nome e senha
        response = await updateProfile({ name, password, userId: props.user.id });
      } else if (password) {
        // Apenas senha
        response = await updateProfile({ password, userId: props.user.id });
      } else if (name) {
        // Apenas nome
        response = await updateProfile({ name, userId: props.user.id });
      } else {
        toast.error("Preencha os campos para atualizar suas informações.");
        setIsSubmitting(false);
        return;
      }

      if (response[0] === 0) {
        toast.error(response[1] || "Erro ao atualizar perfil.");
      } else {
        toast.success(response[1] || "Perfil atualizado com sucesso!");
        if (formRef.current) {
          formRef.current.reset();
        }
      }
    } catch (error) {
      toast.error("Erro ao atualizar o perfil.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-6">
      <form ref={formRef} className="space-y-6" onSubmit={submit}>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            value={props.user.email}
            disabled
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Nome
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Seu nome completo"
          />
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h5 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Mudar senha
          </h5>
          
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nova Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Repetir Nova Senha
            </label>
            <input
              type="password"
              id="repeat-password"
              name="repeat-password"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            />
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <svg className="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Atualizando...
              </>
            ) : "Atualizar perfil"}
          </button>
        </div>
      </form>
    </div>
  );
}
