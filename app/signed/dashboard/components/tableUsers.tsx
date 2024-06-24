"use client";

import { useState } from "react";
import DropdownTable from "./dropdownTable";

export default function TableUsers(user: any) {
  const [loading, setLoading] = useState<boolean | undefined>(false);

  const dataMock = [{
    name: "Neil Sims",
    email: "neil.sims@flowbite.com",
    status: 1
  },
  {
    name: "Bonnie Green",
    email: "bonnie@flowbite.com",
    status: 1
  },
  {
    name: "Thomas Lean",
    email: "thomes@flowbite.com",
    status: 0
  },
  {
    name: "Leslie Livingston",
    email: "leslie@flowbite.com",
    status: 0
  },
  {
    name: "Teste 1",
    email: "teste@flowbite.com",
    status: 1
  },
  {
    name: "Teste 2",
    email: "teste2@flowbite.com",
    status: 1
  },
  {
    name: "Teste 3",
    email: "teste3@flowbite.com",
    status: 0
  },
]

  const renderRow = (name:string, email:string, status:number, index: number) => {
    return (
      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        <th
          scope="row"
          className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
        >
          <img
            className="w-10 h-10 rounded-full"
            src="http://127.0.0.1:54321/storage/v1/object/public/images/user%20(2).png?t=2024-04-17T21%3A02%3A17.543Z"
            alt="Jese image"
          />
          <div className="ps-3">
            <div className="text-base font-semibold">{name}</div>
            <div className="font-normal text-gray-500">
              {email}
            </div>
          </div>
        </th>
        <td className="px-6 py-4">
          <div className="flex items-center">
            {status ? <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div> 
            : <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>}{" "}
              {status ? "Autenticado" : "Não Autenticado"}
          </div>
        </td>
        <td className="px-6 py-4">
          <a
            href="#"
            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >
            <DropdownTable />
          </a>
        </td>
      </tr>
    );
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Cliente
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>

        <tbody>
          {dataMock.map((item , index) => {
            return (
              renderRow(item.name, item.email, item.status, index)
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
