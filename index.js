const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Contact = require("./models/contact");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb://127.0.0.1:27017/portfolioDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));


// Routes

const projects = [
  { title: "Math Solver", tech: "Python", link: "https://github.com/yourname/mathsolver" },
  { title: "Portfolio", tech: "Node.js, EJS", link: "https://github.com/yourname/portfolio" }
];

const awards = [
  "1st Prize – Project Presentation (Jidnyasa, TKIET)",
  "2nd Prize – Paper Presentation (Ureka, TKIET)",
  "3rd Prize – Digitech (NIT Kolhapur)",
  "3rd Prize – CodeDusk (MCA Dept, TKIET)"
];

const techstack = [
  {
    category: "Languages",
    icon: "🖥️",
    items: [
      { name: "Python", icon: "/images/python.svg" },
      { name: "Java", icon: "/images/java.jpg" },
      { name: "JavaScript", icon: "/images/js.svg" },
      { name: "HTML", icon: "/images/html5.svg" },
      { name: "CSS", icon: "/images/css3.svg" },
      { name: "C", icon: "/images/c.svg" },
      { name: "C++", icon: "/images/cpp.svg" },
      { name: "PHP", icon: "/images/php.svg" }
    ]
  },
  {
    category: "Frameworks & Libraries",
    icon: "🛠️",
    items: [
      { name: "Flask", icon: "/images/flask.svg" },
      { name: "OpenCV", icon: "/images/opencv.svg" },
      { name: "React", icon: "/images/react.svg" },
      { name: "NumPy", icon: "/images/numpy.svg" },
      { name: "Pandas", icon: "/images/pandas.svg" },
      { name: "Scikit-learn", icon: "/images/scikit-learn.svg" },
      { name: "Tailwind CSS", icon: "/images/tailwind.svg" },
      { name: "Bootstrap", icon: "/images/bootstrap.svg" }
    ]
  }
  // Add more categories as needed
];





app.get('/', (req, res) => {
  res.render('home', { projects, awards, techstack });
});

app.get('/full-tech-stack', (req, res) => {
  res.render('full_tech_stack', { techstack });
});



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


