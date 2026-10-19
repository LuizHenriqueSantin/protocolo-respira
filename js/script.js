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
