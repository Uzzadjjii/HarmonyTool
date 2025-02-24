import { TeleconLayout } from "@/components/layout/teleconseiller-layout";
import { useQuery } from "@tanstack/react-query";
import { FaqEntry } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TeleconFAQ() {
  const [search, setSearch] = useState("");
  const { data: faqEntries } = useQuery<FaqEntry[]>({
    queryKey: ["/api/faq"],
  });

  const categories = Array.from(
    new Set(faqEntries?.map((entry) => entry.category))
  );

  const filteredEntries = faqEntries?.filter(
    (entry) =>
      entry.question.toLowerCase().includes(search.toLowerCase()) ||
      entry.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <TeleconLayout>
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-bold">FAQ</h1>
        
        <Input
          placeholder="Rechercher dans la FAQ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card className="p-6">
        <Tabs defaultValue={categories[0]}>
          <TabsList>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <Accordion type="single" collapsible className="w-full">
                {filteredEntries
                  ?.filter((entry) => entry.category === category)
                  .map((entry) => (
                    <AccordionItem key={entry.id} value={entry.id.toString()}>
                      <AccordionTrigger>{entry.question}</AccordionTrigger>
                      <AccordionContent>{entry.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </TeleconLayout>
  );
}
