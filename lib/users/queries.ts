'use server'

import { createClient } from "@/utils/supabase/server";

export const getUserById = async (user_id: any) => {
    const supabase = createClient();

    let { data, error } = await supabase
    .from('user')
    .select("*")  
    .eq('user_supabase_id', user_id);

    if(data) {
        if (error) {
            return [0, "Erro ao retornar usuário.", data[0]]
        }
    
        return [1, "Dados retornados com sucesso", data[0]]

    }
}