document.addEventListener('DOMContentLoaded', () => {
    // --- MENU MOBILE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '80px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#ffffff';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 10px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    // --- SCROLL FLUIDE ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
            if (window.innerWidth <= 768 && navLinks) {
                navLinks.style.display = 'none';
            }
        });
    });

    // --- FORMULAIRE DE CONTACT SÉCURISÉ ---
    (function() {
        const quoteForm = document.getElementById('quoteForm');
        if (!quoteForm) return;
        if (quoteForm.dataset.listenerActive === 'true') return;
        quoteForm.dataset.listenerActive = 'true';

        quoteForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = quoteForm.querySelector('button[type="submit"], input[type="submit"]');
            let statusDiv = document.getElementById('formStatus');
            if (!statusDiv) {
                statusDiv = document.createElement('div');
                statusDiv.id = 'formStatus';
                statusDiv.setAttribute('role', 'status');
                statusDiv.setAttribute('aria-live', 'polite');
                quoteForm.appendChild(statusDiv);
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.dataset.originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Envoi en cours...';
            }

            statusDiv.style.cssText = 'margin-top:16px;padding:12px 16px;border-radius:4px;font-weight:500;text-align:center;';
            statusDiv.style.background = 'rgba(210,73,27,0.08)';
            statusDiv.style.color = '#d2491b';
            statusDiv.textContent = 'Envoi de votre demande en cours…';

            try {
                const response = await fetch(quoteForm.action, {
                    method: 'POST',
                    body: new FormData(quoteForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    statusDiv.style.background = 'rgba(46,204,113,0.1)';
                    statusDiv.style.color = '#166534';
                    statusDiv.innerHTML = '✓ Votre demande a été envoyée avec succès. Notre équipe vous répondra sous 24h ouvrables.';
                    quoteForm.reset();
                    if (submitBtn) submitBtn.style.display = 'none';
                } else {
                    throw new Error('server error');
                }
            } catch (err) {
                statusDiv.style.background = 'rgba(231,76,60,0.1)';
                statusDiv.style.color = '#991b1b';
                statusDiv.textContent = 'Une erreur est survenue. Veuillez réessayer ou nous appeler au (819) 452-4788.';
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = submitBtn.dataset.originalText;
                }
            }
        });
    })();
});

// ====== FILTRAGE DU PORTFOLIO ======
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.portfolio-section .filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-section .portfolio-item');
    const categories = document.querySelectorAll('.portfolio-section .portfolio-category');

    if (filterButtons.length === 0 || portfolioItems.length === 0) return;

    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterButtons.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            portfolioItems.forEach(function(item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            categories.forEach(function(cat) {
                if (filter === 'all') {
                    cat.classList.remove('hidden');
                } else {
                    cat.classList.toggle('hidden', cat.getAttribute('data-category-wrapper') !== filter);
                }
            });
        });
    });
});
