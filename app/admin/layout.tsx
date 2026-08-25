export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Admin header / mobile shell to be enhanced in Phase 5 */}
      <div className="flex-1 pb-20">
        {children}
      </div>
    </div>
  );
}
