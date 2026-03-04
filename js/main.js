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

  class Typewriter {
    constructor(element, options = {}) {
      this.element = element;
      this.texts = Array.isArray(options.texts) ? options.texts : (options.text ? [options.text] : []);
      this.currentTextIndex = 0;
      this.typingSpeed = options.typingSpeed || 100;
      this.deletingSpeed = options.deletingSpeed || 50;
      this.deleteDelay = options.deleteDelay || 1500;
      this.typeDelay = options.typeDelay || 500;
      this.loop = options.loop || false;
      this.onStart = options.onStart || (() => {});
      this.onComplete = options.onComplete || (() => {});
      
      this.charIndex = 0;
      this.isDeleting = false;
      this.isTyping = false;
    }

    start() {
      if (this.isTyping || this.texts.length === 0) return;
      this.isTyping = true;
      this.onStart();
      this.type();
    }

    stop() {
      this.isTyping = false;
    }

    type() {
      if (!this.isTyping || !this.element) return;

      const currentText = this.texts[this.currentTextIndex];
      const displayText = this.isDeleting 
        ? currentText.substring(0, this.charIndex - 1)
        : currentText.substring(0, this.charIndex + 1);
      
      this.element.textContent = displayText;
      this.charIndex = this.isDeleting ? this.charIndex - 1 : this.charIndex + 1;

      let speed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

      if (!this.isDeleting && this.charIndex === currentText.length) {
        if (this.loop) {
          speed = this.deleteDelay;
          this.isDeleting = true;
        } else {
          this.isTyping = false;
          this.onComplete();
          return;
        }
      } else if (this.isDeleting && this.charIndex === 0) {
        this.isDeleting = false;
        this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        speed = this.typeDelay;
      }

      setTimeout(() => this.type(), speed);
    }
  }

  const typingText = document.getElementById('typing-text');
  if (typingText) {
    const roles = [
      ' Creative Designer.',
      ' Problem Solver.',
      ' Tech Enthusiast.',
      ' Artificial Intelligence Lover.'
    ];
    
    const typewriter = new Typewriter(typingText, {
      texts: roles,
      typingSpeed: 100,
      deletingSpeed: 50,
      deleteDelay: 1500,
      typeDelay: 500,
      loop: true
    });
    typewriter.start();
  }

  function typeSubtitle(elementId, text) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const typewriter = new Typewriter(el, {
            text: text,
            typingSpeed: 40,
            loop: false
          });
          typewriter.start();
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

    setTimeout(() => {
      const typewriter = new Typewriter(heroTitleText, {
        text: fullText,
        typingSpeed: 40,
        loop: false
      });
      typewriter.start();
    }, 300);
  }

  typeBlogTitle();
});
