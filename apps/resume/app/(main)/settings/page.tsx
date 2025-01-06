import { Metadata } from "next";
import SettingsPage from "./SettingPage";
import { redirect } from "next/navigation";
import getSession from "utils/getSession";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function Page() {
  const session = await getSession();
  const user  = session?.user;

  if(!user) redirect("api/auth/signin?callbackUrl=/settings")

  return <SettingsPage user={user} />;
}