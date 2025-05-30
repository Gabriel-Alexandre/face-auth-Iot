import { mockUsers, mockUserSessions, mockUserData } from "@/lib/mock/mockData";
import { mockTables, mockStorage, generateMockId, addFileToMockStorage, getMockPublicUrl } from "@/lib/mock/mockDatabase";

// Server-side mock storage
// Usando objeto global para persistir dados entre chamadas (em ambiente de desenvolvimento)
const globalForStorage = globalThis as unknown as { serverMockStorage: Record<string, any> };
globalForStorage.serverMockStorage = globalForStorage.serverMockStorage || {};
let serverMockStorage = globalForStorage.serverMockStorage;

// Para debug
console.log("Estado do mockStorage:", Object.keys(serverMockStorage));

// Cookies mock implementation
const cookiesMock = {
  get: (name: string) => {
    return serverMockStorage[name];
  },
  set: (options: { name: string; value: string; [key: string]: any }) => {
    serverMockStorage[options.name] = options.value;
    console.log(`Cookie definido: ${options.name}=${options.value}`);
  },
  remove: (name: string) => {
    delete serverMockStorage[name];
    console.log(`Cookie removido: ${name}`);
  }
};

// Função de ajuda para iniciar uma sessão automaticamente para testes
export const initMockSession = (userId: string = "1") => {
  const sessionData = mockUserSessions[userId];
  if (sessionData) {
    cookiesMock.set({ 
      name: 'supabase-auth-token', 
      value: JSON.stringify([sessionData.session.access_token, userId])
    });
    return true;
  }
  return false;
};

// Iniciar uma sessão automaticamente (para testes)
initMockSession();

