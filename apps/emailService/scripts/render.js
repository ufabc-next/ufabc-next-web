import { render } from '@vue-email/render';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = fs.readdirSync(`${__dirname}/../templates`);

if (!fs.existsSync('preview')) {
  fs.mkdirSync('preview');
}

for (const fileName of files) {
  const name = path.parse(fileName).name;

  const currentTemplate = await import(`${__dirname}/../dist/${name}.js`);

  const html = await render(currentTemplate.default, { title: '{{title}}' });

  const text = await render(
    currentTemplate.default,
    { title: '{{title}}', ctaUrl: '{{url}}' },
    { plainText: true },
  );

  fs.writeFileSync(path.join('preview', `${name}.html`), html);
  fs.writeFileSync(path.join('preview', `${name}.txt`), text);
  console.log(`✅ Template ${name} renderizado em /preview`);
}
