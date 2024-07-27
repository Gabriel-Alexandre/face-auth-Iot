import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FormProfile from "./components/formProfile";
import ProfileContainer from "./components/profileContainer";
import { getUserById } from "@/lib/users/queries";

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let aux:any = (await getUserById(user?.id))

  if(aux[2] === undefined) {
    aux = ['', '', {image_url: "http://127.0.0.1:54321/storage/v1/object/public/images/profile.png?t=2024-07-27T14%3A11%3A40.854Z", name: 'User'}]
  } 

  const img_url_rep = aux[2].image_url;
  const img_url = img_url_rep ? img_url_rep : "http://127.0.0.1:54321/storage/v1/object/public/images/profile.png?t=2024-07-27T14%3A11%3A40.854Z";
  const name = aux[2].name;

  if (!user) {
    return redirect("/auth/login");
  }

  return (
    <div className="w-full flex justify-center">


      <div className="w-3/6 pt-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <ProfileContainer user={user} name={name} img_url={img_url}/>
      </div>

    </div>
  );
}