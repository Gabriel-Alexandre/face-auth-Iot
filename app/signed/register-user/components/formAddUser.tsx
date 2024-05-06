'use client'

import { createClientTable, uploadImageUser } from "@/lib/users/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormAddUser = ({...props}) => {

  const submit = async  (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name:any = formData.get('name');
    const email:any = formData.get('email');
    const phone:any = formData.get('phone');
    const date:any = formData.get('date');
    const file_image = formData.get('file_image');

    const fileString = await fileToString(file_image);
    const response:any = await createClientTable(name, email, phone, date, props.user.id,  fileString);

    if (response[0] === 0) {
      toast.error(response[1]);
    } else {
      toast.success(response[1]);
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
    <form className="max-w-sm mx-auto" onSubmit={submit}>
      <div className="mb-2">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Nome
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder={""}
          required
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder={"name@faceAuth.com"}
          required
        />
      </div>
      
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Celular
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder={"(99) 99999-999"}
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
        />
      </div>
      
      <div className="mb-5">
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

      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Adicionar imagem do usuário</label>
      <input required className="block mb-2 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" name="file_image" id="file_input" type="file" accept="image/png, image/jpeg"/>

      <div className="inline-flex items-center justify-center w-full">
          <hr className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"/>
          <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/4 bg-white left-1/8 dark:text-white dark:bg-gray-900">ou</span>
      </div>

      <div className="w-full flex flex-col justify-center">
        {!props.collapsable ? <button type="button" className="mb-4 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={()=>props.changeCollapsable()}>Tirar foto</button> :
        null }
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Cadastrar usuário
        </button>
      </div>
      <ToastContainer position="bottom-center" autoClose={2000} />
    </form>
  );
}

export default FormAddUser;