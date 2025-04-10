import { redirect } from "next/navigation";
import VerifyUser from "./components/verifyUser";

export default function VerifyAuthPage() {
  // Simulação de autenticação - em um ambiente real, isso seria substituído por sua lógica de autenticação
  const isAuthenticated = true;
  const user = { id: "user-id" };

  if (!isAuthenticated) {
    return redirect("/auth/login");
  }

  return (
    <div className="w-full flex flex-col justify-center py-8 px-4">
      <h4 className="text-2xl font-bold dark:text-white mb-6 ml-4 text-start">Verificação de Acesso</h4>
      
      <div className="max-w-4xl mx-auto w-full">
        <VerifyUser user={user}/>
      </div>
    </div>
  );
}
