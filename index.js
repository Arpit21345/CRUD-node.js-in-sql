const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const pool = require('./mongo.js'); // Change the require statement

const app = express();

const port = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "/login.html"));
});


app.post('/register', async (req, res) => {
  try {
    const newUser = [
      req.body.username,
      req.body.email,
      req.body.password,
    ];

    const [result] = await pool.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', newUser);
    console.log('User registered successfully:', result);
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during registration');
  }
});

app.post('/login', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? AND password = ?', [req.body.email, req.body.password]);
    
    if (rows.length > 0) {
      res.redirect('/home');
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during login');
  }
});
app.get("/changepassword", (req, res) => {
  res.sendFile(path.join(__dirname, "/changepassword.html"));
});


app.post('/changepassword', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ? AND password = ?', [req.body.email, req.body.password]);

    if (rows.length > 0) {
      await pool.execute('UPDATE users SET password = ? WHERE email = ?', [req.body.newPassword, req.body.email]);
      res.redirect('/login');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during password change');
  }
});

app.get("/delete", (req, res) => {
  res.sendFile(path.join(__dirname, "/delete.html"));
});

app.post('/delete', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? AND email = ? AND password = ?', [req.body.username, req.body.email, req.body.password]);

    if (rows.length > 0) {
      await pool.execute('DELETE FROM users WHERE id = ?', [rows[0].id]);
      res.redirect('/');
    } else {
      res.redirect('/delete');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error during account deletion');
  }
});
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/home.html"));
});


app.listen(port, () => {
  console.log(`Server on port: http://localhost:${port}`);
});
