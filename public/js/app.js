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
    }, 2000); // Wait 1 second before restarting
  }
  }
  typeWriter();
// Add event listener for the "tech  stack table" button
  document.querySelectorAll('.tech-cat-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tech-cat-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      document.querySelectorAll('.tech-cat-content').forEach(c => c.style.display = 'none');
      document.getElementById(this.dataset.category).style.display = 'block';
    });
  });