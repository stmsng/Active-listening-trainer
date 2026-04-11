"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CharacterForm } from "@/components/character-form";
import type { CharacterInput } from "@/lib/validations/character";

export default function EditCharacterPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [defaults, setDefaults] = useState<CharacterInput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/clinician/characters/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setDefaults({
          name: data.name,
          isTherapist: data.isTherapist,
          introversion: data.introversion,
          communicationSkill: data.communicationSkill,
          openness: data.openness,
          conscientiousness: data.conscientiousness,
          age: data.age,
          gender: data.gender,
          nationality: data.nationality,
          reactivity: data.reactivity,
          specialNotes: data.specialNotes ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function handleSubmit(data: CharacterInput) {
    const res = await fetch(`/api/clinician/characters/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error ?? "Failed to update character");
    }
    router.push("/clinician/characters");
  }

  if (loading) {
    return <p className="text-muted-foreground">Loading...</p>;
  }

  if (!defaults) {
    return <p className="text-destructive">Character not found.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Character</h1>
        <p className="mt-2 text-muted-foreground">
          Update this character&apos;s personality traits.
        </p>
      </div>
      <CharacterForm
        defaultValues={defaults}
        onSubmit={handleSubmit}
        submitLabel="Update character"
      />
    </div>
  );
}
