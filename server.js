const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const activeUsers = new Map(); // Przechowuje nicki i czas ostatniej aktywności
const INACTIVITY_TIMEOUT = 30 * 1000; // 30 sekund nieaktywności

app.post('/register', (req, res) => {
  const { nick } = req.body;
  if (!nick) return res.status(400).send('Brak nicku');
  activeUsers.set(nick, Date.now()); // Aktualizuj czas przy każdym rejestrze
  res.send('Zarejestrowano');
});

app.get('/active', (req, res) => {
  // Usuń nieaktywnych graczy (np. po 30 sekundach)
  const now = Date.now();
  activeUsers.forEach((time, nick) => {
    if (now - time > INACTIVITY_TIMEOUT) activeUsers.delete(nick);
  });
  res.json([...activeUsers.keys()]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
