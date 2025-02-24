import { Navbar } from "./navbar";
import { Link } from "wouter";
import { FileText, Users, HelpCircle, Link2 } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="flex">
        <aside className="w-64 min-h-screen bg-white border-r dark:bg-gray-800 dark:border-gray-700">
          <nav className="p-4 space-y-2">
            <Link href="/admin/pages">
              <a className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <FileText className="h-4 w-4" />
                Gestion des Pages
              </a>
            </Link>
            <Link href="/admin/contacts">
              <a className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <Users className="h-4 w-4" />
                Gestion des Contacts
              </a>
            </Link>
            <Link href="/admin/faq">
              <a className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <HelpCircle className="h-4 w-4" />
                Gestion de la FAQ
              </a>
            </Link>
            <Link href="/admin/links">
              <a className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <Link2 className="h-4 w-4" />
                Liens Utiles
              </a>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}