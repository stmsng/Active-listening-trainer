"use client";

import { useRouter } from "next/navigation";
import { CharacterForm } from "@/components/character-form";
import type { CharacterInput } from "@/lib/validations/character";

export default function NewCharacterPage() {
  const router = useRouter();

  async function handleSubmit(data: CharacterInput) {
    const res = await fetch("/api/clinician/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to create character");
    }
    router.push("/clinician/characters");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Character</h1>
        <p className="mt-2 text-muted-foreground">
          Design a new AI conversation partner.
        </p>
      </div>
      <CharacterForm onSubmit={handleSubmit} submitLabel="Create character" />
    </div>
  );
}
