import { TeleconLayout } from "@/components/layout/teleconseiller-layout";
import { useQuery } from "@tanstack/react-query";
import { Contact } from "@shared/schema";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone, Mail, MapPin } from "lucide-react";

export default function TeleconContacts() {
  const [search, setSearch] = useState("");
  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const filteredContacts = contacts?.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.email?.toLowerCase().includes(search.toLowerCase()) ||
    contact.phone?.includes(search)
  );

  return (
    <TeleconLayout>
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-bold">Annuaire des Contacts</h1>
        
        <Input
          placeholder="Rechercher un contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Adresse</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts?.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {contact.phone}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {contact.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {contact.email}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {contact.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {contact.address}
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TeleconLayout>
  );
}
