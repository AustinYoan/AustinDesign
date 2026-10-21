// Shared page interactions: smooth wheel scrolling, header shadow and scroll-triggered reveals.
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Inertia scrolling for mouse wheels (Lenis, loaded from the CDN before this file).
    // Touch scrolling stays native.
    let lenis = null;
    if (window.Lenis && !reduceMotion) {
        lenis = new window.Lenis({ lerp: 0.09 });
        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    }

    // In-page anchor links glide to their target below the fixed header
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        const id = link.getAttribute('href');
        if (id.length < 2) return;
        link.addEventListener('click', (event) => {
            const target = document.querySelector(id);
            if (!target || !lenis) return;
            event.preventDefault();
            lenis.scrollTo(target, { offset: -80, duration: 1.2 });
            history.replaceState(null, '', id);
        });
    });

    const header = document.querySelector('.site-header');
    if (header) {
        const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
        update();
        window.addEventListener('scroll', update, { passive: true });
    }

    if (reduceMotion || !('IntersectionObserver' in window)) {
        return;
    }

    // Which elements reveal and where they come from. The hero animates on load instead.
    const rules = [
        ['.sec-head', 'left'],
        ['.disciplines > *, .situations > *, .plans > *, .tiers > *, .cases > *, .trust-grid > *, .levels > *, .notes > *, .timeline > *, .checklist > *', 'up'],
        ['.closing > :first-child, .cta-row > :first-child, .standby > :first-child', 'left'],
        ['.closing > :last-child, .cta-row > :last-child, .standby > :last-child', 'right'],
        ['.standby-strip, .individual-strip, .compare, .more-row', 'up'],
    ];

    const targets = [];
    rules.forEach(([selector, from]) => {
        document.querySelectorAll(selector).forEach((el) => {
            if (el.dataset.reveal || el.closest('.hero, .page-hero')) return;
            el.dataset.reveal = from;
            targets.push(el);
        });
    });
    document.documentElement.classList.add('js-reveal');

    // Elements entering together reveal in page order with a short overlap
    const observer = new IntersectionObserver((entries) => {
        entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target)
            .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
            .forEach((el, i) => {
                el.style.setProperty('--reveal-delay', i * 70 + 'ms');
                el.classList.add('is-visible');
                observer.unobserve(el);
            });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    targets.forEach((el) => observer.observe(el));
})();
