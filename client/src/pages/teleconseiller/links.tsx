import { TeleconLayout } from "@/components/layout/teleconseiller-layout";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Link as LinkIcon } from "lucide-react";
import { useState } from "react";

export default function TeleconLinks() {
  const [search, setSearch] = useState("");
  const { data: links, isLoading } = useQuery<Link[]>({
    queryKey: ["/api/links"],
  });

  const filteredLinks = links?.filter(link =>
    link.title.toLowerCase().includes(search.toLowerCase()) ||
    link.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <TeleconLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </TeleconLayout>
    );
  }

  return (
    <TeleconLayout>
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-bold">Liens Utiles</h1>
        
        <Input
          placeholder="Rechercher un lien..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLinks?.map((link) => (
          <Card key={link.id}>
            <CardHeader>
              <CardTitle>{link.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {link.description}
              </p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
              >
                <LinkIcon className="h-4 w-4" />
                Accéder au lien
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </TeleconLayout>
  );
}
