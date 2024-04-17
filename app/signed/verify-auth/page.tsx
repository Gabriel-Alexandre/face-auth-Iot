import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function VerifyAuthPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div>
        oiiiiiiiiiiiiiiiiii
    </div>
  );
}
