// Mock para tabelas de banco de dados
interface UserTable {
  id: string;
  name: string;
  email: string;
  image_url: string;
  phone?: string;
  date_birth?: string;
  user_supabase_id: string;
}

interface GroupUsers {
  id: string;
  user_id: string;
  group_id: string;
  status: number;
}

// Armazenamos dados de tabelas em memória
export let mockTables: {
  user: UserTable[];
  group_users: GroupUsers[];
} = {
  user: [
    {
      id: "1",
      name: "Usuário Teste",
      email: "teste@exemplo.com",
      image_url: "https://i.pravatar.cc/150?img=1",
      user_supabase_id: "1"
    },
    {
      id: "2",
      name: "Administrador",
      email: "admin@exemplo.com",
      image_url: "https://i.pravatar.cc/150?img=2",
      user_supabase_id: "2"
    }
  ],
  group_users: [
    {
      id: "1",
      user_id: "1",
      group_id: "03b09f3f-00ac-4e72-a176-ecc3fb277e1a",
      status: 1
    },
    {
      id: "2",
      user_id: "2",
      group_id: "03b09f3f-00ac-4e72-a176-ecc3fb277e1a",
      status: 1
    }
  ]
};

// Mock storage de arquivos
export const mockStorage: Record<string, {
  files: Record<string, string>;
}> = {
  images: {
    files: {}
  },
  users: {
    files: {}
  }
};

// Auxílio para gerar IDs únicos
export function generateMockId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Função para adicionar arquivo ao mock storage
export function addFileToMockStorage(
  bucket: string, 
  path: string, 
  content: string
): { path: string } {
  if (!mockStorage[bucket]) {
    mockStorage[bucket] = { files: {} };
  }
  
  mockStorage[bucket].files[path] = content;
  return { path };
}

// Função para obter URL pública de um arquivo
export function getMockPublicUrl(
  bucket: string,
  path: string
): { publicUrl: string } {
  return {
    publicUrl: `https://mock-storage/${bucket}/${path}`
  };
} 