'use server'

import { createMockServerClient } from "@/utils/mock/mockServer";

// Dados mock para simulação
const mockUsers = [
  {
    id: 1,
    user_supabase_id: 'abc123',
    name: 'Usuário Teste 1',
    email: 'teste1@exemplo.com',
    created_at: new Date().toISOString(),
    image_url: '/avatar-placeholder.jpg'
  },
  {
    id: 2,
    user_supabase_id: 'def456',
    name: 'Usuário Teste 2',
    email: 'teste2@exemplo.com',
    created_at: new Date().toISOString(),
    image_url: '/avatar-placeholder.jpg'
  }
];

export const getUserById = async (user_id: any) => {
    // Simulação da busca de usuário por ID
    const user = mockUsers.find(u => u.user_supabase_id === user_id);
    
    if (user) {
        return [1, "Dados retornados com sucesso", user];
    }
    
    return [0, "Erro ao retornar usuário.", null];
}

export const getUsers = async () => {
    // Simulação da busca de todos os usuários
    return [1, "Dados retornados com sucesso", mockUsers];
}