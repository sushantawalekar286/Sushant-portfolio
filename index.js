const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const Contact = require("./models/contact");
const Project = require("./models/project");
const Achievement = require("./models/achievement");
const TechCategory = require("./models/techstack");
const Extracurricular = require("./models/extracurricular");
const Visitor = require("./models/visitor");
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

// Visitor tracking middleware
app.use(async (req, res, next) => {
  try {
    // Only count unique visits (you can enhance this with IP tracking)
    if (req.path === '/' && !req.session.visited) {
      await Visitor.incrementCount();
      req.session.visited = true;
    }
    next();
  } catch (error) {
    console.error('Error tracking visitor:', error);
    next();
  }
});

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
          category: "Programming & Development",
          icon: "fas fa-code",
          items: [
            { name: "Java & Core Java", icon: "/images/java.jpg" },
            { name: "Python", icon: "/images/python.svg" },
            { name: "C & C++", icon: "/images/c.jpeg" },
            { name: "JavaScript", icon: "/images/js.svg" },
            { name: "HTML5, CSS3, Bootstrap", icon: "/images/html.svg" },
            { name: "PHP, SQL, MySQL", icon: "/images/php.svg" },
            { name: "Data Structures & Algorithms", icon: "/images/dsa.svg" },
            { name: "Competitive Programming", icon: "/images/cp.svg" },
            { name: "Version Control (Git)", icon: "/images/git.svg" }
          ]
        },
        {
          category: "Frameworks & Tools",
          icon: "fas fa-tools",
          items: [
            { name: "React.js", icon: "/images/react.svg" },
            { name: "Node.js & Express.js", icon: "/images/nodejs.svg" },
            { name: "Android (Java/XML)", icon: "/images/android.svg" },
            { name: "Bootstrap", icon: "/images/bootstrap.svg" },
            { name: "jQuery", icon: "/images/jquery.svg" },
            { name: "RESTful APIs", icon: "/images/api.svg" },
            { name: "Postman", icon: "/images/postman.svg" },
            { name: "VS Code", icon: "/images/vscode.svg" }
          ]
        },
        {
          category: "Core Technologies",
          icon: "fas fa-microchip",
          items: [
            { name: "MongoDB", icon: "/images/mongodb.svg" },
            { name: "MySQL", icon: "/images/mysql.svg" },
            { name: "PostgreSQL", icon: "/images/postgresql.svg" },
            { name: "Firebase", icon: "/images/firebase.svg" },
            { name: "AWS", icon: "/images/aws.svg" },
            { name: "Docker", icon: "/images/docker.svg" },
            { name: "Linux", icon: "/images/linux.svg" },
            { name: "Apache", icon: "/images/apache.svg" }
          ]
        },
        {
          category: "Professional Skills",
          icon: "fas fa-users",
          items: [
            { name: "Agile/Scrum", icon: "/images/agile.svg" },
            { name: "Team Leadership", icon: "/images/leadership.svg" },
            { name: "Problem Solving", icon: "/images/problem-solving.svg" },
            { name: "System Design", icon: "/images/system-design.svg" },
            { name: "Code Review", icon: "/images/code-review.svg" },
            { name: "Technical Writing", icon: "/images/technical-writing.svg" },
            { name: "Project Management", icon: "/images/project-management.svg" },
            { name: "Mentoring", icon: "/images/mentoring.svg" }
          ]
        }
      ];
      await TechCategory.insertMany(defaultTechCategories);
      console.log("Default tech categories initialized");
    }

    // Initialize visitor count if it doesn't exist
    const visitorCount = await Visitor.countDocuments();
    if (visitorCount === 0) {
      await Visitor.create({ count: 0 });
      console.log("Visitor count initialized");
    }
  } catch (error) {
    console.error("Error initializing default data:", error);
  }
}


// Routes
app.get('/', async (req, res) => {
  try {
    const projects = await Project.find().limit(3);
    const awards = await Achievement.find().limit(3);
    const techstack = await TechCategory.find();
    const visitorCount = await Visitor.getVisitorCount();
    res.render('home', { projects, awards, techstack, visitorCount: visitorCount.count });
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

app.get('/extracurricular', async (req, res) => {
  try {
    const activities = await Extracurricular.find().sort({ date: -1 });
    res.render('extracurricular', { activities });
  } catch (error) {
    console.error('Error loading extracurricular page:', error);
    res.status(500).send('Error loading extracurricular page');
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
    const activities = await Extracurricular.find();
    res.render('adminDashboard', { projects, awards, techstack, messages, activities });
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

// Extracurricular Activities CRUD
app.get('/admin/extracurricular/:id', requireAuth, async (req, res) => {
  try {
    const activity = await Extracurricular.findById(req.params.id);
    if (activity) {
      res.json(activity);
    } else {
      res.status(404).json({ success: false, message: 'Activity not found' });
    }
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ success: false, message: 'Error fetching activity' });
  }
});

app.post('/admin/extracurricular', requireAuth, async (req, res) => {
  const { title, description, category, date, image, role, duration, technologies, achievements } = req.body;
  
  try {
    await Extracurricular.create({
      title,
      description,
      category: category || 'Other',
      date: date || new Date().getFullYear().toString(),
      image: image || '/images/default-activity.jpg',
      role: role || 'Participant',
      duration: duration || 'Ongoing',
      technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
      achievements: achievements ? achievements.split(',').map(achievement => achievement.trim()) : []
    });
    res.json({ success: true, message: 'Activity added successfully' });
  } catch (err) {
    console.error('Error adding activity:', err);
    res.status(500).json({ success: false, message: 'Error adding activity' });
  }
});

app.put('/admin/extracurricular/:id', requireAuth, async (req, res) => {
  const { title, description, category, date, image, role, duration, technologies, achievements } = req.body;
  
  try {
    const activity = await Extracurricular.findByIdAndUpdate(req.params.id, {
      title,
      description,
      category: category || 'Other',
      date: date || new Date().getFullYear().toString(),
      image: image || '/images/default-activity.jpg',
      role: role || 'Participant',
      duration: duration || 'Ongoing',
      technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
      achievements: achievements ? achievements.split(',').map(achievement => achievement.trim()) : []
    }, { new: true });
    
    if (activity) {
      res.json({ success: true, message: 'Activity updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Activity not found' });
    }
  } catch (err) {
    console.error('Error updating activity:', err);
    res.status(500).json({ success: false, message: 'Error updating activity' });
  }
});

app.delete('/admin/extracurricular/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Extracurricular.findByIdAndDelete(id);
    if (result) {
      res.json({ success: true, message: 'Activity deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Activity not found' });
    }
  } catch (err) {
    console.error('Error deleting activity:', err);
    res.status(500).json({ success: false, message: 'Error deleting activity' });
  }
});

// About Section Management
app.post('/admin/about', requireAuth, async (req, res) => {
  try {
    // About section is read-only - show message in console
    console.log('About section is read-only. To modify the About section, please edit the views/about.ejs file directly.');
    res.json({ 
      success: false, 
      message: 'About section is read-only. To modify content, please edit the views/about.ejs file directly.' 
    });
  } catch (err) {
    console.error('Error with about section:', err);
    res.status(500).json({ success: false, message: 'About section is read-only' });
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

// Visitor count API endpoint
app.get('/api/visitor-count', async (req, res) => {
  try {
    const visitor = await Visitor.getVisitorCount();
    res.json({ count: visitor.count });
  } catch (error) {
    console.error('Error getting visitor count:', error);
    res.status(500).json({ error: 'Failed to get visitor count' });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});


