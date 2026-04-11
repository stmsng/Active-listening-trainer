export interface EmailMessage {
  to: string;
  subject: string;
  textBody: string;
  htmlBody?: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}
