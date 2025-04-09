'use server'

import { createClient } from "@/utils/supabase/server";

export const createUserTable = async (data_user: any) => {
    // Aqui estamos usando o cliente mock configurado em utils/supabase/server.ts
    const supabase = createClient();

    const { data, error } = await supabase
        .from('user')
        .insert([
            {
                name: 'User',
                email: data_user.email,
                image_url: 'https://yucrypjjssdhpuifavas.supabase.co/storage/v1/object/public/images/profile.png?t=2024-07-27T18%3A10%3A08.612Z',
                user_supabase_id: data_user.user_supabase_id
            },
        ]);

    if (error) {
        return [0, "Erro ao registrar usuário.", data]
    }

    return [1, "Usuário criado com sucesso!", data]
}

export const createClientTable = async (name: string, email: string, phone: string, date: string, user_id: string, fileString:string) => {
    // Usando cliente mock para operações de storage e banco de dados
    const supabase = createClient();
    const dataUrl: string = fileString;
    const file: Blob = stringToBlob(dataUrl);
    const now = new Date();
    const hournow = now.toISOString();
    

    const { error: errorimg, data: dataimg } = await supabase.storage
    .from('images')
    .upload('public/'+user_id+hournow+'.jpg', file, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
    });

    if(dataimg) {
        const { data: data1 } = await supabase
        .storage
        .from('images')
        .getPublicUrl(dataimg.path);

        const { data, error } = await supabase
            .from('user')
            .insert([
                {
                    name: name,
                    email: email,
                    image_url: data1.publicUrl,
                    phone: phone,
                    date_birth: date,
                    user_supabase_id: user_id
                },
            ]).select('id').single();
            
            if(data) {
            const user_id:{
                id: any;
            } | null = data.id;
            const { data: data1, error: error1 } = await supabase
            .from('group_users')
            .insert([
                {
                    user_id: user_id,
                    group_id: '03b09f3f-00ac-4e72-a176-ecc3fb277e1a',
                    status: 1
                },
            ]);
    
            if (error1) {
                return [0, "Erro ao registrar cliente.", data]
            }
        }

        if (error) {
            return [0, `${email} já existe.`, data]
        }
    }

    return [1, "Cliente criado com sucesso!", '']
}

export const createClientTableV2 = async (name: string, email: string, phone: string, date: string, user_id: string, fileString:string) => {
    // Usando cliente mock
    const supabase = createClient();

    const { data, error } = await supabase
        .from('user')
        .insert([
            {
                name: name,
                email: email,
                image_url: fileString,
                phone: phone,
                date_birth: date,
                user_supabase_id: user_id
            },
        ]).select('id').single();
        
        if(data) {
        const user_id:{
            id: any;
        } | null = data.id;
        const { data: data1, error: error1 } = await supabase
        .from('group_users')
        .insert([
            {
                user_id: user_id,
                group_id: '03b09f3f-00ac-4e72-a176-ecc3fb277e1a',
                status: 1
            },
        ]);

        if (error1) {
            return [0, "Erro ao registrar cliente.", data]
        }
    }

    if (error) {
        return [0, `${email} já existe.`, data]
    }
    

    return [1, "Cliente criado com sucesso!", '']
}

export const updateUserNameTable = async (data_user: any , user_id:any) => {
    // Usando cliente mock
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
    // Usando cliente mock
    const supabase = createClient();
    const now = new Date();
    const hournow = now.toISOString();

    const { error, data } = await supabase.storage
    .from('users')
    .upload('public/'+user_id+"_"+hournow+'.jpg', file, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: true,
    });

    if(data) {
        const { data: data1 } = await supabase
        .storage
        .from('users')
        .getPublicUrl(data.path);

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
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    return blob;
}
