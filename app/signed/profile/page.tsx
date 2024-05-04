import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FormProfile from "./components/formProfile";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  function formatElapsedTime(dateTime: Date): string {
    const currentDate = new Date();
    const difference = currentDate.getTime() - dateTime.getTime();
    const msPerMonth = 1000 * 60 * 60 * 24 * 30.4375; // média de dias em um mês
    const msPerYear = msPerMonth * 12;
    
    const monthsElapsed = Math.floor(difference / msPerMonth);
    const yearsElapsed = Math.floor(monthsElapsed / 12);
    
    let elapsedTimeStr = "";

    if (yearsElapsed === 0) {
        if (monthsElapsed === 1) {
            elapsedTimeStr = "criado há 1 mês";
        } else {
            elapsedTimeStr = `criado há ${monthsElapsed} meses`;
        }
    } else if (yearsElapsed === 1) {
        if (monthsElapsed % 12 === 0) {
            elapsedTimeStr = "criado há 1 ano";
        } else {
            elapsedTimeStr = `criado há 1 ano e ${monthsElapsed % 12} meses`;
        }
    } else {
        if (monthsElapsed % 12 === 0) {
            elapsedTimeStr = `criado há ${yearsElapsed} anos`;
        } else {
            elapsedTimeStr = `criado há ${yearsElapsed} anos e ${monthsElapsed % 12} meses`;
        }
    }

    return elapsedTimeStr;
  }

  return (
    <div className="w-full flex justify-center">


      <div className="w-3/6 pt-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

        <div className="flex flex-col items-center pb-10">
          <img className="w-24 h-24 mb-3 rounded-full shadow-lg bg-white" 
          src="http://127.0.0.1:54321/storage/v1/object/public/images/user%20(2).png?t=2024-04-17T21%3A02%3A17.543Z" 
          alt="user_img" />
          {/* <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{user?.email}</h5> */}
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{"User"}</h5>
          <div className="flex mt-4 md:mt-6">
            <FormProfile user={user}/>
          </div>
        </div>
      </div>

    </div>
  );
}