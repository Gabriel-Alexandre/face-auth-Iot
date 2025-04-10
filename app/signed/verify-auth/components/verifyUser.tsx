"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import dynamic from "next/dynamic";

// Componente Canvas renderizado apenas no cliente
const ClientOnlyCanvas = dynamic(
  () => Promise.resolve((props: React.CanvasHTMLAttributes<HTMLCanvasElement>) => 
    <canvas {...props} />
  ), 
  { ssr: false }
);

// Componente Webcam renderizado apenas no cliente
const ClientOnlyWebcam = dynamic<React.ComponentProps<typeof Webcam>>(
  () => import('react-webcam').then((mod) => mod.default),
  { ssr: false }
);

const VerifyUser = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [users, setUsers] = useState<any>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Carregar dados
    const init = async () => {
      // Simulação de usuários - substitua por sua implementação real
      setUsers([
        {
          id: 1,
          name: "Usuário Exemplo",
          image_url: "/avatar-placeholder.jpg", // Substitua por uma imagem de exemplo ou use uma URL real
        }
      ]);
    };

    const loadFaceApi = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.ageGenderNet.loadFromUri("/models"),
      ]);
    };

    loadFaceApi();
    init();
    
    // Limpeza ao desmontar
    return () => {
      setIsMounted(false);
    };
  }, []);

  const capture = useCallback(async () => {
    if (!isMounted) return;
    
    setLoading(true);
    setIsAuthenticated(null);
    setStartTime(Date.now());
    
    try {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        toast.error("Não foi possível capturar a imagem.");
        setLoading(false);
        return;
      }

      setCapturedImage(imageSrc);
      
      // Simular um breve atraso para o processamento
      setTimeout(async () => {
        let authResult = false;
        
        // Verificação simplificada - em produção, use a verificação real com face-api
        for (let user of users) {
          if (user.image_url) {
            try {
              const result = await verifyFace(imageSrc, user.image_url, user.name);
              if (result === 1) {
                authResult = true;
                break;
              }
            } catch (error) {
              console.error("Erro na verificação facial:", error);
            }
          }
        }
        
        setIsAuthenticated(authResult);
        setLoading(false);
        
        // Registrar tempo de processamento
        const endTime = Date.now();
        const elapsedTime = endTime - (startTime !== null ? startTime : 0);
        console.log(`Tempo total de processamento: ${elapsedTime} ms`);
      }, 1500);
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      toast.error("Erro ao processar a imagem.");
      setLoading(false);
    }
  }, [webcamRef, users, startTime, isMounted]);

  async function verifyFace(imgUrlToCheck: string, imgUrlRef: string, name: string) {
    try {
      // Neste exemplo, estamos apenas retornando um resultado aleatório para demonstração
      // Em um ambiente real, você usaria a verificação real com face-api
      
      // Simulação de resultado para demonstração (50% de chance de autenticar)
      return Math.random() > 0.5 ? 1 : 0;
      
      /* 
      // Implementação real com face-api
      const refImage = await faceapi.fetchImage(imgUrlRef);
      const imageToCheck = await faceapi.fetchImage(imgUrlToCheck);

      if (!canvasRef.current) return 0;
      const canvas = canvasRef.current;

      const refAiData = await faceapi
        .detectSingleFace(refImage)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!refAiData) return 0;

      const faceMatcher = new faceapi.FaceMatcher(refAiData);

      const facesAiData = await faceapi
        .detectAllFaces(imageToCheck)
        .withFaceLandmarks()
        .withFaceDescriptors();

      faceapi.matchDimensions(canvas, imageToCheck);
      
      const resizedResults = faceapi.resizeResults(facesAiData, imageToCheck);
      
      for (const face of resizedResults) {
        const { detection, descriptor } = face;
        const match = faceMatcher.findBestMatch(descriptor);
        
        if (!match.toString().includes("Não reconhecido")) {
          const drawBox = new faceapi.draw.DrawBox(detection.box, { label: name });
          drawBox.draw(canvas);
          return 1;
        }
      }
      
      return 0;
      */
    } catch (error) {
      console.error("Erro na verificação facial:", error);
      return 0;
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsAuthenticated(null);
  };

  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: "user"
  };

  // Se não está montado, não renderize nada ou mostre um placeholder
  if (!isMounted) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
        <div className="flex flex-col items-center">
          <div className="mb-6 w-[400px] h-[400px] flex justify-center items-center">
            <div className="text-gray-400">Carregando...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
      <div className="flex flex-col items-center">
        <div className="mb-6 relative">
          {isMounted && (
            <ClientOnlyCanvas 
              id="canvas" 
              ref={canvasRef}
              className="absolute z-10 w-full h-full left-0 top-0"
            />
          )}
          
          {loading ? (
            <div className="flex justify-center items-center w-[400px] h-[400px]">
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
                src={capturedImage}
                alt="Imagem capturada"
                className="w-[400px] h-[400px] object-cover rounded-lg"
              />
            </div>
          ) : isMounted ? (
            <ClientOnlyWebcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={400}
              height={400}
              videoConstraints={videoConstraints}
              className="rounded-lg"
            />
          ) : (
            <div className="w-[400px] h-[400px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Carregando webcam...</p>
            </div>
          )}
        </div>

        {isAuthenticated !== null && !loading && (
          <div className={`text-center p-4 mb-4 w-full rounded-lg ${isAuthenticated ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
            {isAuthenticated ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span>Usuário Autenticado</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
                </svg>
                <span>Usuário Não Autenticado</span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-4 mt-2">
          {!capturedImage ? (
            <button
              onClick={capture}
              disabled={loading}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="inline w-4 h-4 mr-2 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                  </svg>
                  Verificando...
                </>
              ) : "Verificar face"}
            </button>
          ) : (
            <button
              onClick={retakePhoto}
              disabled={loading}
              type="button"
              className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            >
              Nova foto
            </button>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={2000} />
    </div>
  );
};

export default VerifyUser;
