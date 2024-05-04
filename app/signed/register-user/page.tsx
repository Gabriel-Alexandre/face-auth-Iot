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
      <h4 className="text-2xl font-bold dark:text-white mb-4 ml-4 text-start">Cadastrar Usuários</h4>

      {/* <div className="w-3/6 self-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

        <div className="flex flex-col items-center pb-6">
          <div className="flex md:mt-6">
            <FormAddUser user={user}/>
          </div>
        </div>
      </div> */}
      <ContainerForm user={user}/>

    </div>
  );
}
