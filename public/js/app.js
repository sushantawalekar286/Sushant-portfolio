const text = "Full Stack Developer | Node.js | MongoDB | C++";
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

// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');

  // Toggle mobile menu
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.contains('active');
      
      if (isOpen) {
        // Close menu
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      } else {
        // Open menu
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
      }
    });
  }

  // Close mobile menu when clicking overlay
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  }

  // Close mobile menu when clicking on a link
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  // Close mobile menu on window resize (if screen becomes larger)
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      mobileMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
});

// Enhanced Navigation Function
function handleNavigation(href) {
  const currentPath = window.location.pathname;
  
  // If we're on the home page, scroll to section
  if (currentPath === '/') {
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  } else {
    // If we're on another page, navigate to home page with hash
    window.location.href = '/' + href;
  }
}

// Handle all navigation links (both desktop and mobile)
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href^="#"]');
  if (link) {
    e.preventDefault();
    handleNavigation(link.getAttribute('href'));
  }
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
    const mobileNavLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    // Update desktop navigation
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Update mobile navigation
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });

    // Handle home link active state when at top of page
    const homeLink = document.querySelector('a[href="/"]');
    const mobileHomeLink = document.querySelector('.mobile-menu a[href="/"]');
    if (homeLink && window.scrollY < 200) {
      homeLink.classList.add('active');
      if (mobileHomeLink) mobileHomeLink.classList.add('active');
    } else if (homeLink) {
      homeLink.classList.remove('active');
      if (mobileHomeLink) mobileHomeLink.classList.remove('active');
    }
  }
});

// Set initial active state based on current page
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar a');
  const mobileNavLinks = document.querySelectorAll('.mobile-menu a');
  
  // Clear all active states first
  navLinks.forEach(link => {
    link.classList.remove('active');
  });
  mobileNavLinks.forEach(link => {
    link.classList.remove('active');
  });
  
  // Set active state based on current page
  if (currentPath === '/projects') {
    // On projects page, highlight the projects link
    const projectsLink = document.querySelector('a[href="#projects-preview"]');
    const mobileProjectsLink = document.querySelector('.mobile-menu a[href="#projects-preview"]');
    if (projectsLink) {
      projectsLink.classList.add('active');
    }
    if (mobileProjectsLink) {
      mobileProjectsLink.classList.add('active');
    }
  } else if (currentPath === '/full_tech_stack') {
    // On full tech stack page, highlight the tech stack link
    const techStackLink = document.querySelector('a[href="#techstack"]');
    const mobileTechStackLink = document.querySelector('.mobile-menu a[href="#techstack"]');
    if (techStackLink) {
      techStackLink.classList.add('active');
    }
    if (mobileTechStackLink) {
      mobileTechStackLink.classList.add('active');
    }
  } else if (currentPath === '/full-achievement') {
    // On full achievement page, highlight the awards link
    const awardsLink = document.querySelector('a[href="#awards"]');
    const mobileAwardsLink = document.querySelector('.mobile-menu a[href="#awards"]');
    if (awardsLink) {
      awardsLink.classList.add('active');
    }
    if (mobileAwardsLink) {
      mobileAwardsLink.classList.add('active');
    }
  } else if (currentPath === '/about') {
    // On about page, highlight the about link
    const aboutLink = document.querySelector('a[href="#about"]');
    const mobileAboutLink = document.querySelector('.mobile-menu a[href="#about"]');
    if (aboutLink) {
      aboutLink.classList.add('active');
    }
    if (mobileAboutLink) {
      mobileAboutLink.classList.add('active');
    }
  } else if (currentPath === '/contact') {
    // On contact page, highlight the contact link
    const contactLink = document.querySelector('a[href="#connect"]');
    const mobileContactLink = document.querySelector('.mobile-menu a[href="#connect"]');
    if (contactLink) {
      contactLink.classList.add('active');
    }
    if (mobileContactLink) {
      mobileContactLink.classList.add('active');
    }
  } else if (currentPath === '/extracurricular') {
    // On extracurricular page, highlight the activities link
    const activitiesLink = document.querySelector('a[href="/extracurricular"]');
    const mobileActivitiesLink = document.querySelector('.mobile-menu a[href="/extracurricular"]');
    if (activitiesLink) {
      activitiesLink.classList.add('active');
    }
    if (mobileActivitiesLink) {
      mobileActivitiesLink.classList.add('active');
    }
  } else if (currentPath === '/') {
    // On home page, trigger scroll event to set initial active state
    window.dispatchEvent(new Event('scroll'));
  }
  
  // Handle hash navigation on page load
  if (window.location.hash) {
    setTimeout(() => {
      const targetId = window.location.hash.replace('#', '');
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }
});

// Visitor Counter Real-time Updates
function updateVisitorCount() {
  fetch('/api/visitor-count')
    .then(response => response.json())
    .then(data => {
      const countDisplay = document.querySelector('.count-display');
      if (countDisplay && data.count !== undefined) {
        const currentCount = parseInt(countDisplay.textContent);
        if (data.count > currentCount) {
          // Add animation for new visitors
          countDisplay.classList.add('updating');
          setTimeout(() => {
            countDisplay.textContent = data.count;
            countDisplay.classList.remove('updating');
          }, 250);
        } else {
          countDisplay.textContent = data.count;
        }
      }
    })
    .catch(error => {
      console.error('Error updating visitor count:', error);
    });
}

// Update visitor count every 30 seconds
setInterval(updateVisitorCount, 1000);

// Update visitor count on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initial update after 2 seconds
  setTimeout(updateVisitorCount, 1000);
});

// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});