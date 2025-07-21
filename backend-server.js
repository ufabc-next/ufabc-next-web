require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, APIErrorCode } = require('@notionhq/client');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      'http://localhost:3000'
    ],
    credentials: true,
  }),
);

app.use(express.json());

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

app.post('/api/notion/card', async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description || !priority) {
      return res.status(400).json({
        error: 'Title, description, and priority are required fields',
      });
    }

    if (!['Baixa', 'Média', 'Alta'].includes(priority)) {
      return res.status(400).json({
        error: 'Priority must be one of: Baixa, Média, Alta',
      });
    }

    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      return res.status(500).json({ error: 'NOTION_DATABASE_ID environment variable is required' });
    }

    const response = await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Título: {
          title: [
            {
              text: {
                content: title,
              },
            },
          ],
        },
        Descrição: {
          rich_text: [
            {
              text: {
                content: description,
              },
            },
          ],
        },
        Prioridade: {
          select: {
            name: priority,
          },
        },
        Criação: {
          date: {
            start: new Date().toISOString(),
          },
        },
      },
    });

    return res.status(201).json({
      id: response.id,
      url: response.url,
      created_time: response.created_time || new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating Notion card:', error);

    // Tratamento de erro aprimorado com o SDK
    if (error.code === APIErrorCode.ObjectNotFound) {
      return res.status(404).json({ error: 'Database not found. Check NOTION_DATABASE_ID.' });
    }
    if (error.code === APIErrorCode.Unauthorized) {
      return res.status(401).json({ error: 'Invalid Notion token. Check NOTION_TOKEN.' });
    }
    if (error.code === APIErrorCode.ValidationError) {
      return res.status(400).json({ error: `Notion API validation error: ${error.message}` });
    }

    return res.status(500).json({
      error: error.message || 'Failed to create Notion card',
    });
  }
});

app.listen(PORT, () => {
  console.log(`port ${PORT}`);
});
