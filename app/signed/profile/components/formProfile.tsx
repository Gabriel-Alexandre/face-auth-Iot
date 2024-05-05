'use client'

import { useState } from "react";

export default async function FormProfile(user: any) {
  const [loading, setLoading] = useState<boolean | undefined>(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const passWord = formData.get('password');
    const repeatPassword = formData.get('repeat-password');
    console.log(name, passWord, repeatPassword);

    // if (response[0] === 0) {
    //   toast.error(response[1]);
    // } else {
    //   toast.success(response[1]);
    //   const newPathName = pathName
    //     .replace("login", "dashboard")
    //     .replace("auth", "signed");
    //   const url = new URL(newPathName, window.location.origin);
    //   const path = url.pathname + url.search;
    //   router.push(path);
    //   router.refresh();
    // }

    setLoading(false);
  };

  return (
    <form className="max-w-sm mx-auto" onSubmit={submit}>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder={user.user.email}
          disabled={true}
        />
      </div>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Nome
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
          placeholder={""}
        />
      </div>
      <h5 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
        {"Mudar senha"}
      </h5>
      <div className="mb-5">
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
      <div className="mb-5">
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
      <div className="w-full flex justify-center">
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
