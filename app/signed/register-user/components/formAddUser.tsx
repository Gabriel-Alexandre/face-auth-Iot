'use client'

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormAddUser = ({...props}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createUser = async (userData: {
    name: string;
    email: string;
    phone: string;
    date: string;
    userId: string;
    image: string;
  }): Promise<[number, string]> => {
    // Simulação de envio para API - substitua por sua implementação real
    return new Promise(resolve => {
      setTimeout(() => {
        console.log("User data submitted:", userData);
        resolve([1, "Usuário cadastrado com sucesso"]);
      }, 1000);
    });
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const date = formData.get('date') as string;
    
    try {
      let response: [number, string];
      if (!props.imgURL) {
        const fileInput = document.getElementById('file_input') as HTMLInputElement;
        const file = fileInput?.files?.[0];
        
        if (!file) {
          toast.error("Por favor, adicione uma imagem");
          setIsSubmitting(false);
          return;
        }
        
        const fileString = await fileToString(file);
        response = await createUser({
          name, 
          email, 
          phone, 
          date, 
          userId: props.user.id, 
          image: fileString
        });
      } else {
        response = await createUser({
          name, 
          email, 
          phone, 
          date, 
          userId: props.user.id, 
          image: props.imgURL
        });
      }
      
      if (response[0] === 0) {
        toast.error(response[1]);
      } else {
        toast.success(response[1]);
        // Limpar o formulário após o sucesso
        event.currentTarget.reset();
        if (props.setImgURL) props.setImgURL(undefined);
        if (props.setImgCaptured) props.setImgCaptured(false);
      }
    } catch (error) {
      toast.error("Erro ao cadastrar usuário");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  function fileToString(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  return (
    <form className="w-full mx-auto" onSubmit={submit}>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Nome
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="Nome completo"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder="name@faceAuth.com"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Celular
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="(99) 99999-999"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Data de Nascimento
        </label>
        <input
          type="date"
          id="date"
          name="date"
          required
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
        />
      </div>

      
      {!props.imgCaptured && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Adicionar imagem do usuário
          </label>
          <input 
            required={!props.imgURL} 
            className="block mb-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
            name="file_image" 
            id="file_input" 
            type="file" 
            accept="image/png, image/jpeg"
          />
          
          {!props.showCamera && (
            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-full h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"/>
              <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/4 bg-white left-1/8 dark:text-white dark:bg-gray-800">ou</span>
            </div>
          )}
        </div>
      )}

      <div className="w-full flex flex-col md:flex-row justify-center gap-4 mt-4">
        {!props.showCamera && (
          <button 
            type="button" 
            className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            onClick={props.toggleCamera}
          >
            Tirar foto
          </button>
        )}
        
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
              Cadastrando...
            </>
          ) : "Cadastrar usuário"}
        </button>
      </div>
      <ToastContainer position="bottom-center" autoClose={2000} limit={1} />
    </form>
  );
}

export default FormAddUser;