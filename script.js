// Funcionalidade do Menu Hambúrguer
const hamburger = document.querySelector(".hamburger-menu");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

// Fechar menu ao clicar em um link
document.querySelectorAll(".nav-list a").forEach(n => n.addEventListener("click", () => {
    navMenu.classList.remove("active");
}));

// Animação de Fade-in on Scroll (Simples)
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target);
        }
    });
}, appearOptions);

faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// Detectar dispositivo e mostrar Pop-up PWA
document.addEventListener('DOMContentLoaded', () => {
    // Pequeno delay para não atrapalhar o carregamento inicial
    setTimeout(() => {
        const isIos = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /iphone|ipad|ipod/.test(userAgent);
        };
        const isAndroid = () => {
            const userAgent = window.navigator.userAgent.toLowerCase();
            return /android/.test(userAgent);
        };
        
        // Verifica se já está instalado (rodando como standalone)
        const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

        // Verifica se o usuário já fechou o aviso nesta sessão
        const promptClosed = localStorage.getItem('pwaPromptClosed');

        // Só mostra se for mobile (iOS ou Android) e se não estiver instalado e não tiver fechado o aviso
        if (!isInStandaloneMode() && !promptClosed) {
            const pwaPrompt = document.getElementById('pwa-prompt');
            const iosInstructions = document.getElementById('pwa-ios-instructions');
            const androidInstructions = document.getElementById('pwa-android-instructions');
            const closeBtn = document.getElementById('pwa-close-btn');

            if (pwaPrompt && iosInstructions && androidInstructions && closeBtn) {
                if (isIos()) {
                    pwaPrompt.style.display = 'flex';
                    iosInstructions.style.display = 'block';
                } else if (isAndroid()) {
                    pwaPrompt.style.display = 'flex';
                    androidInstructions.style.display = 'block';
                }

                // Lógica para fechar o pop-up
                closeBtn.addEventListener('click', () => {
                    pwaPrompt.style.display = 'none';
                    // Salva a preferência do usuário para não mostrar de novo tão cedo
                    localStorage.setItem('pwaPromptClosed', 'true');
                });
            }
        }
    }, 3000); // Aparece 3 segundos após o carregamento
});