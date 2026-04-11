import Link from "next/link";
import { Stethoscope, Users as UsersIcon, BookOpen, UserCircle } from "lucide-react";

export default function ClinicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link
            href="/clinician"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <Stethoscope className="h-4 w-4 text-accent" />
            Clinician Portal
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="/clinician/characters"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <UserCircle className="h-3.5 w-3.5" />
              Characters
            </Link>
            <Link
              href="/clinician/curricula"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Curricula
            </Link>
            <Link
              href="/clinician/clients"
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <UsersIcon className="h-3.5 w-3.5" />
              Clients
            </Link>
          </nav>
          <div className="ml-auto">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to site
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
