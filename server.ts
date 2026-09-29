import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Health check endpoint for Cloud Run
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'police-position-management', timestamp: new Date().toISOString() });
});

// Server-side video generation proxy
app.post('/api/generate-video', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(400).json({ error: 'ไม่พบการตั้งค่า GEMINI_API_KEY ในสภาพแวดล้อม' });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const { prompt, aspectRatio } = req.body;
    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: prompt || 'Royal Thai Police officers serving citizens with dignity and compassion',
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio || '16:9',
      },
    });

    return res.json({ operationName: operation.name });
  } catch (err: any) {
    console.error('Video generation error:', err);
    const msg = err?.message || 'เกิดข้อผิดพลาดในการเรียกใช้งานโมเดล Veo';
    if (msg.includes('quota') || msg.includes('resource_exhausted')) {
      return res.status(429).json({
        error: 'โควตาการใช้งานโมเดล AI สิ้นสุด (Quota Exceeded) กรุณาตรวจสอบการตั้งค่า Billing ใน Google AI Studio',
        isQuotaExhausted: true,
      });
    }
    return res.status(500).json({ error: msg });
  }
});

// Serve frontend dist directory
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>ระบบบริหารจัดการข้อมูลการกันตำแหน่งข้าราชการตำรวจ</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>กำลังเตรียมระบบ กรุณารอสักครู่...</h2>
          <p>หากข้อความนี้ยังปรากฏ กรุณารันคำสั่ง build ก่อนเริ่มระบบ</p>
        </body>
      </html>
    `);
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
