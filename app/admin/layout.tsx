import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If unauthenticated (e.g. on /admin/login), render children without admin shell
  // Route protection for all other /admin/* pages is handled in middleware.ts
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-[#0F0F11] text-neutral-900 dark:text-neutral-50 flex flex-col w-full max-w-full overflow-x-hidden transition-colors">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-[#141417] border-b border-neutral-100 dark:border-neutral-800 px-4 py-3 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center">
            <span className="text-white dark:text-neutral-950 font-serif text-xs font-bold">E</span>
          </div>
          <span className="font-serif text-sm font-bold text-neutral-900 dark:text-white">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <AdminLogoutButton />
        </div>
      </header>

      {/* Page Content */}
      <div className="flex-1 pb-20 w-full min-w-0">
        {children}
      </div>

      {/* Bottom Tab Navigation */}
      <AdminNav />
    </div>
  );
}
