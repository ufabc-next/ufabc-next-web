<template>
  <EHtml>
    <EHead>
      <EFont
        font-family="Inter"
        fallback-font-family="Verdana"
        web-font="{
          url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
          format: 'woff2'
        }"
      />
    </EHead>
    <EBody
      style="
        background-color: #f6f9fc;
        font-family: 'Inter', Verdana, sans-serif;
      "
    >
      <EContainer style="max-width: 600px; margin: 0 auto; padding: 20px">
        <ESection
          style="background-color: white; border-radius: 8px; padding: 40px"
        >
          <!-- Header -->
          <ERow>
            <EColumn>
              <EImg
                src="https://ufabc.edu.br/images/logo.png"
                alt="UFABC"
                width="120"
                height="40"
                style="margin-bottom: 30px"
              />
            </EColumn>
          </ERow>

          <!-- Content -->
          <ERow>
            <EColumn>
              <EHeading
                as="h1"
                style="
                  color: #1a1a1a;
                  font-size: 24px;
                  font-weight: 600;
                  margin-bottom: 16px;
                "
              >
                Bem-vindo ao UFABC Next!
              </EHeading>

              <EText
                style="
                  color: #666;
                  font-size: 16px;
                  line-height: 24px;
                  margin-bottom: 24px;
                "
              >
                Olá {{ name }},
              </EText>

              <EText
                style="
                  color: #666;
                  font-size: 16px;
                  line-height: 24px;
                  margin-bottom: 24px;
                "
              >
                Seja bem-vindo ao UFABC Next! Sua conta foi criada com sucesso e
                você já pode começar a utilizar todas as funcionalidades da
                plataforma.
              </EText>

              <!-- CTA Button -->
              <EButton
                :href="ctaUrl"
                style="
                  background-color: #2563eb;
                  color: white;
                  padding: 12px 24px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-weight: 600;
                "
              >
                Acessar Plataforma
              </EButton>
            </EColumn>
          </ERow>

          <!-- Footer -->
          <ERow
            style="
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            "
          >
            <EColumn>
              <EText
                style="color: #9ca3af; font-size: 14px; text-align: center"
              >
                Este é um email automático, não responda a esta mensagem.
              </EText>
              <EText
                style="
                  color: #9ca3af;
                  font-size: 14px;
                  text-align: center;
                  margin-top: 8px;
                "
              >
                UFABC Next - Universidade Federal do ABC
              </EText>
            </EColumn>
          </ERow>
        </ESection>
      </EContainer>
    </EBody>
  </EHtml>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  ctaUrl: {
    type: String,
    required: true,
  },
});
</script>
