// import { createBrowserClient } from "@supabase/ssr";
import { createMockClient } from "@/utils/mock/mockClient";

export const createClient = () => createMockClient();
  // createBrowserClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // );
