/**
 * script.js – Interactions légères pour le site Horizons Voyages
 * - Menu burger responsive
 * - Smooth scroll (complément au CSS natif)
 * - Animation d'apparition des sections au scroll (Intersection Observer)
 * - Gestion du formulaire de contact (feedback)
 */

document.addEventListener('DOMContentLoaded', function () {

    // ==========================================================
    // 1. MENU BURGER (mobile)
    // ==========================================================
    const burger = document.getElementById('burger');
    const nav = document.querySelector('.nav');

    if (burger && nav) {
        burger.addEventListener('click', function () {
            // Basculer l'état du menu
            const isOpen = nav.classList.toggle('nav--open');
            burger.classList.toggle('burger--active');
            burger.setAttribute('aria-expanded', isOpen);
        });

        // Fermer le menu si on clique sur un lien
        const navLinks = nav.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                nav.classList.remove('nav--open');
                burger.classList.remove('burger--active');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ==========================================================
    // 2. SMOOTH SCROLL (pour les navigateurs qui ne supportent
    //    pas `scroll-behavior: smooth` – en complément)
    //    Ici on utilise un comportement natif via CSS,
    //    mais on peut ajouter un polyfill si nécessaire.
    //    Pour l'exemple, on ajoute un léger délai pour les
    //    ancres avec décalage du header sticky.
    // ==========================================================
    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================================
    // 3. ANIMATION À L'APPARITION (Intersection Observer)
    // ==========================================================
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -50px 0px', // déclenche un peu avant que la section soit visible
        threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                // Optionnel : on peut arrêter d'observer après l'apparition
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // On observe toutes les sections (sauf la hero qu'on peut exclure si on veut)
    sections.forEach(section => {
        // On ajoute une classe de base transparente si on veut une animation
        // Ici on va simplement ajouter une classe qui déclenche une transition sur l'opacité
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        observer.observe(section);
    });

    // Quand une section devient visible, on applique les styles finaux
    // On utilise une classe ajoutée par l'Observer
    // On va modifier légèrement : on ajoute une classe 'section-visible'
    // et on définit les styles dans le CSS si besoin, mais on peut aussi le faire en JS.
    // On va créer une règle dynamique ou utiliser une classe.
    // Ici on va appliquer les styles via une classe ajoutée.
    // On définit une règle CSS pour .section-visible
    // Mais on va aussi appliquer directement en JS pour être sûr.
    const style = document.createElement('style');
    style.textContent = `
                .section-visible {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            `;
    document.head.appendChild(style);

    // On modifie l'observer pour ajouter la classe
    // Mais on a déjà défini le callback, on va le remplacer pour utiliser la classe.
    // On va recréer l'observer avec un callback qui ajoute la classe.
    // Pour éviter les doublons, on va désactiver l'ancien et en créer un nouveau.
    // On va simplement réécrire la partie observer.
    // On supprime l'ancien observer et on en crée un nouveau.
    observer.disconnect();

    const newObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                newObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        newObserver.observe(section);
    });

    // Pour la hero, on la rend visible immédiatement (pas d'animation)
    const hero = document.getElementById('accueil');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
        hero.style.transition = 'none';
    }

    // ==========================================================
    // 4. GESTION DU FORMULAIRE DE CONTACT
    // ==========================================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simuler l'envoi (ex: validation basique)
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formFeedback.textContent = 'Veuillez remplir tous les champs.';
                formFeedback.style.color = '#e74c3c';
                return;
            }

            // Simuler un délai d'envoi
            formFeedback.textContent = 'Envoi en cours...';
            formFeedback.style.color = 'var(--color-primary)';

            setTimeout(() => {
                // Succès simulé
                formFeedback.textContent = '✅ Votre message a été envoyé ! Nous vous répondrons dans les plus brefs délais.';
                formFeedback.style.color = 'green';
                contactForm.reset();
            }, 1500);
        });
    }
});