export interface MailOptionsI {
  to: string;
  from?: string;
  subject: string;
  templateName: string;
  variables?: object;
}