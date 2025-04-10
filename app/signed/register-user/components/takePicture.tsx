"use client";

import { useCallback, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Webcam from "react-webcam";

const WebcamCapture = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    setLoading(true);
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        props.setImgURL(imageSrc);
        toast.success("Foto capturada com sucesso.");
      } else {
        toast.error("Não foi possível capturar a imagem.");
      }
    } catch (error) {
      console.error("Erro ao capturar imagem:", error);
      toast.error("Erro ao capturar imagem.");
    } finally {
      setLoading(false);
    }
  }, [webcamRef, props]);

  const retakePhoto = () => {
    setCapturedImage(null);
    props.setImgURL(undefined);
  };

  const addPhoto = () => {
    props.setImgCaptured(true);
    toast.success("Imagem adicionada com sucesso!");
  };

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user"
  };

  return (
    <div className="flex flex-col items-center">
      {loading ? (
        <div className="flex justify-center w-[400px] h-[400px] items-center">
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
      ) : capturedImage ? (
        <div className="relative">
          <img
            className="w-[400px] h-[400px] object-cover rounded-lg bg-white"
            src={capturedImage}
            alt="Imagem capturada"
          />
        </div>
      ) : (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={400}
          height={400}
          videoConstraints={videoConstraints}
          className="rounded-lg"
        />
      )}

      {props.imgCaptured && (
        <div className="w-full flex justify-center items-center text-white mt-4">
          <span className="text-white pr-2">
            Imagem adicionada com sucesso
          </span>
          <div className="mt-1 cursor-pointer" onClick={() => {props.setImgCaptured(false)}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center gap-4 mt-4">
        {!capturedImage ? (
          <button
            onClick={capture}
            disabled={loading}
            type="button"
            className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
          >
            Tirar foto
          </button>
        ) : (
          <>
            <button
              onClick={retakePhoto}
              type="button"
              className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Nova foto
            </button>
            <button
              onClick={addPhoto}
              type="button"
              className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-100 dark:text-black dark:border-gray-400 dark:hover:bg-gray-600 dark:hover:border-gray-400 dark:focus:ring-gray-500"
            >
              Usar esta foto
            </button>
          </>
        )}
      </div>
      <ToastContainer position="bottom-center" autoClose={2000} />
    </div>
  );
};

export default WebcamCapture;
