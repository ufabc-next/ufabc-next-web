import { render } from '@vue-email/render';
import type { Component } from 'vue';

export async function renderEmailTemplate(
  component: Component,
  props: Record<string, unknown> = {},
): Promise<string> {
  try {
    const html = await render(component, props);
    return html;
  } catch (error) {
    console.error('Failed to render email template:', error);
    throw error;
  }
}
