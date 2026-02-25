document.addEventListener('DOMContentLoaded', function() {
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.style.background = 'rgba(0, 0, 0, 0.9)';
    } else {
      header.style.background = 'rgba(0, 0, 0, 0.8)';
    }
  });

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  const selectors = [
    '.projects-grid .project-card',
    '.about-grid .card',
    '#posts-container .card'
  ];
  
  document.querySelectorAll(selectors.join(', ')).forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });



  document.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#') || href === '') {
        e.preventDefault();
        if (href === '#') {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    });
  });

  const typingText = document.getElementById('typing-text');
  if (typingText) {
    const roles = [
      ' Creative Designer.',
      ' Problem Solver.',
      ' Tech Enthusiast.',
      ' Artificial Intelligence Lover.'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingSpeed = 1500;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  function typeSubtitle(elementId, text) {
    const el = document.getElementById(elementId);
    if (!el) return;

    let charIndex = 0;
    const typingSpeed = 40;

    function type() {
      if (charIndex < text.length) {
        el.textContent = text.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(type, typingSpeed);
      }
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          type();
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    sectionObserver.observe(el.closest('section'));
  }

  typeSubtitle('sub-about', '// About Me');
  typeSubtitle('sub-skills', '// My Skills');
  typeSubtitle('sub-projects', '// Featured Projects');

  function addCardGlowEffect() {
    const cards = document.querySelectorAll('.card, .project-card, .skill-item');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });
  }

  addCardGlowEffect();

  function typeBlogTitle() {
    const heroTitleText = document.querySelector('.hero-title-text');
    if (!heroTitleText) return;

    const fullText = heroTitleText.textContent.trim();
    heroTitleText.textContent = '';
    let charIndex = 0;
    const typingSpeed = 40;

    function type() {
      if (charIndex < fullText.length) {
        heroTitleText.textContent = fullText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(type, typingSpeed);
      }
    }

    setTimeout(type, 300);
  }

  typeBlogTitle();
});
