'use server'

import { createClient } from "@/utils/supabase/server";

export const createUserTable = async (data_user: any) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('user')
        .insert([
            {
                name: 'User',
                email: data_user.email,
                image_url: 'http://127.0.0.1:54321/storage/v1/object/public/images/user%20(2).png?t=2024-04-17T21%3A02%3A17.543Z',
                user_supabase_id: data_user.user_supabase_id
            },
        ]);

    if (error) {
        return [0, "Erro ao registrar usuário.", data]
    }

    return [1, "Usuário criado com sucesso!", data]
}

export const updateUserNameTable = async (data_user: any , user_id:any) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('user')
        .update(
            {
                name: data_user,
            },
        ).eq('user_supabase_id', user_id);

    if (error) {
        return [0, "Erro ao alterar nome.", data]
    }

    return [1, "Nome alterado com sucesso!", data]
}

export const uploadImageUser = async (fileString: any, user_id: string) => {
    const dataUrl: string = fileString;
    const file: Blob = stringToBlob(dataUrl);
    const supabase = createClient();
    const now = new Date();
    const hournow = now.toISOString();
    const { error, data } = await supabase.storage
    .from('users')
    .upload('public/'+user_id+hournow+'.jpg', file, {
        cacheControl: '3600',
        upsert: true,
    });

    if(data) {
        const { data: data1 } = await supabase
        .storage
        .from('users')
        .getPublicUrl(data.path);

        console.log(data1)

        const { data: data2, error: error2 } = await supabase
        .from('user')
        .update(
            {
                image_url: data1?.publicUrl,
            },
        ).eq('user_supabase_id', user_id);

        if(error2) {
            return [0, 'Erro ao fazer upload da imagem.', data, data1?.publicUrl]
        } else {
            return [1, 'Imagem atualizada com sucesso.', data, data1?.publicUrl]
        }
    }

    if(error) {
        return [0, 'Erro ao fazer upload da imagem.', data, '']
    } else {
        return [1, 'Imagem atualizada com sucesso.', data, '']
    }
}

function stringToBlob(dataUrl: string): Blob {
    // Extrai o conteúdo base64 da string
    const base64Content = dataUrl.split(',')[1];
    // Converte o conteúdo base64 para um ArrayBuffer
    const arrayBuffer = Uint8Array.from(atob(base64Content), c => c.charCodeAt(0)).buffer;
    // Cria um Blob a partir do ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    return blob;
  }
