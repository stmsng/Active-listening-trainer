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
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Character {
  id: string;
  name: string;
  age: number;
  gender: string;
  nationality: string;
  isTherapist: boolean;
  introversion: number;
  communicationSkill: number;
  openness: number;
  conscientiousness: number;
  reactivity: number;
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/clinician/characters");
    if (res.ok) setCharacters(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this character?")) return;
    await fetch(`/api/clinician/characters/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Characters</h1>
          <p className="mt-2 text-muted-foreground">
            Design AI conversation partners for your curricula.
          </p>
        </div>
        <Button asChild>
          <Link href="/clinician/characters/new">
            <Plus className="mr-2 h-4 w-4" />
            New character
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : characters.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No characters yet. Create your first one to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((c) => (
            <Card key={c.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{c.name}</CardTitle>
                    <CardDescription>
                      {c.age}y/o &middot; {c.nationality} &middot; {c.gender}
                    </CardDescription>
                  </div>
                  {c.isTherapist && <Badge variant="secondary">Therapist</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    Introversion:{" "}
                    <span className="font-medium text-accent">
                      {c.introversion}
                    </span>
                  </div>
                  <div>
                    Communication:{" "}
                    <span className="font-medium text-accent">
                      {c.communicationSkill}
                    </span>
                  </div>
                  <div>
                    Openness:{" "}
                    <span className="font-medium text-accent">{c.openness}</span>
                  </div>
                  <div>
                    Reactivity:{" "}
                    <span className="font-medium text-accent">
                      {c.reactivity}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/clinician/characters/${c.id}/edit`}>
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
