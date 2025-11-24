<script setup>
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Hr,
  Preview,
  Section,
} from '@vue-email/components';

defineProps({
  title: String,
});
</script>

<template>
  <Html lang="pt-BR">
    <Head />
    <Preview>Bem-vindo ao UFABC Next!</Preview>
    <Body>
      <Container
        style="
          background-color: #ffffff;
          margin: 0 auto;
          padding: 20px;
          border-radius: 5px;
          border: 1px solid #e1e8ed;
        "
      >
        <Section>
          <Text
            style="
              font-size: 24px;
              font-weight: bold;
              color: #1a1a1a;
              margin: 0 0 20px 0;
            "
          >
            {{ title || 'Bem-vindo!' }}
          </Text>

          <Text
            style="
              font-size: 16px;
              color: #333;
              line-height: 1.5;
              margin: 0 0 20px 0;
            "
          >
            Olá! É um prazer ter você conosco no UFABC Next. Estamos aqui para
            tornar sua experiência acadêmica ainda melhor.
          </Text>

          <Hr
            style="border: none; border-top: 1px solid #e1e8ed; margin: 30px 0"
          />

          <Section style="text-align: center; margin: 30px 0">
            <Button
              href="https://ufabcnext.com"
              style="
                background-color: #007ee6;
                color: white;
                padding: 12px 24px;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
              "
            >
              Acessar Plataforma
            </Button>
          </Section>

          <Text style="font-size: 14px; color: #666; margin: 30px 0 0 0">
            Se você tiver alguma dúvida, não hesite em nos contatar.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
</template>
