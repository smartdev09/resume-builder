import { LogOut } from "lucide-react";
import { Button } from "@resume/ui/button";

export function LogoutButton() {
  return (
    <Button variant="ghost" className="flex items-center gap-2">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
