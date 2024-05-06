"use client";

import { useState } from "react";
import FormAddUser from "./formAddUser";
import TakePicture from "./takePicture";

export default function ContainerForm({...props}) {
  const [imgURL, setImgURL] = useState<string>();
  const [collapsable, setCollapsable] = useState<boolean | undefined>(false);
  const [imgOfTakePicture, setImgOfTakePicture] = useState<boolean>(false);

  const changeCollapsable = () => {
    setCollapsable(!collapsable);
  };

  return (
    <>
      {!collapsable ? (
        <div className="w-3/6 self-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col items-center pb-6">
            <div className="flex md:mt-6">
              <FormAddUser user={props.user} changeCollapsable={changeCollapsable}/>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="w-1/2 ">
            <div className="flex flex-col items-center pb-6">
              <div className="flex md:mt-6">
                <FormAddUser 
                user={props.user} 
                imgOfTakePicture={imgOfTakePicture}
                setImgOfTakePicture={setImgOfTakePicture}
                setImgURL={setImgURL}
                imgURL={imgURL}
                changeCollapsable={changeCollapsable} collapsable={collapsable}/>
              </div>
            </div>
          </div>
          <div className="w-1/2 border-l  dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center pb-6">
              <div className="flex md:mt-6">
              <div className="absolute right-8 top-20 cursor-pointer" onClick={()=>changeCollapsable()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" ><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
                <TakePicture user={props.user} 
                imgOfTakePicture={imgOfTakePicture}
                setImgOfTakePicture={setImgOfTakePicture}
                setImgURL={setImgURL}
                imgURL={imgURL}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
