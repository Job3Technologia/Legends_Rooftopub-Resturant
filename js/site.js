document.addEventListener('DOMContentLoaded', function(){
  const loading = document.getElementById('loadingScreen');
  const bar = loading ? loading.querySelector('.progress-bar') : null;
  if (loading && bar) {
    let p = 0;
    const tick = setInterval(()=>{ p = Math.min(90, p + 4); bar.style.width = p+'%'; }, 80);
    window.addEventListener('load', function(){ clearInterval(tick); bar.style.width = '100%'; setTimeout(()=> loading.classList.add('hidden'), 300); });
  }

  const cartCountEl = document.getElementById('cart-count');
  const updateCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('legendsCart')||'[]');
      const total = cart.reduce((t,i)=>t+(i.quantity||0),0);
      if (cartCountEl) cartCountEl.textContent = total;
    } catch(_) {}
  };
  updateCount();
  window.addEventListener('storage', (e) => { if (e.key==='legendsCart') updateCount(); });

  // Mobile navigation: hamburger toggle and close-on-link
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      // Mobile behavior: tap hamburger scrolls to Quick Links at bottom
      if (window.innerWidth <= 768) {
        const quickLinks = document.getElementById('quick-links');
        if (quickLinks) {
          const top = quickLinks.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top, behavior: 'smooth' });
          // Ensure menu stays closed in this mode
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          return;
        }
      }
      // Default: toggle nav
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Navbar shadow on scroll for better mobile perception
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 100) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
});