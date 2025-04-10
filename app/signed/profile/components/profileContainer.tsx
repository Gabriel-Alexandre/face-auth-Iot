'use client'

import { useRef, useState } from "react";
import FormProfile from "./formProfile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const ProfileContainer = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Função simulada para upload de imagem
  const uploadImage = async (imageData: string) => {
    // Simulação de envio para API
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Imagem enviada:", imageData.substring(0, 50) + "...");
        resolve([1, "Imagem atualizada com sucesso", null, imageData]);
      }, 1500);
    });
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      
      // Validação do tipo de arquivo
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, selecione uma imagem válida.");
        return;
      }
      
      // Pré-visualização da imagem
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Converte a imagem para string e envia
      const fileString = await fileToString(file);
      const response: any = await uploadImage(fileString);
      
      if (response[0] === 0) {
        toast.error(response[1] || "Erro ao atualizar imagem.");
      } else {
        toast.success(response[1] || "Imagem atualizada com sucesso!");
        if (formRef.current) {
          formRef.current.reset();
        }
      }
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      toast.error("Erro ao processar imagem.");
    } finally {
      setLoading(false);
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

  // A imagem usada é a pré-visualização, ou a imagem passada por props
  const displayImage = previewImage || props.img_url;

  return (
    <div className="py-8">
      <div className="flex flex-col items-center">
        <form ref={formRef} className="mb-6">
          <div 
            className="relative group cursor-pointer"
            onClick={handleImageClick}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 dark:border-blue-900 shadow-lg">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
                </div>
              ) : (
                <Image 
                  src={displayImage}
                  alt="Foto de perfil"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                />
              )}
            </div>
            
            {/* Overlay de câmera ao passar o mouse */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
            
            <input
              onChange={handleFileChange}
              ref={fileInputRef}
              id="file-input"
              type="file"
              name="file"
              className="hidden"
              accept="image/*"
            />
          </div>
        </form>

        <h5 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
          {props.name}
        </h5>
        
        <div className="w-full max-w-md">
          <FormProfile user={props.user} />
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={2000} />
    </div>
  );
}

export default ProfileContainer;