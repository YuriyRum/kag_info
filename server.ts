import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { crawlAdenauerWebsite, getCachedAnalysis } from './server/crawler';
import { summarizeSchoolWebsiteForParents } from './server/gemini';
import { sendNewsletter } from './server/mailer';
import { store } from './server/store';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. Analyze / Crawl https://adenauer-bonn.de/
  app.get('/api/site/analyze', async (req, res) => {
    try {
      let data = getCachedAnalysis();
      if (!data) {
        data = await crawlAdenauerWebsite(false);
      }
      res.json(data);
    } catch (err: any) {
      console.error('Crawl error:', err);
      res.status(500).json({ error: err.message || 'Fehler beim Abrufen der Schuldaten' });
    }
  });

  app.post('/api/site/crawl', async (req, res) => {
    try {
      const data = await crawlAdenauerWebsite(true);
      res.json(data);
    } catch (err: any) {
      console.error('Force crawl error:', err);
      res.status(500).json({ error: err.message || 'Fehler beim Crawlen der Website' });
    }
  });

  // 2. Generate Newsletter using Gemini 3.8 Flash
  app.post('/api/newsletter/generate', async (req, res) => {
    try {
      const { language = 'de', customInstructions } = req.body;
      let siteData = getCachedAnalysis();
      if (!siteData || siteData.posts.length === 0) {
        siteData = await crawlAdenauerWebsite(false);
      }

      const safeLang = (['de', 'en', 'ru'].includes(language) ? language : 'de') as 'de' | 'en' | 'ru';
      const newsletter = await summarizeSchoolWebsiteForParents(
        siteData,
        safeLang,
        customInstructions
      );

      // Save newsletter to store archive
      store.saveNewsletter(newsletter);

      res.json(newsletter);
    } catch (err: any) {
      console.error('Newsletter generation error:', err);
      res.status(500).json({ error: err.message || 'Fehler bei der KI-Zusammenfassung' });
    }
  });

  // 3. Newsletters Archive
  app.get('/api/newsletters', (req, res) => {
    const newsletters = store.getNewsletters();
    res.json(newsletters);
  });

  app.get('/api/newsletters/:id', (req, res) => {
    const newsletter = store.getNewsletterById(req.params.id);
    if (!newsletter) {
      return res.status(404).json({ error: 'Newsletter nicht gefunden' });
    }
    res.json(newsletter);
  });

  // 4. Send Newsletter directly to subscribers or target emails
  app.post('/api/newsletters/send', async (req, res) => {
    try {
      const { newsletterId, targetEmails } = req.body;
      let newsletter = req.body.newsletter;

      if (!newsletter && newsletterId) {
        newsletter = store.getNewsletterById(newsletterId);
      }

      if (!newsletter) {
        const list = store.getNewsletters();
        if (list.length > 0) {
          newsletter = list[0];
        }
      }

      if (!newsletter) {
        return res.status(400).json({ error: 'Kein Newsletter zum Versenden vorhanden. Bitte zuerst generieren.' });
      }

      const result = await sendNewsletter(newsletter, targetEmails);
      res.json(result);
    } catch (err: any) {
      console.error('Send error:', err);
      res.status(500).json({ error: err.message || 'Versand fehlgeschlagen' });
    }
  });

  // 5. Subscribers Management
  app.get('/api/subscribers', (req, res) => {
    const subscribers = store.getSubscribers();
    res.json(subscribers);
  });

  app.post('/api/subscribers', (req, res) => {
    try {
      const { name, email, grades, language, active } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Gültige E-Mail-Adresse erforderlich' });
      }
      const subscriber = store.addSubscriber({
        name: name || 'Elternteil',
        email,
        grades: Array.isArray(grades) ? grades : ['Alle Stufen'],
        language: language === 'ru' ? 'ru' : language === 'en' ? 'en' : 'de',
        active: active !== false,
      });
      res.json(subscriber);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/subscribers/:id', (req, res) => {
    const updated = store.updateSubscriber(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Abonnent nicht gefunden' });
    }
    res.json(updated);
  });

  app.delete('/api/subscribers/:id', (req, res) => {
    const success = store.deleteSubscriber(req.params.id);
    res.json({ success });
  });

  // 6. Delivery Logs & Schedule
  app.get('/api/delivery-logs', (req, res) => {
    const logs = store.getDeliveryLogs();
    res.json(logs);
  });

  app.get('/api/schedule', (req, res) => {
    const schedule = store.getSchedule();
    res.json(schedule);
  });

  app.post('/api/schedule', (req, res) => {
    const updated = store.updateSchedule(req.body);
    res.json(updated);
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KAG Bonn Parent Newsletter Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
