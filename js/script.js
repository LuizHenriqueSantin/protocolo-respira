document.addEventListener('DOMContentLoaded', function () {

  /* Ano dinâmico no rodapé */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Accordion de FAQ ---------- */
  var triggers = document.querySelectorAll('.accordion__trigger');
  triggers.forEach(function (btn) {
    var panel = btn.nextElementSibling;
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // fecha os outros itens do mesmo acordeão
      var group = btn.closest('.accordion');
      group.querySelectorAll('.accordion__trigger').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Carrossel de depoimentos ---------- */
  var track = document.getElementById('testimonialTrack');
  if (track) {
    var carousel = track.closest('.testimonial-carousel');
    var slides = track.children;
    var total = slides.length;
    var dotsWrap = document.getElementById('testimonialDots');
    var dots = dotsWrap ? dotsWrap.querySelectorAll('.carousel-dot') : [];
    var prevBtn = document.querySelector('.carousel-btn--prev');
    var nextBtn = document.querySelector('.carousel-btn--next');
    var index = 0;
    var AUTOPLAY_MS = 5000;
    var autoplayTimer = null;
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var update = function () {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === index); });
    };
    var stopAutoplay = function () {
      if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
    };
    var startAutoplay = function () {
      if (prefersReducedMotion || total < 2) return;
      stopAutoplay();
      autoplayTimer = setInterval(function () { goTo(index + 1); }, AUTOPLAY_MS);
    };
    var goTo = function (i, fromUser) {
      index = (i + total) % total;
      update();
      if (fromUser) startAutoplay(); // reinicia a contagem após interação manual
    };

    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(index - 1, true); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(index + 1, true); });
    dots.forEach(function (dot, i) { dot.addEventListener('click', function () { goTo(i, true); }); });

    // pausa ao passar o mouse ou tocar, retoma ao sair
    if (carousel) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
    }

    // swipe no touch
    var startX = null;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; stopAutoplay(); }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) { startAutoplay(); return; }
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { goTo(dx > 0 ? index - 1 : index + 1); }
      startX = null;
      startAutoplay();
    }, { passive: true });

    update();
    startAutoplay();
  }

  /* ---------- Sticky CTA ao rolar além do hero ----------
     Fica visível o resto da página (inclusive sobre o rodapé) — o
     padding-bottom extra do .footer já garante que o texto do rodapé
     nunca fique escondido atrás dela. */
  var stickyCta = document.getElementById('stickyCta');
  var hero = document.querySelector('.hero');
  if (stickyCta && hero) {
    var toggleSticky = function () {
      var pastHero = hero.getBoundingClientRect().bottom < 0;
      stickyCta.classList.toggle('is-visible', pastHero);
    };
    window.addEventListener('scroll', toggleSticky, { passive: true });
    window.addEventListener('resize', toggleSticky);
    toggleSticky();
  }

  /* ---------- Reveal on scroll (progressive enhancement) ----------
     Conteúdo já é visível por padrão via CSS. Só ativamos a classe
     .js-reveal (que esconde antes de animar) se o IntersectionObserver
     existir — e sempre com uma rede de segurança que força tudo a
     aparecer caso algo falhe. */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    document.documentElement.classList.add('js-reveal');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });

    // Rede de segurança: nunca deixar nada preso invisível.
    var revealAll = function () {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    };
    window.addEventListener('beforeprint', revealAll);
    setTimeout(revealAll, 6000);
  }

});
