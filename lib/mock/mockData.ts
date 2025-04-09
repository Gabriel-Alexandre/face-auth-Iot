type User = {
  id: string;
  email: string;
  password: string;
};

type UserSession = {
  user: {
    id: string;
    email: string;
    role: string;
    created_at?: string;
  };
  session: {
    access_token: string;
    expires_at: string;
  };
};

type UserData = {
  nome: string;
  avatar_url: string;
};

export const mockUsers: User[] = [
  {
    id: "1",
    email: "teste@exemplo.com",
    password: "senha123"
  },
  {
    id: "2",
    email: "admin@exemplo.com",
    password: "admin123"
  }
];

export const mockUserSessions: Record<string, UserSession> = {
  "1": {
    user: {
      id: "1",
      email: "teste@exemplo.com",
      role: "user",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias atrás
    },
    session: {
      access_token: "mock-access-token-1",
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
    }
  },
  "2": {
    user: {
      id: "2",
      email: "admin@exemplo.com",
      role: "admin",
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString() // 60 dias atrás
    },
    session: {
      access_token: "mock-access-token-2",
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
    }
  }
};

// Mock for user metadata, profiles, or any other user-related data
export const mockUserData: Record<string, UserData> = {
  "1": {
    nome: "Usuário Teste",
    avatar_url: "https://i.pravatar.cc/150?img=1"
  },
  "2": {
    nome: "Administrador",
    avatar_url: "https://i.pravatar.cc/150?img=2"
  }
}; 