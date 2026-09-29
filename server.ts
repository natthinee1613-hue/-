import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_POLICE_RECORDS } from './src/data/initialData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';
const DATA_FILE = path.join(process.cwd(), 'server-data.json');

// Middleware for parsing large JSON payloads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

interface ServerDataPayload {
  version: number;
  lastPublishedAt: string;
  lastPublishedBy: string;
  records: any[];
  auditLogs: any[];
}

// Helper to initialize or load server data
function loadServerData(): ServerDataPayload {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.records) && data.records.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error('[Server] Error reading server-data.json, re-initializing...', err);
  }

  // Fallback to initial records
  const initialPayload: ServerDataPayload = {
    version: 1,
    lastPublishedAt: new Date().toISOString(),
    lastPublishedBy: 'ระบบสารบรรณกลาง (กำลังพล ตร.)',
    records: INITIAL_POLICE_RECORDS,
    auditLogs: [],
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialPayload, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Server] Failed to write initial server-data.json', err);
  }

  return initialPayload;
}

// Helper to save server data
function saveServerData(data: ServerDataPayload): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Server] Failed to write server-data.json', err);
    return false;
  }
}

// ----------------- API ROUTES ----------------- //

// 1. Get current published records & metadata
app.get('/api/records', (req, res) => {
  const data = loadServerData();
  res.json({
    success: true,
    version: data.version,
    lastPublishedAt: data.lastPublishedAt,
    lastPublishedBy: data.lastPublishedBy,
    totalRecords: data.records.length,
    records: data.records,
  });
});

// 2. Publish/Save updated records to server
app.post('/api/records/publish', (req, res) => {
  const { records, publishedBy, note } = req.body;

  if (!Array.isArray(records)) {
    return res.status(400).json({ success: false, error: 'ข้อมูล records ต้องเป็น Array' });
  }

  const current = loadServerData();
  const newVersion = (current.version || 1) + 1;
  const now = new Date().toISOString();
  const author = publishedBy || 'เจ้าหน้าที่ผู้บันทึก';

  const updatedPayload: ServerDataPayload = {
    version: newVersion,
    lastPublishedAt: now,
    lastPublishedBy: author,
    records,
    auditLogs: [
      {
        id: `pub-${Date.now()}`,
        action: 'PUBLISH_TO_WEB',
        timestamp: now,
        officerName: author,
        details: note || `เผยแพร่อัปเดตข้อมูลตารางลงเว็ปสำเร็จ (${records.length} รายการ)`,
        totalRecords: records.length,
      },
      ...(current.auditLogs || []).slice(0, 499),
    ],
  };

  const saved = saveServerData(updatedPayload);
  if (!saved) {
    return res.status(500).json({ success: false, error: 'ไม่สามารถบันทึกลงดิสก์เซิร์ฟเวอร์ได้' });
  }

  console.log(`[Server] Published version ${newVersion} with ${records.length} records by ${author}`);
  res.json({
    success: true,
    version: newVersion,
    lastPublishedAt: now,
    lastPublishedBy: author,
    totalRecords: records.length,
    message: `เผยแพร่ข้อมูลลงเว็ปสำเร็จ (เวอร์ชัน ${newVersion})`,
  });
});

// 3. Simple auto-save endpoint
app.post('/api/records', (req, res) => {
  const { records, publishedBy } = req.body;
  if (!Array.isArray(records)) {
    return res.status(400).json({ success: false, error: 'ข้อมูล records ต้องเป็น Array' });
  }

  const current = loadServerData();
  const updatedPayload: ServerDataPayload = {
    ...current,
    records,
    lastPublishedBy: publishedBy || current.lastPublishedBy,
    lastPublishedAt: new Date().toISOString(),
  };

  saveServerData(updatedPayload);
  res.json({
    success: true,
    version: updatedPayload.version,
    lastPublishedAt: updatedPayload.lastPublishedAt,
    totalRecords: records.length,
  });
});

// 4. Reset records to initial default
app.post('/api/records/reset', (req, res) => {
  const resetPayload: ServerDataPayload = {
    version: 1,
    lastPublishedAt: new Date().toISOString(),
    lastPublishedBy: 'ระบบสารบรรณกลาง (รีเซ็ตเป็นค่าเริ่มต้น)',
    records: INITIAL_POLICE_RECORDS,
    auditLogs: [],
  };

  saveServerData(resetPayload);
  console.log('[Server] Reset data to initial default records');
  res.json({
    success: true,
    version: 1,
    lastPublishedAt: resetPayload.lastPublishedAt,
    totalRecords: INITIAL_POLICE_RECORDS.length,
    records: INITIAL_POLICE_RECORDS,
    message: 'รีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น 54 รายการ เรียบร้อยแล้ว',
  });
});

// 5. System Status API
app.get('/api/status', (req, res) => {
  const data = loadServerData();
  res.json({
    status: 'online',
    version: data.version,
    totalRecords: data.records.length,
    lastPublishedAt: data.lastPublishedAt,
    lastPublishedBy: data.lastPublishedBy,
    environment: isProd ? 'production' : 'development',
    serverTime: new Date().toISOString(),
  });
});

// 6. Audit logs API
app.get('/api/audit-logs', (req, res) => {
  const data = loadServerData();
  res.json({
    success: true,
    auditLogs: data.auditLogs || [],
  });
});

app.post('/api/audit-logs', (req, res) => {
  const logItem = req.body;
  if (!logItem) return res.status(400).json({ error: 'Missing logItem' });

  const current = loadServerData();
  const updatedLogs = [logItem, ...(current.auditLogs || []).slice(0, 499)];
  saveServerData({ ...current, auditLogs: updatedLogs });
  res.json({ success: true });
});

// ----------------- STATIC / VITE MIDDLEWARE ----------------- //
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Police Position Management App running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[Server] Fatal error starting server:', err);
  process.exit(1);
});
