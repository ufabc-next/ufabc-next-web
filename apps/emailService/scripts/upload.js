import { SESClient, CreateTemplateCommand, UpdateTemplateCommand } from '@aws-sdk/client-ses';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function sendTemplateToSES(templateName) {

  const currentHtml = .;
  const currentText = .;
    
  const templateParams = {
    Template: {
      TemplateName: templateName,
      SubjectPart: '{{subject}}',
      HtmlPart: currentHtml,
      TextPart: currentText,
    },
  };

  try {
      // Tenta criar template
      const createCommand = new CreateTemplateCommand(templateParams);
      await sesClient.send(createCommand);
      console.log(`✅ Template ${templateName} criado no SES`);
    } catch (error) {
      if (error.name === 'AlreadyExistsException') {
        // Se template ja existe, atualiza
        const updateCommand = new UpdateTemplateCommand(templateParams);
        await sesClient.send(updateCommand);
        console.log(`✅ Template ${templateName} atualizado no SES`);
      } else {
        console.error(`Erro ao fazer upload do template ${templateName}:`, error);
      }
    }
}

async function uploadAllTemplates() {
  const files = fs.readdirSync(`${__dirname}/../email-templates`);
  
  for (const fileName of files) {
    //implementar
  }
}

async function main() {
  const templateName = process.argv[2];
  
  if (templateName) {
    // Se um nome de template foi fornecido, faz upload apenas dele
    console.log(`Fazendo upload do template: ${templateName}`);
    try {
      await sendTemplateToSES(templateName);
    } catch (error) {
      console.error('Falha no upload');
      process.exit(1);
    }
  } else {
    // Se nenhum nome foi fornecido, faz upload de todos os templates
    console.log('Fazendo upload de todos os templates...');
    await uploadAllTemplates();
  }
}

main().catch(console.error);
