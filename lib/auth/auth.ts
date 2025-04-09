'use server'

// import { createClient } from "@/utils/supabase/server";
import { createMockServerClient } from "@/utils/mock/mockServer";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    // const supabase = createClient();
    const supabase = createMockServerClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return [0, "Não foi possível autenticar usuário."]
    }

    return [1, "Usuário autenticado com sucesso!"]
};  

export const signUp = async (formData: FormData) => {
    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const password2 = formData.get("password2") as string;
    // const supabase = createClient();
    const supabase = createMockServerClient();

    if(password !== password2) {
        return [2, 'As senhas digitadas não são iguais.']
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
        return [0, "Erro ao registrar usuário.", data]
    }

    return [1, "Usuário criado com sucesso!", data]
};

export const signOut = async () => {
    // const supabase = createClient();
    const supabase = createMockServerClient();
    await supabase.auth.signOut();
    return redirect("/");
};

export const changePassword = async (new_password: string, email: string) => {
    // const supabase = createClient();
    const supabase = createMockServerClient();

     const { error, data } =  await supabase.auth.updateUser({ password: new_password, email: email })

     if (error) {
        return [0, "Erro ao mudar senha.", data]
    }

    return [1, "Senha alterada com sucesso!", data]
}