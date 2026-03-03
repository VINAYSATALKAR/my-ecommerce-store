export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This simply renders the page content without adding a second sidebar
    <div className="w-full">
      {children}
    </div>
  );
}