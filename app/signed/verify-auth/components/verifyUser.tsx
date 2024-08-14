"use client";

import { publishMQTT } from "@/lib/MQTT/MQTT_Tool";
import { TAKE_PICTURE } from "@/utils/consts";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as faceapi from "face-api.js";
import { getUsers } from "@/lib/users/queries";

const VerifyUser = (props: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imgURL, setImgURL] = useState<string>();
  const [users, setUsers] = useState<any>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [verifyPublisher, setVerifyPublisher] = useState<number>(0); // 0 - OK, 1 - Sucesso, 2- Error
  const [anyErrorMessage, setAnyErrorMessage] = useState<string | null>("Ocorreu um erro inesperado ao enviar solicitação. Tente novamente.");

  useEffect(() => {
    const init = async () => {
      const usersData: any = await getUsers();
      setUsers(usersData[2]);
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
  
  }, []);

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
        setVerifyPublisher(1);
        const folderName = payload.new.name;

        const { data } = await supabase.storage
          .from("images")
          .getPublicUrl(folderName);
        setImgURL(data.publicUrl);
        setLoading(false);
        let response: any = 0;
        // response = await executeFaceApi(data.publicUrl);
        for (let i = 0; i < users.length; i++) {
          response = await executeFaceApi(data.publicUrl, users[i].image_url, users[i].name);
          if(response === 1) break
        }
        if (response === 1) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }
    )
    .subscribe();

  async function handleTakePicture() {
    try {
      setLoading(true);
      setVerifyPublisher(0);
      
      const response = await publishMQTT(TAKE_PICTURE);

      if(response === "ERRO: Cliente reconectando..." || response === "ERRO: Ocorreu um erro no sistema.") {
        setLoading(false);
      }

      // while(true) {
      //   if(verifyPublisher === 1 || !isConnected()) {
      //     setLoading(false);
      //     break;
      //   }
      // }
    } catch {
      toast.error("Error no processamento da foto.");
    }
  }

  async function executeFaceApi(imgUrlToCheck: string, imgUrlRef: string, name: string) {
    setIsAuthenticated(null);
    let has_success = 0;

    const refImage = await faceapi.fetchImage('https://yucrypjjssdhpuifavas.supabase.co/storage/v1/object/public/images/my_picture.jpeg?t=2024-07-28T18%3A47%3A50.602Z');
    const imageToCheck = await faceapi.fetchImage(imgUrlToCheck);

    const canvas: HTMLElement | null | HTMLCanvasElement =
      document.getElementById("canvas");

    const refAiData = await faceapi
      .detectSingleFace(refImage)
      .withFaceLandmarks()
      .withFaceDescriptor();

    let faceMatcher = new faceapi.FaceMatcher(refAiData);

    let facesAiData = await faceapi
      .detectAllFaces(imageToCheck)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (canvas instanceof HTMLCanvasElement)
      faceapi.matchDimensions(canvas, imageToCheck);
    facesAiData = faceapi.resizeResults(facesAiData, imageToCheck);

    facesAiData.forEach((face) => {
      const { detection, descriptor } = face;
      let label = faceMatcher.findBestMatch(descriptor).toString();
      if (label.includes("Não reconhecido")) {
        return;
      }

      let options = { label: name };
      has_success = 1;
      const drawBox = new faceapi.draw.DrawBox(detection.box, options);
      if (canvas instanceof HTMLCanvasElement) drawBox.draw(canvas);
    });

    return has_success;
  }

  return (
    <div className="pt-6 flex-col justify-center">
      <div className="w-full flex justify-center">
        <button
          onClick={handleTakePicture}
          disabled={loading}
          type="button"
          className="mt-6 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Verificar face
        </button>
      </div>

      <div className="pt-6 flex flex-col justify-center">
        {!loading ? <canvas id="canvas" className="absolute"></canvas> : null}
        {!loading ? (
          <img
            id="face"
            className="w-252 h-252 rounded-lg bg-white"
            src={
              imgURL
                ? imgURL
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
        {!loading ? (isAuthenticated === null ? null : isAuthenticated ? <div className="text-green-500 text-center">Usuário Autenticado</div> : <div className="text-red-500 text-center">Usuário Não Autenticado</div>) : null}
        {!loading ? (verifyPublisher === 2 ? anyErrorMessage : null) : null}
      </div>
    </div>
  );
};

export default VerifyUser;
