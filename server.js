const basicAuth = require('express-basic-auth');
require('dotenv').config(); // যেন .env ফাইল কাজ করে

// -----------------
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Show index.ejs at root route (must be before static)
app.get('/', (req, res) => {
  res.render('index', { result: null });
});

// Static files (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

// Codes file handling
const codesFilePath = path.join(__dirname, 'codes.json');
let codes = [];

if (fs.existsSync(codesFilePath)) {
  codes = JSON.parse(fs.readFileSync(codesFilePath));
}

function saveCodes() {
  fs.writeFileSync(codesFilePath, JSON.stringify(codes, null, 2));
}

// Verify code
app.post('/verify', (req, res) => {
  const userCode = req.body.code;
  const found = codes.find(c => c.code === userCode);

  if (!found) {
    return res.render('index', { result: '❌ আপনার কোডটি ভুল বা ভুয়া।' });
  }

  if (found.used) {
    return res.render('index', { result: '⚠️ এই কোডটি ইতিমধ্যে ব্যবহৃত হয়েছে।' });
  }

  found.used = true;
  saveCodes();
  res.render('index', { result: '✅ এই কোডটি বৈধ, প্রোডাক্টটি আসল।' });
});

app.use('/admin', basicAuth({
  users: { [process.env.ADMIN_USER]: process.env.ADMIN_PASS },
  challenge: true
}));

// ----------------------------
// Admin panel
app.get('/admin', (req, res) => {
  res.render('admin', { codes });
});
app.get('/admin', (req, res) => {
  res.send('Welcome to the Admin Panel 🔐');
});

app.post('/generate', (req, res) => {
  const password = req.body.password;
  if (password !== '661996') return res.send('ভুল পাসওয়ার্ড!');

  const count = parseInt(req.body.count);
  for (let i = 0; i < count; i++) {
    const newCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    codes.push({ code: newCode, used: false });
  }
  saveCodes();
  res.redirect('/admin');
});

 

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
// Export codes
const exportRouter = require('./routes/export');
app.use('/export', exportRouter);

app.get('/export', (req, res) => {
  let exportText = 'Generated Codes:\n\n';
  codes.forEach(c => {
    exportText += `${c.code} - ${c.used ? 'USED' : 'UNUSED'}\n`;
  });

  res.setHeader('Content-disposition', 'attachment; filename=codes.txt');
  res.setHeader('Content-Type', 'text/plain');
  res.send(exportText);
});

// Delete codes
app.post('/delete-old-codes', (req, res) => {
  const password = req.body.password;
  if (password !== '661996') return res.send('❌ ভুল পাসওয়ার্ড! অনুমতি নেই।');

  codes = [];
  saveCodes();
  res.send('✅ পুরাতন সব কোড মুছে ফেলা হয়েছে।');
});

// Other pages (static)
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'product.html'));
});

app.get('/au', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'au.html'));
});

 
 