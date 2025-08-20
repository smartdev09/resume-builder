import { Metadata } from "next";
import SettingsPage from "./SettingPage";
import { redirect } from "next/navigation";
import getSession from "utils/getSession";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Page() {
const supabase = createServerComponentClient({ cookies });

const { data: { user }, error } = await supabase.auth.getUser();
console.log(`(settings/page.tsx)>${user}`)
if (error || !user) {
  redirect('/sign-in'); // Use your actual login page URL
}

// Now `user` is your authenticated user object

//@ts-ignore
  return <SettingsPage user={user} />;
}