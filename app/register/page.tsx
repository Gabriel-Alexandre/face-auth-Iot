import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../login/submit-button";

export default function Register({
  searchParams,
}: {
  searchParams: { message: string };
}) {

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const password2 = formData.get("password2") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/register?message=Não foi possível autenticar usuário");
    }

    return redirect("/register?message=Verifique seu email para continuar o processo de login");
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-violet-600 dark:border-violet-700">
        <form className="space-y-6" action="#">
          <span className="text-2xl flex items-center font-extrabold dark:text-white">Entre no FaceAuth</span>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="email"
            >
              E-mail
            </label>
            <input
              className=" border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-300 dark:border-gray-200 dark:placeholder-gray-400 dark:text-gray-800"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              className=" border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-300 dark:border-gray-200 dark:placeholder-gray-400 dark:text-gray-800"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="password2"
            >
              Repetir senha
            </label>
            <input
              className=" border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-300 dark:border-gray-200 dark:placeholder-gray-400 dark:text-gray-800"
              type="password"
              name="password2"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-start">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-200">
                Lembre de mim
              </label>
            </div>
            <a
              href="#"
              className="ms-auto text-sm text-color4 hover:underline dark:text-color4"
            >
              Esqueceu a senha?
            </a>
          </div>

          <SubmitButton
            formAction={signUp}
            className="w-full text-white bg-color4 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            pendingText="Criando conta..."
          >
            Criar conta
          </SubmitButton>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Já tem uma conta?{" "}
            <a
              href="/login"
              className="text-color4 hover:underline dark:text-color4"
            >
              Entre na sua conta
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
