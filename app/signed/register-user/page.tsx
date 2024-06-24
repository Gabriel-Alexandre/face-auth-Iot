import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FormAddUser from "./components/formAddUser";
import ContainerForm from "./components/containerForm";

export default async function RegisterUserPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="w-full flex flex-col justify-center">
      <h4 className="text-2xl font-bold dark:text-white mb-4 ml-4 text-start">Cadastrar Clientes</h4>

      <ContainerForm user={user}/>
    </div>
  );
}
