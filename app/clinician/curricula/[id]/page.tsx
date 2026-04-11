"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, ArrowUp, ArrowDown } from "lucide-react";

interface CurriculumItem {
  id: string;
  characterId: string;
  characterName: string | null;
  scenario: string;
  sortOrder: number;
}

interface Curriculum {
  id: string;
  title: string;
  description: string;
  items: CurriculumItem[];
}

interface Character {
  id: string;
  name: string;
}

export default function CurriculumDetailPage() {
  const params = useParams<{ id: string }>();
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  // New item form
  const [selectedCharacterId, setSelectedCharacterId] = useState("");
  const [scenario, setScenario] = useState("");
  const [addingItem, setAddingItem] = useState(false);

  async function load() {
    const [currRes, charRes] = await Promise.all([
      fetch(`/api/clinician/curricula/${params.id}`),
      fetch("/api/clinician/characters"),
    ]);
    if (currRes.ok) setCurriculum(await currRes.json());
    if (charRes.ok) setCharacters(await charRes.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [params.id]);

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedCharacterId || !scenario) return;
    setAddingItem(true);

    const sortOrder = curriculum?.items.length ?? 0;
    const res = await fetch(`/api/clinician/curricula/${params.id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterId: selectedCharacterId,
        scenario,
        sortOrder,
      }),
    });

    if (res.ok) {
      setSelectedCharacterId("");
      setScenario("");
      load();
    }
    setAddingItem(false);
  }

  async function handleDeleteItem(itemId: string) {
    await fetch(`/api/clinician/curricula/${params.id}/items/${itemId}`, {
      method: "DELETE",
    });
    load();
  }

  async function handleMoveItem(itemId: string, direction: "up" | "down") {
    if (!curriculum) return;
    const items = [...curriculum.items];
    const idx = items.findIndex((i) => i.id === itemId);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    // Swap sort orders locally, then delete and re-add both items
    // For simplicity, delete the item and re-add at new position
    // Better approach: update sortOrder via a dedicated endpoint
    // For now, we'll just reload after swapping
    const item = items[idx];
    const swapItem = items[swapIdx];

    await Promise.all([
      fetch(`/api/clinician/curricula/${params.id}/items/${item.id}`, {
        method: "DELETE",
      }),
      fetch(`/api/clinician/curricula/${params.id}/items/${swapItem.id}`, {
        method: "DELETE",
      }),
    ]);

    await Promise.all([
      fetch(`/api/clinician/curricula/${params.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: item.characterId,
          scenario: item.scenario,
          sortOrder: swapItem.sortOrder,
        }),
      }),
      fetch(`/api/clinician/curricula/${params.id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterId: swapItem.characterId,
          scenario: swapItem.scenario,
          sortOrder: item.sortOrder,
        }),
      }),
    ]);

    load();
  }

  if (loading) return <p className="text-muted-foreground">Loading...</p>;
  if (!curriculum) return <p className="text-destructive">Not found.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {curriculum.title}
        </h1>
        {curriculum.description && (
          <p className="mt-2 text-muted-foreground">
            {curriculum.description}
          </p>
        )}
      </div>

      {/* Items list */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Curriculum Items ({curriculum.items.length})
        </h2>

        {curriculum.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No items yet. Add a character-scenario pair below.
          </p>
        ) : (
          <div className="space-y-3">
            {curriculum.items.map((item, idx) => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-4 py-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.characterName ?? "Unknown character"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.scenario}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={idx === 0}
                      onClick={() => handleMoveItem(item.id, "up")}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={idx === curriculum.items.length - 1}
                      onClick={() => handleMoveItem(item.id, "down")}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add item */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add an item</CardTitle>
        </CardHeader>
        <CardContent>
          {characters.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You need to create characters first before adding curriculum items.
            </p>
          ) : (
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="space-y-2">
                <Label>Character</Label>
                <Select
                  value={selectedCharacterId}
                  onValueChange={setSelectedCharacterId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a character" />
                  </SelectTrigger>
                  <SelectContent>
                    {characters.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Scenario</Label>
                <Textarea
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  placeholder="Describe the scenario for this conversation..."
                  rows={2}
                />
              </div>
              <Button
                type="submit"
                disabled={addingItem || !selectedCharacterId || !scenario}
              >
                <Plus className="mr-2 h-4 w-4" />
                {addingItem ? "Adding..." : "Add item"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
