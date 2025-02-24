import { AdminLayout } from "@/components/layout/admin-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FaqEntry } from "@shared/schema";
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
import { insertFaqSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash, Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function AdminFAQ() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [editingEntry, setEditingEntry] = useState<FaqEntry | null>(null);

  const { data: faqEntries, isLoading } = useQuery<FaqEntry[]>({
    queryKey: ["/api/faq"],
  });

  const createFaqMutation = useMutation({
    mutationFn: async (data: typeof insertFaqSchema._type) => {
      const res = await apiRequest("POST", "/api/faq", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faq"] });
      toast({ title: "Question FAQ créée avec succès" });
    },
  });

  const updateFaqMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof insertFaqSchema._type }) => {
      const res = await apiRequest("PUT", `/api/faq/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faq"] });
      toast({ title: "Question FAQ modifiée avec succès" });
      setEditingEntry(null);
    },
  });

  const deleteFaqMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/faq/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faq"] });
      toast({ title: "Question FAQ supprimée avec succès" });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertFaqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "général",
    },
  });

  useEffect(() => {
    if (editingEntry) {
      form.reset(editingEntry);
    } else {
      form.reset({
        question: "",
        answer: "",
        category: "général",
      });
    }
  }, [editingEntry, form]);

  const onSubmit = (data: typeof insertFaqSchema._type) => {
    if (editingEntry) {
      updateFaqMutation.mutate({ id: editingEntry.id, data });
    } else {
      createFaqMutation.mutate(data);
    }
  };

  const filteredFaqEntries = faqEntries?.filter(entry =>
    entry.question.toLowerCase().includes(search.toLowerCase()) ||
    entry.answer.toLowerCase().includes(search.toLowerCase())
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
        <h1 className="text-2xl font-bold">Gestion de la FAQ</h1>

        <Dialog open={editingEntry !== null} onOpenChange={(open) => !open && setEditingEntry(null)}>
          <DialogTrigger asChild>
            <Button>Nouvelle Question</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEntry ? "Modifier la question" : "Ajouter une nouvelle question"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Réponse</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  disabled={createFaqMutation.isPending || updateFaqMutation.isPending}
                >
                  {editingEntry ? "Modifier" : "Créer"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Rechercher dans la FAQ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="bg-white rounded-lg border dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Réponse</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFaqEntries?.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.question}</TableCell>
                <TableCell>{entry.answer}</TableCell>
                <TableCell>{entry.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingEntry(entry)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
                          deleteFaqMutation.mutate(entry.id);
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