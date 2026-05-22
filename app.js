const path = require('path');
const express = require('express');
const app = express();
const rootdir = require("./utils/pathUtil");
const userrouter = require('./Routes/userrouter');
const hostrouter = require('./Routes/hostrouter');
const { mongoConnect } = require('./utils/databaseutil');
const cookieParser = require('cookie-parser');
const { attachAuthLocals } = require('./middleware/auth');


app.use(express.json());
app.post('/gemini-chat', async (req, res) => {
  const apiKey = 'AIzaSyAE1q9Z2NY-mnt4sq-L09La6NtG6Ov-JkA';
  const { message } = req.body;
  try {
    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      })
    });
    const data = await geminiRes.json();
    const reply = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text;
    res.json({ reply: reply || 'Sorry, I could not generate a response.' });
  } catch (err) {
    res.json({ reply: 'Error contacting Gemini AI.' });
  }
});

app.set('view engine','ejs');
app.set('views' , 'views');
// Middleware configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(rootdir, 'Public')));

// Add this after your other middleware
app.use(cookieParser());

app.use(attachAuthLocals);


// Routes
app.use(userrouter);
app.use(hostrouter);

// 404 Error handler
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootdir, 'views', '404Error.html'));
});

const port = process.env.PORT || 3000;
mongoConnect(()=>{
app.listen(port, () => {
  console.log(`Server running at: http://localhost:${port}/home`);
});
});
