import { TeleconLayout } from "@/components/layout/teleconseiller-layout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CallLog } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCallLogSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TeleconDashboard() {
  const { toast } = useToast();
  const { data: callLogs } = useQuery<CallLog[]>({
    queryKey: ["/api/call-logs"],
  });

  const createCallLogMutation = useMutation({
    mutationFn: async (data: typeof insertCallLogSchema._type) => {
      const res = await apiRequest("POST", "/api/call-logs", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/call-logs"] });
      toast({ title: "Appel enregistré avec succès" });
    },
  });

  const form = useForm({
    resolver: zodResolver(insertCallLogSchema.omit({ userId: true })),
    defaultValues: {
      duration: 0,
      outcome: "",
      notes: "",
    },
  });

  const chartData = callLogs?.map(log => ({
    date: format(new Date(log.createdAt), "dd/MM", { locale: fr }),
    duration: log.duration,
  })) ?? [];

  return (
    <TeleconLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tableau de Bord</h1>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>Enregistrer un Appel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel appel</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit((data) => createCallLogMutation.mutate(data))}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="outcome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Résultat</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit"
                  disabled={createCallLogMutation.isPending}
                >
                  Enregistrer
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Appels Aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {callLogs?.filter(log => 
                format(new Date(log.createdAt), "yyyy-MM-dd") === 
                format(new Date(), "yyyy-MM-dd")
              ).length ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Durée Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {callLogs?.length 
                ? Math.round(callLogs.reduce((acc, log) => acc + log.duration, 0) / callLogs.length)
                : 0} min
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Appels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {callLogs?.length ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Durée des Appels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="duration"
                  stroke="rgb(234 88 12)"
                  fill="rgb(251 146 60)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </TeleconLayout>
  );
}
