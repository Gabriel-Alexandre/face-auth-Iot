// import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { createMockServerClient } from "@/utils/mock/mockServer";

export const updateSession = async (request: NextRequest) => {
  console.log("Middleware executando, URL:", request.url);

  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Usando o cliente mock em vez do Supabase
  const supabase = createMockServerClient();
  
  // Simulando verificação de usuário que normalmente aconteceria com Supabase
  const result = await supabase.auth.getUser();
  console.log("Middleware getUser result:", result.data.user?.email || "No user");

  return response;
};
