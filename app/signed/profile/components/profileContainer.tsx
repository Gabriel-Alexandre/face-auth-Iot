'use client'

import { useRef, useState } from "react";
import FormProfile from "./formProfile";
import { uploadImageUser } from "@/lib/users/actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileContainer = (user: any) => {
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const formRef: any = useRef(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const submit = async (event: any) => {
    const formData = new FormData();
    const fileInput: any = document.getElementById("dropzone-file");
    formData.append("file", fileInput.files[0]);
    const file: any = formData.get("file");

    fileToString(file)
      .then( async (fileString: any) => {
        const response: any = await uploadImageUser(fileString, user.user.id);

        if (imageRef.current) {
          imageRef.current.src = response[3];
        }

        formRef.current.reset();
        
        if (response[0] === 0) {
          toast.error(response[1]);
        } else {
          toast.success(response[1]);
        }

        window.location.reload();
      })
      .catch(() => toast.error("Erro ao processar imagem."));
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
    <div>
      <div className="flex flex-col items-center pb-10">
        <form ref={formRef}>
          <label htmlFor="dropzone-file" className="cursor-pointer ">
            <div className="relative group ">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {!loading ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                  >
                    <g transform="translate(2 3)">
                      <path d="M20 16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3l2-3h6l2 3h3a2 2 0 0 1 2 2v11z" />
                      <circle cx="10" cy="10" r="4" />
                    </g>
                  </svg>
                ) : (
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
                )}
              </div>
              <img
                ref={imageRef}
                className="w-24 h-24 mb-3 rounded-full shadow-lg bg-white hover:bg-gray-600 group-hover:bg-gray-600"
                src={user.img_url}
                alt="user_img"
              />
              <input
                onChange={(event) => submit(event)}
                id="dropzone-file"
                type="file"
                name="file"
                className="hidden"
              />
            </div>
          </label>
        </form>

        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {user.name}
        </h5>
        <div className="flex mt-4 md:mt-6">
          <FormProfile user={user} />
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={2000} />
    </div>
  );
}

export default ProfileContainer;