"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  characterSchema,
  type CharacterInput,
} from "@/lib/validations/character";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CharacterFormProps {
  defaultValues?: Partial<CharacterInput>;
  onSubmit: (data: CharacterInput) => Promise<void>;
  submitLabel?: string;
}

const SCALE_FIELDS = [
  { name: "introversion" as const, label: "Introversion" },
  { name: "communicationSkill" as const, label: "Communication Skill" },
  { name: "openness" as const, label: "Openness" },
  { name: "conscientiousness" as const, label: "Conscientiousness" },
  { name: "reactivity" as const, label: "Reactivity" },
] as const;

export function CharacterForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save character",
}: CharacterFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CharacterInput>({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      isTherapist: false,
      introversion: 5,
      communicationSkill: 5,
      openness: 5,
      conscientiousness: 5,
      reactivity: 5,
      specialNotes: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} placeholder="Character name" />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input
            id="nationality"
            {...register("nationality")}
            placeholder="e.g. Japanese"
          />
          {errors.nationality && (
            <p className="text-sm text-destructive">
              {errors.nationality.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            {...register("age", { valueAsNumber: true })}
            placeholder="e.g. 35"
          />
          {errors.age && (
            <p className="text-sm text-destructive">{errors.age.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="nonbinary">Nonbinary</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>
      </div>

      {/* Therapist toggle */}
      <div className="flex items-center gap-3">
        <Controller
          control={control}
          name="isTherapist"
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              id="isTherapist"
            />
          )}
        />
        <Label htmlFor="isTherapist">Is a therapist character</Label>
      </div>

      {/* Personality Scales */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Personality Traits (1-10)
        </h3>
        {SCALE_FIELDS.map(({ name, label }) => (
          <div key={name} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{label}</Label>
              <Controller
                control={control}
                name={name}
                render={({ field }) => (
                  <span className="text-sm font-medium text-accent">
                    {field.value}
                  </span>
                )}
              />
            </div>
            <Controller
              control={control}
              name={name}
              render={({ field }) => (
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[field.value]}
                  onValueChange={([v]) => field.onChange(v)}
                />
              )}
            />
          </div>
        ))}
      </div>

      {/* Special Notes */}
      <div className="space-y-2">
        <Label htmlFor="specialNotes">Special Notes</Label>
        <Textarea
          id="specialNotes"
          {...register("specialNotes")}
          placeholder="Any special behavioral notes for this character..."
          rows={3}
        />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
