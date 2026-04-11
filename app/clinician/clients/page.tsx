"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Check, BookOpen } from "lucide-react";

interface Invitation {
  id: string;
  email: string;
  status: string;
  clientId: string | null;
  createdAt: string;
}

interface Enrollment {
  id: string;
  curriculumId: string;
  curriculumTitle: string | null;
  enrolledAt: string;
}

interface Client {
  id: string;
  name: string | null;
  email: string;
  enrollments: Enrollment[];
}

interface Curriculum {
  id: string;
  title: string;
}

export default function ClientsPage() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingClientId, setEnrollingClientId] = useState<string | null>(null);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState("");

  async function load() {
    const [clientsRes, curriculaRes] = await Promise.all([
      fetch("/api/clinician/clients"),
      fetch("/api/clinician/curricula"),
    ]);
    if (clientsRes.ok) {
      const data = await clientsRes.json();
      setInvitations(data.invitations);
      setClients(data.clients);
    }
    if (curriculaRes.ok) {
      setCurricula(await curriculaRes.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleConfirm(invitationId: string) {
    await fetch(`/api/clinician/clients/${invitationId}/confirm`, {
      method: "POST",
    });
    load();
  }

  async function handleEnroll(clientId: string) {
    if (!selectedCurriculumId) return;
    await fetch(`/api/clinician/clients/${clientId}/enroll`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curriculumId: selectedCurriculumId }),
    });
    setEnrollingClientId(null);
    setSelectedCurriculumId("");
    load();
  }

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    registered: "bg-blue-100 text-blue-800",
    confirmed: "bg-green-100 text-green-800",
  };

  if (loading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="mt-2 text-muted-foreground">
            Manage invitations and enroll clients in curricula.
          </p>
        </div>
        <Button asChild>
          <Link href="/clinician/clients/invite">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite client
          </Link>
        </Button>
      </div>

      {/* Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No invitations yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead className="w-32" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={statusColor[inv.status]}
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {inv.status === "registered" && (
                        <Button
                          size="sm"
                          onClick={() => handleConfirm(inv.id)}
                        >
                          <Check className="mr-1 h-3 w-3" />
                          Confirm
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Confirmed Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmed Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No confirmed clients yet. Invite and confirm clients above.
            </p>
          ) : (
            <div className="space-y-6">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="rounded-lg border border-border/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {client.name ?? "Unnamed"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {client.email}
                      </p>
                    </div>
                    {enrollingClientId === client.id ? (
                      <div className="flex items-center gap-2">
                        <Select
                          value={selectedCurriculumId}
                          onValueChange={setSelectedCurriculumId}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select curriculum" />
                          </SelectTrigger>
                          <SelectContent>
                            {curricula.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          onClick={() => handleEnroll(client.id)}
                          disabled={!selectedCurriculumId}
                        >
                          Enroll
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEnrollingClientId(null);
                            setSelectedCurriculumId("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEnrollingClientId(client.id)}
                      >
                        <BookOpen className="mr-1 h-3 w-3" />
                        Enroll in curriculum
                      </Button>
                    )}
                  </div>
                  {client.enrollments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {client.enrollments.map((e) => (
                        <Badge key={e.id} variant="secondary">
                          {e.curriculumTitle ?? "Unknown"}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
