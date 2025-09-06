// const express = require('express');
// const router = express.Router();
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();

// const EXPORT_PASSWORD = process.env.EXPORT_PASSWORD;

// router.get('/', (req, res) => {
//   const password = req.query.password;

//   if (password !== EXPORT_PASSWORD) {
//     return res.status(401).send('⛔ Unauthorized: সঠিক পাসওয়ার্ড দিন');
//   }

//   const filePath = path.join(__dirname, '../codes.json');

//   res.download(filePath, 'codes.txt', (err) => {
//     if (err) {
//       res.status(500).send('⚠️ ফাইল ডাউনলোডে সমস্যা হয়েছে');
//     }
//   });
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const EXPORT_PASSWORD = process.env.EXPORT_PASSWORD;

router.get('/', (req, res) => {
  const password = req.query.password;

  if (password !== EXPORT_PASSWORD) {
    return res.status(401).send('⛔ Unauthorized: সঠিক পাসওয়ার্ড দিন');
  }

  const filePath = path.join(__dirname, '../codes.json');

  // ফাইল পড়া এবং কনভার্ট করা .txt ফরম্যাটে
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('⚠️ ফাইল পড়তে সমস্যা হয়েছে');
    }

    let codes;
    try {
      codes = JSON.parse(data); // JSON থেকে অ্যারে বানাচ্ছি
    } catch (e) {
      return res.status(500).send('⚠️ JSON ফাইল ভ্যালিড নয়');
    }

    const prettyText = codes
      .map(c => `Code: ${c.code} | Used: ${c.used}`)
      .join('\n');

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="codes.txt"');
    res.send(prettyText);
  });
});

module.exports = router;