export const createMockServerClient = () => {
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

        // Mock storing session in cookie
        const sessionData = mockUserSessions[user.id];
        cookiesMock.set({ 
          name: 'supabase-auth-token', 
          value: JSON.stringify([sessionData.session.access_token, user.id])
        });

        return {
          error: null,
          data: {
            user: sessionData.user,
            session: sessionData.session
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
        
        // Criar novo usuário no mock
        const newUserId = (mockUsers.length + 1).toString();
        const newUser = {
          id: newUserId,
          email,
          password
        };
        
        // Adicionar às estruturas de mock
        mockUsers.push(newUser);
        
        // Criar nova sessão para o usuário
        mockUserSessions[newUserId] = {
          user: {
            id: newUserId,
            email,
            role: "user",
            created_at: new Date().toISOString()
          },
          session: {
            access_token: `mock-access-token-${newUserId}`,
            expires_at: new Date(Date.now() + 3600 * 1000).toISOString()
          }
        };
        
        // Já autenticar o usuário após o registro
        cookiesMock.set({ 
          name: 'supabase-auth-token', 
          value: JSON.stringify([mockUserSessions[newUserId].session.access_token, newUserId])
        });
        
        return {
          error: null,
          data: {
            user: mockUserSessions[newUserId].user,
            session: mockUserSessions[newUserId].session
          }
        };
      },
      
      signOut: async () => {
        cookiesMock.remove('supabase-auth-token');
        
        return {
          error: null
        };
      },
      
      getUser: async () => {
        const storedToken = cookiesMock.get('supabase-auth-token');
        console.log("Token armazenado:", storedToken);
        
        if (!storedToken) {
          // Auto-login com o usuário de teste para desenvolvimento
          const testUserId = "1";
          const sessionData = mockUserSessions[testUserId];
          
          cookiesMock.set({ 
            name: 'supabase-auth-token', 
            value: JSON.stringify([sessionData.session.access_token, testUserId])
          });
          
          return {
            error: null,
            data: {
              user: mockUserSessions[testUserId].user
            }
          };
        }
        
        try {
          const [_, userId] = JSON.parse(storedToken);
          
          if (!userId || !mockUserSessions[userId]) {
            return {
              error: { message: "Invalid session" },
              data: { user: null }
            };
          }
          
          return {
            error: null,
            data: {
              user: mockUserSessions[userId].user
            }
          };
        } catch (err) {
          return {
            error: { message: "Invalid session format" },
            data: { user: null }
          };
        }
      },
      
      getSession: async () => {
        const storedToken = cookiesMock.get('supabase-auth-token');
        
        if (!storedToken) {
          return {
            error: { message: "No active session" },
            data: { session: null }
          };
        }
        
        try {
          const [token, userId] = JSON.parse(storedToken);
          
          if (!token || !userId || !mockUserSessions[userId]) {
            return {
              error: { message: "Invalid session" },
              data: { session: null }
            };
          }
          
          return {
            error: null,
            data: {
              session: mockUserSessions[userId].session
            }
          };
        } catch (err) {
          return {
            error: { message: "Invalid session format" },
            data: { session: null }
          };
        }
      },
      
      updateUser: async (userData: any) => {
        const storedToken = cookiesMock.get('supabase-auth-token');
        
        if (!storedToken) {
          return {
            error: { message: "Not authenticated" },
            data: { user: null }
          };
        }
        
        try {
          const [_, userId] = JSON.parse(storedToken);
          
          if (!userId || !mockUserSessions[userId]) {
            return {
              error: { message: "Invalid session" },
              data: { user: null }
            };
          }
          
          // Don't actually update anything, just pretend we did
          return {
            error: null,
            data: {
              user: { ...mockUserSessions[userId].user, ...userData }
            }
          };
        } catch (err) {
          return {
            error: { message: "Invalid session format" },
            data: { user: null }
          };
        }
      },
      
      // Adicionar método exchangeCodeForSession para compatibilidade com o callback route
      exchangeCodeForSession: async (code: string) => {
        // Simular troca de código por sessão do usuário de teste
        const userId = "1"; // Usar ID do primeiro usuário mockado
        const sessionData = mockUserSessions[userId];
        
        // Armazenar na sessão mock
        cookiesMock.set({ 
          name: 'supabase-auth-token', 
          value: JSON.stringify([sessionData.session.access_token, userId])
        });
        
        return {
          error: null,
          data: {
            session: sessionData.session,
            user: sessionData.user
          }
        };
      }
    },
    
    // Mock other Supabase functionality as needed
    from: (table: string) => {
      return {
        select: (columns?: string) => {
          return {
            // Para seleção com WHERE
            eq: (field: string, value: any) => {
              // Verificação segura para tipos de tabela
              const tableExists = Object.prototype.hasOwnProperty.call(mockTables, table);
              if (tableExists) {
                // Usar type assertion para informar ao TypeScript que a tabela existe
                const targetTable = mockTables[table as keyof typeof mockTables];
                const results = targetTable.filter(row => row[field as keyof typeof row] === value);
                
                return {
                  single: () => ({
                    data: results.length > 0 ? results[0] : null,
                    error: null
                  }),
                  data: results,
                  error: null
                };
              }
              
              return {
                data: null,
                error: { message: `Table ${table} not found in mock database` }
              };
            },
            
            // Para SELECT sem WHERE
            data: Object.prototype.hasOwnProperty.call(mockTables, table) 
              ? mockTables[table as keyof typeof mockTables] 
              : [],
            error: null
          };
        },
        
        insert: (rows: any[]) => {
          // Verificação segura para tipos de tabela
          const tableExists = Object.prototype.hasOwnProperty.call(mockTables, table);
          
          if (!tableExists) {
            return {
              data: null,
              error: { message: `Table ${table} not found in mock database` }
            };
          }
          
          // Usar type assertion para informar ao TypeScript que a tabela existe
          const targetTable = mockTables[table as keyof typeof mockTables];
          
          // Considerando que todas as tabelas são arrays, podemos adicionar novos itens
          // Não podemos modificar diretamente o objeto mockTables[table] devido a restrições de tipo
          const newRows = rows.map(row => ({
            id: generateMockId(),
            ...row
          }));
          
          // Usamos console.log para simular a inserção
          console.log(`Mock: Simulando inserção em ${table}`, newRows);
          
          return {
            data: newRows,
            error: null,
            select: (columns?: string) => {
              return {
                single: () => ({
                  data: newRows.length > 0 ? newRows[0] : null,
                  error: null
                }),
                data: newRows,
                error: null
              };
            }
          };
        },
        
        update: (updates: any) => {
          return {
            eq: (field: string, value: any) => {
              // Verificação segura para tipos de tabela
              const tableExists = Object.prototype.hasOwnProperty.call(mockTables, table);
              if (tableExists) {
                // Usar type assertion para informar ao TypeScript que a tabela existe
                const targetTable = mockTables[table as keyof typeof mockTables];
                
                // Simular atualização (não podemos modificar devido às restrições de tipo)
                console.log(`Mock: Simulando atualização em ${table} onde ${field}=${value}`, updates);
                
                // Criar uma cópia simulada dos registros atualizados
                const updatedRows = targetTable
                  .filter(row => row[field as keyof typeof row] === value)
                  .map(row => ({ ...row, ...updates }));
                
                return {
                  data: updatedRows,
                  error: null
                };
              }
              
              return {
                data: null,
                error: { message: `Table ${table} not found in mock database` }
              };
            }
          };
        },
        
        delete: () => {
          return {
            eq: (field: string, value: any) => {
              // Verificação segura para tipos de tabela
              const tableExists = Object.prototype.hasOwnProperty.call(mockTables, table);
              if (tableExists) {
                // Usar type assertion para informar ao TypeScript que a tabela existe
                const targetTable = mockTables[table as keyof typeof mockTables];
                
                // Simular contagem antes da exclusão
                const beforeLength = targetTable.length;
                
                // Simular exclusão (não podemos modificar devido às restrições de tipo)
                console.log(`Mock: Simulando exclusão em ${table} onde ${field}=${value}`);
                
                // Calcular quantos registros seriam excluídos
                const deletedCount = targetTable.filter(row => row[field as keyof typeof row] === value).length;
                
                return {
                  data: { count: deletedCount },
                  error: null
                };
              }
              
              return {
                data: null,
                error: { message: `Table ${table} not found in mock database` }
              };
            }
          };
        }
      };
    },
    
    // Mock para storage do Supabase
    storage: {
      from: (bucket: string) => {
        return {
          upload: (path: string, file: Blob, options?: any) => {
            // Converte Blob para string base64 simulada
            const mockContent = `mock-file-content-${path}`;
            
            // Adiciona ao storage mock
            const result = addFileToMockStorage(bucket, path, mockContent);
            
            return {
              data: result,
              error: null
            };
          },
          
          getPublicUrl: (path: string) => {
            return {
              data: getMockPublicUrl(bucket, path),
              error: null
            };
          }
        };
      }
    },

    // Mock do método channel do Supabase
    channel: (channelName: string) => {
      return {
        on: (event: string, config: any, callback?: Function) => {
          console.log(`Mock Server: Registrando listener no canal ${channelName} para o evento ${event}`);
          // Retorna o mesmo objeto para permitir encadeamento
          return {
            subscribe: () => {
              console.log(`Mock Server: Subscrito no canal ${channelName}`);
              
              // Simulação opcional de um evento - descomente para testar
              // setTimeout(() => {
              //   if (callback) {
              //     callback({
              //       new: { name: 'mock-image.jpg' }
              //     });
              //   }
              // }, 3000);
              
              return {};
            }
          };
        }
      };
    },
    
    // Mock para removeChannel
    removeChannel: (channel: any) => {
      console.log('Mock Server: Removendo canal', channel);
      return { error: null };
    }
  };
}; 