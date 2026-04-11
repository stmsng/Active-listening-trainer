"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Curriculum {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function CurriculaPage() {
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/clinician/curricula");
    if (res.ok) setCurricula(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this curriculum and all its items?")) return;
    await fetch(`/api/clinician/curricula/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Curricula</h1>
          <p className="mt-2 text-muted-foreground">
            Build structured learning paths for your clients.
          </p>
        </div>
        <Button asChild>
          <Link href="/clinician/curricula/new">
            <Plus className="mr-2 h-4 w-4" />
            New curriculum
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : curricula.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No curricula yet. Create your first one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {curricula.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
                {c.description && (
                  <CardDescription>{c.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/clinician/curricula/${c.id}`}>
                      <Pencil className="mr-1 h-3 w-3" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash2 className="mr-1 h-3 w-3 text-destructive" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
