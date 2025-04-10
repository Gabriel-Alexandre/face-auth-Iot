"use client";

import { useState } from "react";
import FormAddUser from "./formAddUser";
import WebcamCapture from "./takePicture";

export default function ContainerForm({...props}) {
  const [imgURL, setImgURL] = useState<string>();
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [imgCaptured, setImgCaptured] = useState<boolean>(false);

  const toggleCamera = () => {
    setShowCamera(!showCamera);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!showCamera ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-6">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md">
              <FormAddUser 
                user={props.user} 
                toggleCamera={toggleCamera}
                imgCaptured={imgCaptured}
                setImgCaptured={setImgCaptured}
                imgURL={imgURL}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-md">
                <FormAddUser 
                  user={props.user} 
                  toggleCamera={toggleCamera}
                  imgCaptured={imgCaptured}
                  setImgCaptured={setImgCaptured}
                  setImgURL={setImgURL}
                  imgURL={imgURL}
                  showCamera={showCamera}
                />
              </div>
            </div>
          </div>
          <div className="border-t md:border-t-0 md:border-l dark:border-gray-700 p-6">
            <div className="flex flex-col items-center">
              <div className="absolute right-8 top-20 cursor-pointer" onClick={toggleCamera}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
              <WebcamCapture
                user={props.user} 
                imgCaptured={imgCaptured}
                setImgCaptured={setImgCaptured}
                setImgURL={setImgURL}
                imgURL={imgURL}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
