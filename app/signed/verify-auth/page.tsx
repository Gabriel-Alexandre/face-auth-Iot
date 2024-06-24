import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import VerifyUser from "./components/verifyUser";

export default async function VerifyAuthPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="w-full flex justify-center">
      <VerifyUser/>
    </div>
  );
}
