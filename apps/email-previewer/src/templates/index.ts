import type { EmailTemplateConfig } from './types';
import { welcomeEmailTemplate } from './welcome-email/config';

/**
 * Registry of all email templates here
 * To add a new template:
 * 1. Create a folder in /templates with your template component (index.vue)
 * 2. Create a config.ts file exporting an EmailTemplateConfig
 * 3. Import and add to this array
 */
export const emailTemplates: EmailTemplateConfig[] = [welcomeEmailTemplate];

export function getEmailTemplates(): EmailTemplateConfig[] {
  return emailTemplates;
}
