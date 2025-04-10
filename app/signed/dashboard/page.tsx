import { createMockServerClient } from "@/utils/mock/mockServer";
import { redirect } from "next/navigation";
import TableUsers from "./components/tableUsers";
import BarChart from "./components/barChart";
import ActivityLog from "./components/activityLog";

export default async function DashboardPage() {
  const supabase = createMockServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Dados do usuário no dashboard:", user);

  if (!user) {
    console.log("Usuário não autenticado, redirecionando para login");
    return redirect("/auth/login");
  }

  return (
    <div className="w-full flex flex-col justify-center p-4">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold dark:text-white">Dashboard</h4>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <TableUsers />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 p-4">
          <BarChart/>
        </div>
      </div>
      
      <div className="w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <ActivityLog />
      </div>
    </div>
  );
}
