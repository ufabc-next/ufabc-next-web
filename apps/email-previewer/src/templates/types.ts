import type { Component } from 'vue';

export type EmailTemplateVariant<TProps = Record<string, unknown>> = {
  id: string;
  label: string;
  description?: string;
  props: TProps;
};

export type EmailTemplateConfig<TProps = Record<string, unknown>> = {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  component: Component;
  variants: EmailTemplateVariant<TProps>[];
};
