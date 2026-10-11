/* =========================================================
   JOVEMODERNO — main.js
   1. Utilitários
   2. WhatsApp
   3. Menu mobile
   4. Filtro do portfólio
   5. Header scrolled
   6. Scroll reveal
   7. Voltar ao topo
   8. Código digitado (hero)
   9. Ano no rodapé
   10. Quiz (FUTURISMO)
   11. Calculadora (TopPrint)
   ========================================================= */

/* ---------- 1. Utilitários ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 2. WhatsApp ---------- */
const WHATS = '5575999120261';
const wa = (msg) =>
  `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;

$$('[data-wa]').forEach((a) => {
  a.href = wa(
    a.dataset.wa ||
    'Olá! Vim pelo site da JOVEMODERNO e gostaria de pedir um orçamento.'
  );
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
});

/* ---------- 3. Menu mobile ---------- */
const burger = $('.burger');
const menu   = $('#menu-principal') || $('.nav ul'); // fallback

if (burger && menu) {
  const closeMenu = () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });

  // Fecha ao clicar em um link
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeMenu();
  });

  // Fecha com Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
      burger.focus();
    }
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (!menu.classList.contains('open')) return;
    if (!menu.contains(e.target) && !burger.contains(e.target)) closeMenu();
  });
}

/* ---------- 4. Filtro do portfólio ---------- */
const tabs       = $$('.tab');
const cards      = $$('.card[data-cat]');
const emptyState = $('.empty-state');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) =>
      t.setAttribute('aria-selected', String(t === tab))
    );

    const filter = tab.dataset.filter;
    let visible = 0;

    cards.forEach((card) => {
      const match = filter === 'todos' || card.dataset.cat === filter;
      card.hidden = !match;
      if (match) visible++;
    });

    if (emptyState) emptyState.hidden = visible > 0;
  });
});

/* ---------- 5. Header scrolled ---------- */
const header = $('header');
let headerTick = false;

const updateHeader = () => {
  header?.classList.toggle('scrolled', window.scrollY > 12);
  headerTick = false;
};

if (header) {
  updateHeader();
  window.addEventListener(
    'scroll',
    () => {
      if (!headerTick) {
        headerTick = true;
        requestAnimationFrame(updateHeader);
      }
    },
    { passive: true }
  );
}

/* ---------- 6. Scroll reveal ---------- */
const revealEls = $$('.reveal');

if (revealEls.length) {
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 60}ms`;
      io.observe(el);
    });
  }
}

/* ---------- 7. Voltar ao topo ---------- */
const toTop = $('.to-top');

if (toTop) {
  let topTick = false;

  const updateTopBtn = () => {
    toTop.hidden = window.scrollY < 400;
    topTick = false;
  };

  updateTopBtn();
  window.addEventListener(
    'scroll',
    () => {
      if (!topTick) {
        topTick = true;
        requestAnimationFrame(updateTopBtn);
      }
    },
    { passive: true }
  );

  toTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  });
}

/* ---------- 8. Código digitado no hero ---------- */
const out = $('#typed');

if (out) {
  const html = `<span class="c">// sua ideia, em produção</span>
<span class="k">const</span> projeto = {
  cliente: <span class="s">"você"</span>,
  entrega: [<span class="s">"site"</span>, <span class="s">"sistema"</span>, <span class="s">"dados"</span>],
  base: <span class="s">"Brasília, DF"</span>,
  atende: <span class="s">"todo o Brasil"</span>
};

<span class="k">await</span> jovemoderno.<span class="k">desenvolver</span>(projeto);
<span class="c">// pronto para usar ✓</span>`;

  const render = (i, withCaret = true) => {
    out.innerHTML =
      html.slice(0, i) + (withCaret ? '<span class="caret"></span>' : '');
  };

  if (prefersReducedMotion()) {
    out.innerHTML = html;
  } else {
    let i = 0;

    const tick = () => {
      // pula o interior de tags HTML de uma vez (nunca corta no meio)
      if (html[i] === '<') {
        const close = html.indexOf('>', i);
        if (close !== -1) i = close + 1;
        else i++;
      } else {
        i++;
      }

      render(i);

      if (i < html.length) {
        setTimeout(tick, 22);
      } else {
        render(html.length, false); // remove o caret no final
      }
    };

    tick();
  }
}

/* ---------- 9. Ano no rodapé ---------- */
$$('.year').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* ---------- 10. Quiz (FUTURISMO) ---------- */
$$('.quiz [data-ok]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const group = btn.parentElement;
    if (!group) return;

    group.querySelectorAll('button').forEach((b) =>
      b.classList.remove('certo', 'errado')
    );

    btn.classList.add(btn.dataset.ok === '1' ? 'certo' : 'errado');
  });
});

/* ---------- 11. Calculadora (TopPrint) ---------- */
const calc = $('#calc');

if (calc) {
  const preco = { cartao: 0.35, folder: 0.9, banner: 38 };
  const select = calc.querySelector('select');
  const input  = calc.querySelector('input');
  const output = calc.querySelector('output');

  const upd = () => {
    const t = select?.value ?? 'cartao';
    const q = Math.max(1, Number(input?.value) || 1);
    const total = (preco[t] ?? 0) * q;

    if (output) {
      output.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }
  };

  calc.addEventListener('input', upd);
  upd();
}