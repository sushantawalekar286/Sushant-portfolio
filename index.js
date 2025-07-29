const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Contact = require("./models/contact");
const Project = require("./models/project");
const Achievement = require("./models/achievement");
const TechCategory = require("./models/techstack");
const session = require('express-session');
const admin=require("./models/admin")

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session configuration
app.use(session({
  secret: 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

mongoose.connect("mongodb://127.0.0.1:27017/portfolioDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

// Admin credentials (in production, use environment variables)


// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// Initialize default data if database is empty
async function initializeDefaultData() {
  try {
    // Check if projects exist
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const defaultProjects = [
        {
          title: "Portfolio Website",
          description: "A modern portfolio website built with Node.js, Express, and EJS",
          skills: "Node.js, Express, EJS, MongoDB",
          category: "Web Development",
          link: "https://github.com/yourusername/portfolio",
          image: "/images/portfolio.jpg"
        },
        {
          title: "E-Commerce Platform",
          description: "Full-stack e-commerce platform with payment integration",
          skills: "React, Node.js, MongoDB, Stripe",
          category: "Web Application",
          link: "https://github.com/yourusername/ecommerce",
          image: "/images/ecommerce.jpg"
        }
      ];
      await Project.insertMany(defaultProjects);
      console.log("Default projects initialized");
    }

    // Check if achievements exist
    const achievementCount = await Achievement.countDocuments();
    if (achievementCount === 0) {
      const defaultAchievements = [
        {
          title: "Best Web Developer",
          event: "Tech Competition 2024",
          description: "Won first place in the annual web development competition",
          category: "Competition",
          date: "2024",
          image: "/images/award1.jpg"
        },
        {
          title: "Machine Learning Certification",
          event: "Coursera",
          description: "Completed advanced machine learning specialization",
          category: "Certification",
          date: "2024",
          image: "/images/cert1.jpg"
        }
      ];
      await Achievement.insertMany(defaultAchievements);
      console.log("Default achievements initialized");
    }

    // Check if tech categories exist
    const techCount = await TechCategory.countDocuments();
    if (techCount === 0) {
      const defaultTechCategories = [
        {
          category: "Frontend",
          icon: "💻",
          items: [
            { name: "HTML5", icon: "/images/html.svg" },
            { name: "CSS3", icon: "/images/css.svg" },
            { name: "JavaScript", icon: "/images/js.svg" },
            { name: "React", icon: "/images/react.svg" }
          ]
        },
        {
          category: "Backend",
          icon: "⚙️",
          items: [
            { name: "Node.js", icon: "/images/nodejs.svg" },
            { name: "Express.js", icon: "/images/express.svg" },
            { name: "Python", icon: "/images/python.svg" },
            { name: "Java", icon: "/images/java.svg" }
          ]
        },
        {
          category: "Database",
          icon: "🗄️",
          items: [
            { name: "MongoDB", icon: "/images/mongodb.svg" },
            { name: "MySQL", icon: "/images/mysql.svg" },
            { name: "PostgreSQL", icon: "/images/postgresql.svg" }
          ]
        }
      ];
      await TechCategory.insertMany(defaultTechCategories);
      console.log("Default tech categories initialized");
    }
  } catch (error) {
    console.error("Error initializing default data:", error);
  }
}

// Initialize default data when server starts
initializeDefaultData();

// Routes
app.get('/', async (req, res) => {
  try {
    const projects = await Project.find().limit(3);
    const awards = await Achievement.find().limit(3);
    const techstack = await TechCategory.find();
    res.render('home', { projects, awards, techstack });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).send('Error loading home page');
  }
});

app.get('/about', async (req, res) => {
  try {
    const techstack = await TechCategory.find();
    res.render('about', { techstack });
  } catch (error) {
    console.error('Error loading about page:', error);
    res.status(500).send('Error loading about page');
  }
});

app.get('/full_tech_stack', async (req, res) => {
  try {
    const techstack = await TechCategory.find();
    res.render('full_tech_stack', { techstack });
  } catch (error) {
    console.error('Error loading full tech stack page:', error);
    res.status(500).send('Error loading full tech stack page');
  }
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.render('projects', { projects });
  } catch (error) {
    console.error('Error loading projects page:', error);
    res.status(500).send('Error loading projects page');
  }
});

app.get('/full-achievement', async (req, res) => {
  try {
    const awards = await Achievement.find();
    res.render('full_achievement', { awards });
  } catch (error) {
    console.error('Error loading achievements page:', error);
    res.status(500).send('Error loading achievements page');
  }
});

// Admin Routes
app.get('/admin/login', (req, res) => {
  if (req.session.isAuthenticated) {
    res.redirect('/admin/dashboard');
  } else {
    res.render('adminLogin', { error: req.query.error });
  }
});

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === admin.username && password === admin.password) {
    req.session.isAuthenticated = true;
    res.redirect('/admin/dashboard');
  } else {
    res.redirect('/admin/login?error=Invalid credentials');
  }
});

app.get('/admin/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

app.get('/admin/dashboard', requireAuth, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    const projects = await Project.find();
    const awards = await Achievement.find();
    const techstack = await TechCategory.find();
    res.render('adminDashboard', { projects, awards, techstack, messages });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
});

// Projects CRUD
app.get('/admin/projects/:id', requireAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, message: 'Error fetching project' });
  }
});

app.post('/admin/projects', requireAuth, async (req, res) => {
  const { title, description, skills, category, link, image } = req.body;
  
  try {
    await Project.create({
      title,
      description,
      skills,
      category: category || 'General',
      link: link || '#',
      image: image || '/images/default-project.jpg'
    });
    res.json({ success: true, message: 'Project added successfully' });
  } catch (err) {
    console.error('Error adding project:', err);
    res.status(500).json({ success: false, message: 'Error adding project' });
  }
});

