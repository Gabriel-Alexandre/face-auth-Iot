'use client'

import { useState } from "react";

export default function TakePicture(user: any) {
  const [loading, setLoading] = useState<boolean | undefined>(false);

  return (
    <div>
      <img
        className="w-252 h-252 rounded-lg bg-white"
        src={"http://127.0.0.1:54321/storage/v1/object/public/images/user%20(2).png?t=2024-04-17T21%3A02%3A17.543Z"}
      />
      <div className="w-full flex justify-center">
        <button type="button" className="mt-6 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" onClick={()=>console.log('tirar foto')}>Tirar foto</button>
      </div>
    </div>
  );
}
