import { EmailProvider, EmailMessage } from "./types";

export class ConsoleEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<void> {
    console.log("========== EMAIL ==========");
    console.log(`To:      ${message.to}`);
    console.log(`Subject: ${message.subject}`);
    console.log(`Body:    ${message.textBody}`);
    console.log("===========================");
  }
}
