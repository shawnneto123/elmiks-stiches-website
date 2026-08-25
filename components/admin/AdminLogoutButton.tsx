"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors py-1.5 px-3 rounded-lg hover:bg-neutral-100"
    >
      Sign Out
    </button>
  );
}
