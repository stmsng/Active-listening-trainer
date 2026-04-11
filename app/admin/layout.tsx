import Link from "next/link";
import { Shield } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-2 text-sm font-semibold">
            <Shield className="h-4 w-4 text-accent" />
            Admin Portal
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/admin/designations" className="transition-colors hover:text-foreground">
              Designations
            </Link>
          </nav>
          <div className="ml-auto">
            <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Back to site
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
