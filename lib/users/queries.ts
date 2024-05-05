'use server'

import { createClient } from "@/utils/supabase/server";

export const getUserById = async (user_id: any) => {
    const supabase = createClient();

    let { data, error } = await supabase
    .from('user')
    .select("*")  
    .eq('user_supabase_id', user_id)
    .single();

    if (error) {
        return [0, "Erro ao registrar usuário.", data]
    }

    return [1, "Usuário criado com sucesso!", data]
}