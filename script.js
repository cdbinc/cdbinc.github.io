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

    // --- FORMSPREE AJAX FIX ---
    const quoteForm = document.getElementById('quoteForm');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const status = document.createElement('div');
            status.style.marginTop = '20px';
            status.style.padding = '15px';
            status.style.borderRadius = '5px';
            status.style.textAlign = 'center';
            status.style.fontWeight = '500';
            
            const submitBtn = quoteForm.querySelector('.submit');
            const originalBtnText = submitBtn.innerHTML;
            
            // État de chargement
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Envoi en cours...';
            
            const data = new FormData(event.target);
            
            try {
                const response = await fetch(event.target.action, {
                    method: quoteForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    status.innerHTML = "Merci ! Votre demande a été envoyée avec succès. Notre équipe vous contactera sous peu.";
                    status.style.backgroundColor = '#dcfce7'; // vert clair
                    status.style.color = '#166534';
                    quoteForm.reset();
                    // On cache le bouton pour éviter les doubles envois
                    submitBtn.style.display = 'none';
                } else {
                    const errorData = await response.json();
                    status.innerHTML = "Oups ! Il y a eu un problème : " + (errorData.errors ? errorData.errors.map(error => error.message).join(", ") : "Erreur inconnue");
                    status.style.backgroundColor = '#fee2e2'; // rouge clair
                    status.style.color = '#991b1b';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            } catch (error) {
                status.innerHTML = "Désolé, une erreur réseau est survenue. Veuillez réessayer plus tard.";
                status.style.backgroundColor = '#fee2e2';
                status.style.color = '#991b1b';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
            
            // Ajout du message de statut à la fin du formulaire
            const existingStatus = quoteForm.querySelector('.form-status');
            if (existingStatus) existingStatus.remove();
            
            status.className = 'form-status';
            quoteForm.appendChild(status);
        });
    }
});