app.put('/admin/projects/:id', requireAuth, async (req, res) => {
  const { title, description, skills, category, link, image } = req.body;
  
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, {
      title,
      description,
      skills,
      category: category || 'General',
      link: link || '#',
      image: image || '/images/default-project.jpg'
    }, { new: true });
    
    if (project) {
      res.json({ success: true, message: 'Project updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ success: false, message: 'Error updating project' });
  }
});

app.delete('/admin/projects/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Project.findByIdAndDelete(id);
    if (result) {
      res.json({ success: true, message: 'Project deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Project not found' });
    }
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ success: false, message: 'Error deleting project' });
  }
});

// Achievements CRUD
app.get('/admin/achievements/:id', requireAuth, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (achievement) {
      res.json(achievement);
    } else {
      res.status(404).json({ success: false, message: 'Achievement not found' });
    }
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({ success: false, message: 'Error fetching achievement' });
  }
});

app.post('/admin/achievements', requireAuth, async (req, res) => {
  const { title, event, description, category, date, image } = req.body;
  
  try {
    await Achievement.create({
      title,
      event,
      description,
      category: category || 'General',
      date: date || new Date().getFullYear().toString(),
      image: image || '/images/default-award.jpg'
    });
    res.json({ success: true, message: 'Achievement added successfully' });
  } catch (err) {
    console.error('Error adding achievement:', err);
    res.status(500).json({ success: false, message: 'Error adding achievement' });
  }
});

app.put('/admin/achievements/:id', requireAuth, async (req, res) => {
  const { title, event, description, category, date, image } = req.body;
  
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, {
      title,
      event,
      description,
      category: category || 'General',
      date: date || new Date().getFullYear().toString(),
      image: image || '/images/default-award.jpg'
    }, { new: true });
    
    if (achievement) {
      res.json({ success: true, message: 'Achievement updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Achievement not found' });
    }
  } catch (err) {
    console.error('Error updating achievement:', err);
    res.status(500).json({ success: false, message: 'Error updating achievement' });
  }
});

app.delete('/admin/achievements/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Achievement.findByIdAndDelete(id);
    if (result) {
      res.json({ success: true, message: 'Achievement deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Achievement not found' });
    }
  } catch (err) {
    console.error('Error deleting achievement:', err);
    res.status(500).json({ success: false, message: 'Error deleting achievement' });
  }
});

// Tech Stack CRUD
app.get('/admin/tech-categories/:id', requireAuth, async (req, res) => {
  try {
    const category = await TechCategory.findById(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ success: false, message: 'Tech category not found' });
    }
  } catch (error) {
    console.error('Error fetching tech category:', error);
    res.status(500).json({ success: false, message: 'Error fetching tech category' });
  }
});

app.post('/admin/tech-categories', requireAuth, async (req, res) => {
  const { category, icon, items } = req.body;
  
  try {
    await TechCategory.create({
      category,
      icon: icon || '🛠️',
      items: items ? items.split(',').map(item => ({ name: item.trim(), icon: '/images/default-tech.svg' })) : []
    });
    res.json({ success: true, message: 'Tech category added successfully' });
  } catch (err) {
    console.error('Error adding tech category:', err);
    res.status(500).json({ success: false, message: 'Error adding tech category' });
  }
});

app.put('/admin/tech-categories/:id', requireAuth, async (req, res) => {
  const { category, icon, items } = req.body;
  
  try {
    const techCategory = await TechCategory.findByIdAndUpdate(req.params.id, {
      category,
      icon: icon || '🛠️',
      items: items ? items.split(',').map(item => ({ name: item.trim(), icon: '/images/default-tech.svg' })) : []
    }, { new: true });
    
    if (techCategory) {
      res.json({ success: true, message: 'Tech category updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Tech category not found' });
    }
  } catch (err) {
    console.error('Error updating tech category:', err);
    res.status(500).json({ success: false, message: 'Error updating tech category' });
  }
});

app.delete('/admin/tech-categories/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await TechCategory.findByIdAndDelete(id);
    if (result) {
      res.json({ success: true, message: 'Tech category deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Tech category not found' });
    }
  } catch (err) {
    console.error('Error deleting tech category:', err);
    res.status(500).json({ success: false, message: 'Error deleting tech category' });
  }
});

app.delete('/admin/tech-items/:catId/:itemId', requireAuth, async (req, res) => {
  const catId = req.params.catId;
  const itemId = parseInt(req.params.itemId);
  
  try {
    const category = await TechCategory.findById(catId);
    if (category) {
      if (itemId >= 0 && itemId < category.items.length) {
        category.items.splice(itemId, 1);
        await category.save();
        res.json({ success: true, message: 'Tech item removed successfully' });
      } else {
        res.status(404).json({ success: false, message: 'Tech item not found' });
      }
    } else {
      res.status(404).json({ success: false, message: 'Tech category not found' });
    }
  } catch (err) {
    console.error('Error removing tech item:', err);
    res.status(500).json({ success: false, message: 'Error removing tech item' });
  }
});

// About Section Management
app.post('/admin/about', requireAuth, async (req, res) => {
  const { name, title, institution, description, skills } = req.body;
  
  try {
    // For now, we'll just return success since we're not storing about data in DB yet
    // In a real application, you would save this to a database
    console.log('About section updated:', { name, title, institution, description, skills });
    res.json({ success: true, message: 'About section updated successfully' });
  } catch (err) {
    console.error('Error updating about section:', err);
    res.status(500).json({ success: false, message: 'Error updating about section' });
  }
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


