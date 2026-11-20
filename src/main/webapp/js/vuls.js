const express = require('express');
const { exec } = require('child_process');
const app = express();

// 1. Hardcoded Secret
const API_SECRET_KEY = "sk_live_51M8xYz9900aBcDeFgHiJkLmNoPqRsTuVwXyZ";

// 2. Reflected Cross-Site Scripting (XSS)
app.get('/welcome', (req, res) => {
  const username = req.query.user || 'Guest';
  // Vulnerable: Unsanitized user input is reflected directly into the HTML response
  res.send(`<h1>Welcome back, ${username}!</h1>`);
});

// 3. OS Command Injection
app.get('/ping', (req, res) => {
  const targetHost = req.query.host;
  // Vulnerable: User input is concatenated directly into a shell command
  exec(`ping -c 1 ${targetHost}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).send(`Error: ${stderr}`);
    }
    res.send(`<pre>${stdout}</pre>`);
  });
});

// 4. Arbitrary Code Execution via eval()
app.get('/calculate', (req, res) => {
  const mathExpression = req.query.expr;
  // Vulnerable: eval() executes arbitrary JavaScript passed in the query string
  const result = eval(mathExpression);
  res.send(`Result: ${result}`);
});

app.listen(3000, () => console.log('Test server running on port 3000'));
