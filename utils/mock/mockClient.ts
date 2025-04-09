import { mockUsers, mockUserSessions, mockUserData } from "@/lib/mock/mockData";

// Simulated client-side storage to maintain state between requests
let currentUser: { id: string } | null = null;
let currentSession: any = null;

export const createMockClient = () => {
  return {
    auth: {
      // Authentication methods
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
          return {
            error: { message: "Invalid login credentials" },
            data: { user: null, session: null }
          };
        }

        // Set current session
        currentUser = { id: user.id };
        currentSession = mockUserSessions[user.id].session;

        return {
          error: null,
          data: {
            user: mockUserSessions[user.id].user,
            session: mockUserSessions[user.id].session
          }
        };
      },
      
      signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
        const existingUser = mockUsers.find(u => u.email === email);
        
        if (existingUser) {
          return {
            error: { message: "User already exists" },
            data: { user: null, session: null }
          };
        }
        
        // In a real implementation, we might add the user to our mock database
        // For now, just pretend we created a user
        return {
          error: null,
          data: {
            user: { email },
            session: null
          }
        };
      },
      
      signOut: async () => {
        currentUser = null;
        currentSession = null;
        
        return {
          error: null
        };
      },
      
      getUser: async () => {
        if (!currentUser) {
          return {
            error: { message: "Not authenticated" },
            data: { user: null }
          };
        }
        
        return {
          error: null,
          data: {
            user: mockUserSessions[currentUser.id]?.user || null
          }
        };
      },
      
      getSession: async () => {
        if (!currentUser || !currentSession) {
          return {
            error: { message: "No active session" },
            data: { session: null }
          };
        }
        
        return {
          error: null,
          data: {
            session: currentSession
          }
        };
      },
      
      updateUser: async (userData: any) => {
        if (!currentUser) {
          return {
            error: { message: "Not authenticated" },
            data: { user: null }
          };
        }
        
        // Pretend we updated something
        return {
          error: null,
          data: {
            user: { ...mockUserSessions[currentUser.id].user, ...userData }
          }
        };
      },
      
      // Adicionar método exchangeCodeForSession para compatibilidade com o callback route
      exchangeCodeForSession: async (code: string) => {
        // Simular troca de código por sessão do usuário de teste
        const userId = "1"; // Usar ID do primeiro usuário mockado
        
        // Definir usuário atual
        currentUser = { id: userId };
        currentSession = mockUserSessions[userId].session;
        
        return {
          error: null,
          data: {
            session: currentSession,
            user: mockUserSessions[userId].user
          }
        };
      }
    },
    
    // Mock other Supabase functionality as needed
    from: (table: string) => {
      return {
        select: () => {
          return {
            eq: (field: string, value: any) => {
              // Very basic mock implementation for example
              if (table === 'profiles' && field === 'id' && currentUser) {
                return {
                  single: () => ({
                    data: mockUserData[value],
                    error: null
                  })
                };
              }
              
              return {
                data: null,
                error: { message: "Not implemented in mock" }
              };
            }
          };
        },
        insert: () => {
          return {
            data: { id: "mock-id" },
            error: null
          };
        },
        update: () => {
          return {
            eq: () => ({
              data: { success: true },
              error: null
            })
          };
        },
        delete: () => {
          return {
            eq: () => ({
              data: { success: true },
              error: null
            })
          };
        }
      };
    }
  };
}; 