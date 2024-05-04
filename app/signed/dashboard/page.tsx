import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import UploadImage from "@/components/tutorial/UploadImage";
import Test from "@/components/tutorial/Test";
import TableUsers from "./components/tableUsers";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="w-full flex flex-col justify-center">
      <h4 className="text-2xl font-bold dark:text-white mb-4 ml-4 text-start">Dashboard</h4>

      <div className="flex">
        <div className="w-1/2">
          <TableUsers user={user}/>
        </div>

        <div className="w-1/2">
          <div>
            bar chart
          </div>

          <div>
            resume
          </div>
        </div>
      </div>
    </div>
  );
}
