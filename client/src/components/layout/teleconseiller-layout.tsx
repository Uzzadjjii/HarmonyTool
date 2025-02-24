import { Navbar } from "./navbar";
import { Link } from "wouter";
import { Phone, Users, HelpCircle, Link2, Gamepad2 } from "lucide-react";

interface TeleconLayoutProps {
  children: React.ReactNode;
}

export function TeleconLayout({ children }: TeleconLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="flex">
        <aside className="w-64 min-h-screen bg-white border-r dark:bg-gray-800 dark:border-gray-700">
          <nav className="p-4 space-y-2">
            <Link href="/">
              <a className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <Phone className="h-4 w-4" />
                Tableau de Bord
              </a>
            </Link>
            <Link href="/contacts">
              <a className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <Users className="h-4 w-4" />
                Contacts
              </a>
            </Link>
            <Link href="/faq">
              <a className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </a>
            </Link>
            <Link href="/links">
              <a className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <Link2 className="h-4 w-4" />
                Liens Utiles
              </a>
            </Link>
            <Link href="/learning">
              <a className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <Gamepad2 className="h-4 w-4" />
                Espace Formation
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