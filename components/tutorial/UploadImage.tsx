// Importação do mock do cliente
import InputFile from "./InputFile";
import Test from "./Test";

const UploadImage = () => {
    async function validateAndUploadProcess(data:FormData) {
      'use server'

        const file: File | null = data.get('file') as unknown as File;

        // Simulação de upload usando mock em vez do Supabase
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log(`Mock: Simulando upload de arquivo ${file.name}`);
        
        // Simulação de resposta bem sucedida
        const result = {
            path: `public/${file.name}`,
            fullPath: `/mock-storage/images/public/${file.name}`
        };
        
        return result;
    }

    return (
        <form action={validateAndUploadProcess}>
          <InputFile accept="png" name="file"></InputFile>
          <Test></Test>
        </form>
    );
}
 
export default UploadImage;