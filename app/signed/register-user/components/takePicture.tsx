"use client";

import { publishMQTT } from "@/lib/MQTT/MQTT_Tool";
import { TAKE_PICTURE } from "@/utils/consts";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TakePicture = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageResponse, setImageResponse] = useState<boolean>(false); // false


  const supabase = createClient();

  supabase
    .channel("images-upload")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "storage",
        table: "objects",
      },
      async (payload: any) => {
        const folderName = payload.new.name;

        const { data } = await supabase.storage
          .from("images")
          .getPublicUrl(folderName);
        props.setImgURL(data.publicUrl);
        setLoading(false);
        setImageResponse(true);
      }
    )
    .subscribe();

  async function handleTakePicture() {
    try {
      setLoading(true);
      await publishMQTT(TAKE_PICTURE);
      toast.success("Solicitação enviada com sucesso.");
    } catch {
      toast.error("Error no processamento da foto.");
    }
  }

  return (
    <div>
      {!loading ? (
        <img
          className="w-252 h-252 rounded-lg bg-white"
          src={
            props.imgURL
              ? props.imgURL
              : "https://yucrypjjssdhpuifavas.supabase.co/storage/v1/object/public/images/profile.png?t=2024-07-28T18%3A48%3A33.910Z"
          }
        />
      ) : (
        <div className="flex justify-center w-252 h-252">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {props.imgOfTakePicture ? <div className="w-full flex justify-center items-center text-white">
        <span className="text-white pr-2">
          imagem adicionada com sucesso
        </span>
        <div className="mt-1 cursor-pointer" onClick={() => {props.setImgOfTakePicture(false)}}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" ><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
       
      </div> : null} 

      <div className="w-full flex justify-center">
        <button
          onClick={handleTakePicture}
          disabled={loading}
          type="button"
          className="mt-6 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Tirar foto
        </button>

        {imageResponse ? 
          <button
            onClick={() => {props.setImgOfTakePicture(true)}}
            type="button"
            className="mt-6 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 dark:bg-gray-100 dark:text-black dark:border-gray-400 dark:hover:bg-gray-600 dark:hover:border-gray-400 dark:focus:ring-gray-500"
          >
            Adicionar foto
          </button> : null
        }
      </div>
      <ToastContainer position="bottom-center" autoClose={2000} />
    </div>
  );
};

export default TakePicture;
