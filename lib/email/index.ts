import { EmailProvider } from "./types";
import { ConsoleEmailProvider } from "./console-provider";

export function getEmailProvider(): EmailProvider {
  // Swap implementation here when a real provider is ready
  return new ConsoleEmailProvider();
}

export type { EmailMessage, EmailProvider } from "./types";
