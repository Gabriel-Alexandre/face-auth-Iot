'use client'

import { FormEventHandler, useCallback, useEffect, useState } from "react";
import InputFile from "./InputFile";
import * as faceapi from 'face-api.js';
import { useFormStatus } from "react-dom";

const Test = () => {
    const { data, pending } = useFormStatus();
    const [imgUrl, setImgUrl] = useState<string | null>(null);

    useEffect(() => {
        async function executeFaceApi(imgUrl:string) {

            const refImage = await faceapi.fetchImage('http://127.0.0.1:54321/storage/v1/object/public/images/public/my_picture.png');
            const imageToCheck = await faceapi.fetchImage(imgUrl);

            const canvas: HTMLElement | null | HTMLCanvasElement = document.getElementById('canvas');

            const refAiData = await faceapi
            .detectAllFaces(refImage)
            .withFaceLandmarks()
            .withFaceDescriptors();

            //build a FaceMatcher with the detection data from
            //our reference pic results. Can make label in another video
            //they are automatic
            let faceMatcher = new faceapi.FaceMatcher(refAiData)

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
                let options = { label: "Neymar" }
                const drawBox = new faceapi.draw.DrawBox(detection.box, options)
                if(canvas instanceof HTMLCanvasElement)
                    drawBox.draw(canvas)
            })

        }
        
        if(data) {
            const nameImg: FormDataEntryValue | null | undefined | File  = data?.get('file');
            if(nameImg instanceof File) {
                // console.log('http://127.0.0.1:54321/storage/v1/object/public/images/public/'+nameImg.name)
                setImgUrl('http://127.0.0.1:54321/storage/v1/object/public/images/public/'+nameImg.name);
                executeFaceApi('http://127.0.0.1:54321/storage/v1/object/public/images/public/'+nameImg.name);
            }

        }
    }, [data]);

    useEffect(() => {
        async function executeFaceApi() {
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.ageGenderNet.loadFromUri('/models'),
            ]);
        }

        executeFaceApi()
    }, []);


    return (
        <>
            <canvas id="canvas" className="absolute"></canvas>
            {imgUrl ? <img id="face" src={imgUrl} /> : null}
            <div className='flex justify-center items-center border-r-8 pt-6 bg-gray-800'>
              <button className={'ml-4'} type={"submit"} disabled={pending}>
              <span className={'flex space-x-2 items-center'}>
                  <span>Realizar importação</span>
              </span>
              </button>
            </div>
        </>
    );
}
 
export default Test;