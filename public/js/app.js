const text = "Full Stack Developer | Node.js | MongoDB | React";
const typingElement = document.getElementById("typing-text");
typingElement.textContent = "";
let i = 0;

function typeWriter() {
  if (i < text.length) {
    typingElement.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 70); // Adjust speed here
  } else {
    setTimeout(() => {
      typingElement.textContent = "";
      i = 0;
      typeWriter();
    }, 2000); // Wait 2 seconds before restarting
  }
}

// Start typing animation
if (typingElement) {
  typeWriter();
}

// Smooth scrolling for navigation links (only on home page)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Handle home link - scroll to top if on home page, navigate if on other pages
document.querySelectorAll('a[href="/"]').forEach(link => {
  link.addEventListener('click', function (e) {
    // If we're already on the home page, scroll to top instead of navigating
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    // If on other pages, let the link work normally to navigate to home page
  });
});

// Add event listener for the "tech stack table" button
document.querySelectorAll('.tech-cat-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tech-cat-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.tech-cat-content').forEach(c => c.style.display = 'none');
    const targetCategory = document.getElementById(this.dataset.category);
    if (targetCategory) {
      targetCategory.style.display = 'block';
    }
  });
});

// Add active class to navigation links based on scroll position (only on home page)
window.addEventListener('scroll', () => {
  // Only run this on the home page
  if (window.location.pathname === '/') {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Handle home link active state when at top of page
    const homeLink = document.querySelector('a[href="/"]');
    if (homeLink && window.scrollY < 200) {
      homeLink.classList.add('active');
    } else if (homeLink) {
      homeLink.classList.remove('active');
    }
  }
});

// Set initial active state based on current page
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar a');
  
  // Clear all active states first
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Set active state based on current page
  if (currentPath === '/projects') {
    // On projects page, highlight the projects link
    const projectsLink = document.querySelector('a[href="#projects-preview"]');
    if (projectsLink) {
      projectsLink.classList.add('active');
    }
  } else if (currentPath === '/') {
    // On home page, trigger scroll event to set initial active state
    window.dispatchEvent(new Event('scroll'));
  }
});