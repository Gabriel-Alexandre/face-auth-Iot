import { createClient } from "@/utils/supabase/server";
import InputFile from "./InputFile";
import Test from "./Test";

const UploadImage = () => {
    async function validateAndUploadProcess(data:FormData) {
      'use server'

        const file: File | null = data.get('file') as unknown as File;

        // const bytes = await file.arrayBuffer();
        // const buffer = Buffer.from(bytes);

        const supabase = createClient();

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Salvar imagem no banco
        const { error, data:result } = await supabase
        .storage
        .from('images')
        .upload('public/'+file.name, file, {
            cacheControl: '3600',
            upsert: false,
        });

      if (error) {
        // throw uploadError
        console.log(error)
      }
    }

    

    return (
    //   <form action={validateAndUploadProcess}>
        <form action={validateAndUploadProcess}>
          <InputFile accept="png" name="file"></InputFile>
        

          {/* <img id="face" src="http://127.0.0.1:54321/storage/v1/object/public/images/public/my_picture.png" /> */}
          <Test></Test>

          {/* <div className='flex justify-center items-center border-r-8 pt-6 bg-gray-800'>
              <button className={'ml-4'} type={"submit"}>
              <span className={'flex space-x-2 items-center'}>
                  <span>Realizar importação</span>
              </span>
              </button>
          </div> */}

        </form>
    );
}
 
export default UploadImage;