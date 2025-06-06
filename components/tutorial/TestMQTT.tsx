'use client'

import { publishMQTT } from "@/lib/MQTT/MQTT_Tool";
import { TAKE_PICTURE } from "@/utils/consts";
import { useEffect, useState } from "react";
import * as faceapi from 'face-api.js';

const TestMQTT = () => {
  const [erroMessage, setErroMessage] = useState<string>();
  const [imgURL, setImgURL] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // const connect = async () => {
    //   try{
    //     await connectMQTT();
    //   } catch {
    //     setErroMessage('Erro ao se conectar ao MQTT.')
    //   }
    // }

    const loadFaceApi = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        // faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        // faceapi.nets.ageGenderNet.loadFromUri('/models'),
      ]);
    }

    loadFaceApi();
    // connect();
    
    // Simulação de recebimento de imagem (mock do Supabase Realtime)
    const mockImageListener = () => {
      // Esta função simula o evento de upload de imagem
      const mockPublicUrl = '/mock-images/example.jpg'; // URL fictícia para teste
      
      // Mock do evento que era anteriormente acionado pelo Realtime do Supabase
      const simulateImageUpload = () => {
        setImgURL(mockPublicUrl);
        setLoading(false);
        executeFaceApi(mockPublicUrl);
      };
      
      // Retorna a função de limpeza
      return () => {
        // Limpeza de recursos (se necessário)
        console.log('Removendo listener de imagens mock');
      };
    };
    
    // Iniciar o listener de mock
    const cleanupMock = mockImageListener();
    
    // Limpeza ao desmontar
    return () => {
      if (cleanupMock) cleanupMock();
    };
  }, []);

  async function handleTakePicture() {
    try {
      setLoading(true);
      await publishMQTT(TAKE_PICTURE);
      
      // Simular recebimento de imagem após um delay (mock da resposta do Supabase)
      setTimeout(() => {
        const mockPublicUrl = '/mock-images/example.jpg';
        setImgURL(mockPublicUrl);
        setLoading(false);
        executeFaceApi(mockPublicUrl);
      }, 2000);
    } catch {
      setErroMessage("Erro ao tirar foto.");
      setLoading(false);
    }
  }

  async function executeFaceApi(imgUrl:string) {
    try {
      // Mock da URL de referência
      const refImage = await faceapi.fetchImage('/mock-images/reference.jpg');
      const imageToCheck = await faceapi.fetchImage(imgUrl);

      const canvas: HTMLElement | null | HTMLCanvasElement = document.getElementById('canvas');

      const refAiData = await faceapi
      .detectAllFaces(refImage)
      .withFaceLandmarks()
      .withFaceDescriptors();

      //build a FaceMatcher with the detection data from
      //our reference pic results. Can make label in another video
      //they are automatic
      let faceMatcher = new faceapi.FaceMatcher(refAiData);

      //get the faces/ai data from the image we are checking
      let facesAiData = await faceapi.detectAllFaces(imageToCheck)
          .withFaceLandmarks()
          .withFaceDescriptors()


      //use faceapi to resize canvas
      if(canvas instanceof HTMLCanvasElement)
      faceapi.matchDimensions(canvas, imageToCheck)
      // resize just in case
      facesAiData = faceapi.resizeResults(facesAiData, imageToCheck)

      //loop through all the faces and find the best match from our 
      //faceMatcher which is the reference image
      facesAiData.forEach(face => {
          const { detection, descriptor } = face
          //make our label from the best match
          let label = faceMatcher.findBestMatch(descriptor).toString()
          if(label.includes("unknown")){
              //if it includes "unkown, stop"
              return
          }
          //otherwise, use our reference info
          let options = { label: "Gabriel" }
          const drawBox = new faceapi.draw.DrawBox(detection.box, options)
          if(canvas instanceof HTMLCanvasElement)
            drawBox.draw(canvas)
      })
    } catch (error) {
      console.error("Erro ao executar Face API:", error);
      setErroMessage("Erro ao processar imagem.");
    }
  }


  return (
    <div className="pt-6 flex-col justify-center">

      <div className="pt-6 flex justify-center">
        <button className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'} 
        onClick={handleTakePicture} disabled={loading}>
          <span className={'text-center'}>
            {loading ? 'Carregando...' : 'Tirar foto'} 
          </span>
        </button>

      </div>

      <div className="pt-6 flex justify-center">
        <canvas id="canvas" className="absolute"></canvas>
        {imgURL ? <img id="face" src={imgURL} /> : null}

        {erroMessage ? 
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">ERRO: </strong>
            <span className="block sm:inline">{erroMessage}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div> : null
        }
      </div>

    </div>
  );
}
 
export default TestMQTT;