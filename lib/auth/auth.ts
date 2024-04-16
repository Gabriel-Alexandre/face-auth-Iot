'use server'

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export const signIn = async (formData: FormData) => {

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

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
    const supabase = createClient();

    if(password !== password2) {
        return [2, 'As senhas digitadas não são iguais.']
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
        return [0, "Erro ao registrar usuário."]
    }

    return [1, "Usuário criado com sucesso!"]
  };