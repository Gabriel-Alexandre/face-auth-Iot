"use client";

import { changePassword } from "@/lib/auth/auth";
import { updateUserNameTable } from "@/lib/users/actions";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default async function FormProfile(user: any) {
  const router = useRouter();
  const pathName = usePathname();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (buttonRef.current) {
      buttonRef.current.disabled = true; // Desabilita o botão ao enviar o formulário
      buttonRef.current.textContent = "Carregando..."; // Altera o texto do botão para indicar carregamento
    }
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const passWord: any = formData.get("password");
    const repeatPassword = formData.get("repeat-password");

    if ((passWord || repeatPassword) && name) {
      if (passWord !== repeatPassword) {
        toast.error("As senhas digitadas não são iguais.");
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
          buttonRef.current.textContent = "Enviar"; // Restaura o texto original do botão
        }
        return;
      }

      const response = await updateUserNameTable(name, user.user.user.id);
      const response2 = await changePassword(passWord, user.user.user.email);

      if (response[0] === 0 || response2[0] === 0) {
        toast.error("Erro ao atualizar campos.");
      } else {
        toast.success("Campos atualizados com sucesso.");
      }
    } else if (passWord || repeatPassword) {
      if (passWord !== repeatPassword) {
        toast.error("As senhas digitadas não são iguais.");
        if (buttonRef.current) {
          buttonRef.current.disabled = false;
          buttonRef.current.textContent = "Enviar"; // Restaura o texto original do botão
        }
        return;
      }

      const response: any = await changePassword(
        passWord,
        user.user.user.email
      );

      if (response[0] === 0) {
        toast.error(response[1]);
      } else {
        toast.success(response[1]);
      }
    } else if (name) {
      const response: any = await updateUserNameTable(name, user.user.user.id);

      if (response[0] === 0) {
        toast.error(response[1]);
      } else {
        toast.success(response[1]);
      }
    } else {
      toast.error("Preencha os campos para atualizar suas informações.");
    }

    if (buttonRef.current) {
      buttonRef.current.disabled = false;
      buttonRef.current.textContent = "Enviar"; // Restaura o texto original do botão
    }

    const url = new URL(pathName, window.location.origin);
    const path = url.pathname + url.search;
    router.push(path);
    router.refresh();
  };

  return (
    <div>
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
            placeholder={user.user.user.email}
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
            ref={buttonRef}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
