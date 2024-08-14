import { createClient } from "@/utils/supabase/server";
import InputFile from "./InputFile";
import Test from "./Test";

const UploadImage = () => {
    async function validateAndUploadProcess(data:FormData) {
      'use server'

        const file: File | null = data.get('file') as unknown as File;

        const supabase = createClient();

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Salvar imagem no banco
        const { error, data:result } = await supabase
        .storage
        .from('images')
        .upload('public/'+file.name, file, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
        });

      if (error) {
        console.log(error)
      }
    }

    

    return (
        <form action={validateAndUploadProcess}>
          <InputFile accept="png" name="file"></InputFile>
          <Test></Test>
        </form>
    );
}
 
export default UploadImage;