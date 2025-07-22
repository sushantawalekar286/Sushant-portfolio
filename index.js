const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb://127.0.0.1:27017/portfolioDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));


// Routes
app.get('/', (req, res) => {
  const projects = [
    { title: "InstaClone", tech: "Node, EJS, MongoDB", link: "https://github.com/..." },
    { title: "Weather App", tech: "Node, API, Bootstrap", link: "https://github.com/..." }
  ];
  res.render('home',{ projects });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/projects', (req, res) => {
  
  res.render('projects');
});


const Contact = require("./models/contact");

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  try {
    await Contact.create({ name, email, message });
    res.send("Thanks for your message! ✅");
  } catch (err) {
    res.status(500).send("Error saving message ❌");
  }
});
app.get("/admin/message", async (req, res) => {
  const messages = await Contact.find().sort({ date: -1 });
  res.render("adminMessage", { messages });
});


app.get('/contact', (req, res) => {
  res.render('contact');
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


