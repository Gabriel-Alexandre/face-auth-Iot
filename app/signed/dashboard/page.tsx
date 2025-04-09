import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TableUsers from "./components/tableUsers";
import PizzaChart from "./components/pizzaChart";
import BarChart from "./components/barChart";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Dados do usuário no dashboard:", user);

  if (!user) {
    console.log("Usuário não autenticado, redirecionando para login");
    return redirect("/auth/login");
  }

  return (
    <div className="w-full flex flex-col justify-center">
      <h4 className="text-2xl font-bold dark:text-white mb-4 ml-4 text-start">Dashboard</h4>

      <div className="flex">
        <div className="w-1/2">
          <TableUsers user={user}/>
        </div>

        <div className="w-1/2 pl-4 flex flex-col justify-between">
          <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <BarChart/>
          </div>

          <div className="mt-4 flex bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            
            <div>
              <h3 className="pb-8 pt-2 text-center text-lg font-semibold text-gray-900 whitespace-nowrap dark:text-white">Resumo: Logs do Sistema</h3>
              
              <div className="px-6 flex">
                <div className="flex flex-col items-center">
                  <span className="text-gray-900 whitespace-nowrap dark:text-white">Quantidade Total: {"1050"}</span><br/>
                  <span className="text-gray-900 whitespace-nowrap dark:text-white">Quantidade{`${'(Sucesso): '}`}{"700"}</span><br/>
                  <span className="text-gray-900 whitespace-nowrap dark:text-white">Quantidade{`${'(Erro): '}`}{"350"}</span>
                </div>
              </div>

            </div>

            <div className="flex justify-center bg-white border-l border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-col px-12 py-2">
                <PizzaChart/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
