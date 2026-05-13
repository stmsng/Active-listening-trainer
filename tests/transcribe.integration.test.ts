import { test, expect, beforeAll } from "bun:test";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = process.env.TEST_BASE_URL ?? "http://localhost:3000";
const FIXTURE_DIR = join(__dirname, "fixtures");
const FIXTURE_PATH = join(FIXTURE_DIR, "voice.ogg");
const EXPECTED_PATH = join(FIXTURE_DIR, "voice.expected.txt");

let fixtureBytes: Buffer | null = null;
let expected: string | null = null;

beforeAll(async () => {
  if (existsSync(FIXTURE_PATH)) {
    fixtureBytes = await readFile(FIXTURE_PATH);
  }
  if (existsSync(EXPECTED_PATH)) {
    expected = (await readFile(EXPECTED_PATH, "utf8")).trim();
  }
});

test("POST /api/voice/transcribe returns text for the .ogg fixture", async () => {
  if (!fixtureBytes) {
    console.warn(
      `[skip] Missing ${FIXTURE_PATH} — see tests/fixtures/README.md to record one.`,
    );
    return;
  }
  if (fixtureBytes.length === 0) {
    throw new Error(`Fixture ${FIXTURE_PATH} is empty`);
  }

  const form = new FormData();
  form.append(
    "audio",
    new Blob([fixtureBytes], { type: "audio/ogg" }),
    "voice.ogg",
  );

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/voice/transcribe`, {
      method: "POST",
      body: form,
    });
  } catch (err) {
    throw new Error(
      `Dev server unreachable at ${BASE_URL}. Start it, or set TEST_BASE_URL.\n${err}`,
    );
  }

  const raw = await res.text();
  let body: { text?: string; error?: string } = {};
  try {
    body = JSON.parse(raw);
  } catch {
    // non-JSON response
  }

  if (res.status !== 200) {
    throw new Error(
      `Transcribe failed: HTTP ${res.status} — ${body.error ?? raw}`,
    );
  }

  console.log("Transcribed:", JSON.stringify(body.text));
  expect(body.text?.trim()).toBeTruthy();

  if (expected) {
    expect(body.text!.toLowerCase()).toContain(expected.toLowerCase());
  }
});
