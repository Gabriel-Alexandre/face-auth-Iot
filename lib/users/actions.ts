'use server'

import { createMockServerClient } from "@/utils/mock/mockServer";

export const createUserTable = async (data_user: any) => {
    // Simulando criação de usuário com dados mockados
    console.log(`Mock: Criando usuário com email ${data_user.email}`);
    
    // Simular resposta de sucesso
    const mockData = {
        id: Math.floor(Math.random() * 1000),
        name: 'User',
        email: data_user.email,
        image_url: 'https://yucrypjjssdhpuifavas.supabase.co/storage/v1/object/public/images/profile.png?t=2024-07-27T18%3A10%3A08.612Z',
        user_supabase_id: data_user.user_supabase_id,
        created_at: new Date().toISOString()
    };

    return [1, "Usuário criado com sucesso!", mockData];
}

export const createClientTable = async (name: string, email: string, phone: string, date: string, user_id: string, fileString:string) => {
    // Usando mock para simular operações de storage e banco de dados
    const dataUrl: string = fileString;
    const file: Blob = stringToBlob(dataUrl);
    const now = new Date();
    const hournow = now.toISOString();
    
    // Simulação de upload de arquivo
    console.log(`Mock: Simulando upload de arquivo ${user_id}${hournow}.jpg`);
    
    // Simular resposta de upload bem-sucedido
    const mockImagePath = `public/${user_id}${hournow}.jpg`;
    const mockPublicUrl = `/mock-storage/images/${mockImagePath}`;
    
    // Simular inserção no banco de dados
    console.log(`Mock: Simulando inserção de usuário no banco de dados`);
    console.log(`Mock: Nome: ${name}, Email: ${email}, Imagem: ${mockPublicUrl}`);
    
    // Simular ID de usuário gerado
    const mockUserId = Math.floor(Math.random() * 1000);
    
    // Simular inserção em group_users
    console.log(`Mock: Simulando inserção na tabela group_users para usuário ${mockUserId}`);
    
    return [1, "Cliente criado com sucesso!", ''];
}

export const createClientTableV2 = async (name: string, email: string, phone: string, date: string, user_id: string, fileString:string) => {
    // Simulando criação de cliente com dados mockados
    console.log(`Mock: Criando cliente com email ${email}`);
    
    // Verificar se o email já existe (simulação)
    if (email === 'existente@exemplo.com') {
        return [0, `${email} já existe.`, null];
    }
    
    // Simular ID gerado para o novo usuário
    const mockUserId = Math.floor(Math.random() * 1000);
    
    // Simular inserção em group_users
    console.log(`Mock: Simulando inserção na tabela group_users para usuário ${mockUserId}`);

    return [1, "Cliente criado com sucesso!", ''];
}

export const updateUserNameTable = async (data_user: any, user_id: any) => {
    // Simulando atualização de nome do usuário
    console.log(`Mock: Atualizando nome do usuário ${user_id} para ${data_user}`);
    
    // Simular resposta de sucesso
    const mockData = {
        id: Math.floor(Math.random() * 1000),
        name: data_user,
        updated_at: new Date().toISOString()
    };

    return [1, "Nome alterado com sucesso!", mockData];
}

export const uploadImageUser = async (fileString: any, user_id: string) => {
    const dataUrl: string = fileString;
    const file: Blob = stringToBlob(dataUrl);
    // Usando mock em vez do Supabase
    const now = new Date();
    const hournow = now.toISOString();

    // Simulação de upload de arquivo
    console.log(`Mock: Simulando upload de arquivo ${user_id}_${hournow}.jpg`);
    
    // Simular resposta de upload bem-sucedido
    const mockImagePath = `public/${user_id}_${hournow}.jpg`;
    const mockPublicUrl = `/mock-storage/users/${mockImagePath}`;
    
    // Simular atualização no banco de dados
    console.log(`Mock: Simulando atualização de imagem para usuário ${user_id}`);
    console.log(`Mock: Nova URL de imagem: ${mockPublicUrl}`);
    
    return [1, 'Imagem atualizada com sucesso.', {path: mockImagePath}, mockPublicUrl];
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
