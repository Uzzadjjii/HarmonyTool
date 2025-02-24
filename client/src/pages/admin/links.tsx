import { AdminLayout } from "@/components/layout/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash, Link as LinkIcon, Pencil } from "lucide-react";
import { useState, useEffect } from "react";

const linkSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  url: z.string().url("L'URL doit être valide"),
  description: z.string().optional(),
});

type Link = z.infer<typeof linkSchema> & { id: number };

export default function AdminLinks() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const { data: links, isLoading } = useQuery<Link[]>({
    queryKey: ["/api/links"],
  });

  const createLinkMutation = useMutation({
    mutationFn: async (data: z.infer<typeof linkSchema>) => {
      const res = await apiRequest("POST", "/api/links", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({ title: "Lien ajouté avec succès" });
    },
  });

  const updateLinkMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: z.infer<typeof linkSchema> }) => {
      const res = await apiRequest("PUT", `/api/links/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({ title: "Lien modifié avec succès" });
      setEditingLink(null);
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      toast({ title: "Lien supprimé avec succès" });
    },
  });

  const form = useForm({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editingLink) {
      form.reset(editingLink);
    } else {
      form.reset({
        title: "",
        url: "",
        description: "",
      });
    }
  }, [editingLink, form]);

  const onSubmit = (data: z.infer<typeof linkSchema>) => {
    if (editingLink) {
      updateLinkMutation.mutate({ id: editingLink.id, data });
    } else {
      createLinkMutation.mutate(data);
    }
  };

  const filteredLinks = links?.filter(link =>
    link.title.toLowerCase().includes(search.toLowerCase()) ||
    link.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des Liens Utiles</h1>

        <Dialog open={editingLink !== null} onOpenChange={(open) => !open && setEditingLink(null)}>
          <DialogTrigger asChild>
            <Button>Nouveau Lien</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLink ? "Modifier le lien" : "Ajouter un nouveau lien"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input {...field} type="url" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  disabled={createLinkMutation.isPending || updateLinkMutation.isPending}
                >
                  {editingLink ? "Modifier" : "Créer"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Rechercher un lien..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="bg-white rounded-lg border dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLinks?.map((link) => (
              <TableRow key={link.id}>
                <TableCell>{link.title}</TableCell>
                <TableCell>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
                  >
                    <LinkIcon className="h-4 w-4" />
                    {link.url}
                  </a>
                </TableCell>
                <TableCell>{link.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingLink(link)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Êtes-vous sûr de vouloir supprimer ce lien ?")) {
                          deleteLinkMutation.mutate(link.id);
                        }
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}