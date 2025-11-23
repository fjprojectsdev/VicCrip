const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const SECRET_KEY = process.env.JWT_SECRET || 'chave_super_secreta_padrao';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'FJMR2025';

app.use(cors());
app.use(express.json());

let data = {
  bannedWords: [],
  allowedGroups: [],
  admins: [],
  logs: []
};

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, SECRET_KEY, { expiresIn: '24h' });
    data.logs.unshift({ timestamp: new Date().toISOString(), action: 'Login realizado' });
    res.json({ token, message: "Login realizado" });
  } else {
    res.status(401).json({ message: "Senha incorreta" });
  }
});

app.get('/api/stats', authenticateToken, (req, res) => {
  res.json({
    bannedWords: data.bannedWords.length,
    allowedGroups: data.allowedGroups.length,
    admins: data.admins.length,
    lembretes: 0
  });
});

app.get('/api/banned-words', authenticateToken, (req, res) => {
  res.json(data.bannedWords);
});

app.post('/api/banned-words', authenticateToken, (req, res) => {
  const { word } = req.body;
  if (word && !data.bannedWords.includes(word)) {
    data.bannedWords.push(word);
    data.logs.unshift({ timestamp: new Date().toISOString(), action: `Palavra banida: ${word}` });
  }
  res.json({ success: true });
});

app.delete('/api/banned-words/:word', authenticateToken, (req, res) => {
  data.bannedWords = data.bannedWords.filter(w => w !== req.params.word);
  data.logs.unshift({ timestamp: new Date().toISOString(), action: `Palavra removida: ${req.params.word}` });
  res.json({ success: true });
});

app.get('/api/allowed-groups', authenticateToken, (req, res) => {
  res.json(data.allowedGroups);
});

app.post('/api/allowed-groups', authenticateToken, (req, res) => {
  const { name } = req.body;
  if (name && !data.allowedGroups.includes(name)) {
    data.allowedGroups.push(name);
    data.logs.unshift({ timestamp: new Date().toISOString(), action: `Grupo adicionado: ${name}` });
  }
  res.json({ success: true });
});

app.delete('/api/allowed-groups/:name', authenticateToken, (req, res) => {
  data.allowedGroups = data.allowedGroups.filter(g => g !== req.params.name);
  data.logs.unshift({ timestamp: new Date().toISOString(), action: `Grupo removido: ${req.params.name}` });
  res.json({ success: true });
});

app.get('/api/admins', authenticateToken, (req, res) => {
  res.json(data.admins);
});

app.get('/api/logs', authenticateToken, (req, res) => {
  res.json(data.logs.slice(0, 50));
});

module.exports = app;
