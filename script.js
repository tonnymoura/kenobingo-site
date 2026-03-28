document.addEventListener('DOMContentLoaded', () => {
    // Menu Hambúrguer
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-list a');

    hamburgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Altera o ícone do hambúrguer para 'x' e vice-versa
        hamburgerMenu.querySelector('i').classList.toggle('fa-bars');
        hamburgerMenu.querySelector('i').classList.toggle('fa-times');
    });

    // Fechar menu ao clicar em um link (apenas para mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburgerMenu.querySelector('i').classList.remove('fa-times');
                hamburgerMenu.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Scroll suave para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = document.querySelector('header').offsetHeight; // Altura do header fixo
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset - 20; // 20px de padding extra

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Animação de scroll (opcional, para elementos aparecerem ao rolar)
    // Exemplo simples: elementos com a classe 'fade-in'
    const fadeInElements = document.querySelectorAll('.step-card, .game-card, .testimonial-card, .contact-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Elemento visível em 10% para acionar
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Para animar apenas uma vez
            }
        });
    }, observerOptions);

    fadeInElements.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});
