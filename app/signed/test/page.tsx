import DeployButton from "@/components/DeployButton";
import AuthButton from "@/components/AuthButton";
import { createMockServerClient } from "@/utils/mock/mockServer";
import FetchDataSteps from "@/components/tutorial/FetchDataSteps";
import Header from "@/components/Header";
import { redirect } from "next/navigation";
import UploadImage from "@/components/tutorial/UploadImage";
import Test from "@/components/tutorial/Test";
import TestMQTT from "@/components/tutorial/TestMQTT";

export default async function TestPage() {
  const supabase = createMockServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <main className="flex-1 flex flex-col gap-6 items-center justify-center">
          <h2 className="font-bold text-4xl mb-4">Next steps</h2>
          <TestMQTT/>
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a
            href="http://192.168.0.8/"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            Camera server
          </a>
        </p>
      </footer>
    </div>
  );
}
