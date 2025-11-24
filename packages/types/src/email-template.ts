export type EmailTemplateSummary = {
  id: string;
  name: string;
  description: string;
  tags?: string[];
};

export type PreviewDevice = {
  name: string;
  width: number;
};

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  variants: EmailTemplateVariant[];
}

export type EmailTemplateVariant = {
  id: string;
  label: string;
  description?: string;
  html: string;
};

export type VariantOption = Omit<EmailTemplateVariant, 'html'>;
