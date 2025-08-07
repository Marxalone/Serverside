const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'public', 'stats.json');

function loadStats() {
  if (!fs.existsSync(filePath)) {
    return { total: 0, users: {}, botLastSeen: 0 };
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveStats(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Only POST allowed');
  }

  const { jid, type, timestamp } = req.body;
  let stats = loadStats();

  if (type === 'active') {
    if (!stats.users[jid]) {
      stats.total += 1;
    }
    stats.users[jid] = timestamp;
  }

  if (type === 'bot-disconnected') {
    stats.botLastSeen = timestamp;
  }

  saveStats(stats);
  return res.status(200).json({ success: true });
}