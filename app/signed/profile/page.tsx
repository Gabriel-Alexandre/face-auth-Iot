import { redirect } from "next/navigation";
import ProfileContainer from "./components/profileContainer";

export default function ProfilePage() {
  // Simulação de autenticação - em um ambiente real, isso seria substituído por sua lógica de autenticação
  const isAuthenticated = true;
  const user = { 
    id: "user-id",
    email: "teste@exemplo.com"
  };

  // Dados de perfil de exemplo - substituir por integração com sua API
  const userData = {
    name: "Usuário Teste",
    image_url: "/avatar-placeholder.jpg", // Use uma imagem local em public/
  };

  if (!isAuthenticated) {
    return redirect("/auth/login");
  }

  return (
    <div className="w-full flex flex-col justify-center py-8 px-4">
      <h4 className="text-2xl font-bold dark:text-white mb-6 ml-4 text-start">Perfil do Usuário</h4>
      
      <div className="max-w-2xl mx-auto w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
        <ProfileContainer 
          user={user} 
          name={userData.name} 
          img_url={userData.image_url}
        />
      </div>
    </div>
  );
}