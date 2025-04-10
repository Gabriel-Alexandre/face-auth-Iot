import { createMockServerClient } from "@/utils/mock/mockServer";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthButton() {
  // Aqui estamos usando o cliente mock que foi configurado em utils/mock/mockServer.ts
  const supabase = createMockServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    // Aqui também estamos usando o cliente mock
    const supabase = createMockServerClient();
    await supabase.auth.signOut();
    return redirect("auth/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="auth/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
