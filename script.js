document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DO EFEITO SANFONA (PONTOS ONLINE)
    // ==========================================
    const btnTogglePontos = document.getElementById('btn-toggle-pontos');
    const listaPontos = document.getElementById('lista-pontos');

    if (btnTogglePontos && listaPontos) {
        btnTogglePontos.addEventListener('click', () => {
            // Liga/Desliga a classe 'open' que mostra a grade no CSS
            listaPontos.classList.toggle('open');
            
            // Troca o visual do botão dependendo do estado
            if (listaPontos.classList.contains('open')) {
                btnTogglePontos.innerHTML = '<i class="fas fa-times"></i> Ocultar Pontos';
                btnTogglePontos.style.backgroundColor = 'transparent';
                btnTogglePontos.style.color = '#FF007F';
            } else {
                btnTogglePontos.innerHTML = '<i class="fas fa-map-marker-alt"></i> Mostrar Todos os Pontos';
                btnTogglePontos.style.backgroundColor = '#FF007F';
                btnTogglePontos.style.color = '#FFFFFF';
                
                // Sobe a tela de volta pro topo da seção caso a pessoa tenha rolado muito
                document.getElementById('accordion-container').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==========================================
    // 2. LÓGICA DO POP-UP DE INSTALAÇÃO (PWA)
    // ==========================================
    setTimeout(() => {
        const isIos = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
        const isAndroid = () => /android/.test(window.navigator.userAgent.toLowerCase());
        const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
        const promptClosed = localStorage.getItem('pwaPromptClosed');

        // Só exibe o popup se for celular, se NÃO estiver instalado e NÃO tiver fechado o aviso antes
        if (!isInStandaloneMode() && !promptClosed) {
            const pwaPrompt = document.getElementById('pwa-prompt');
            const iosInst = document.getElementById('pwa-ios-instructions');
            const andInst = document.getElementById('pwa-android-instructions');
            const closeBtn = document.getElementById('pwa-close-btn');

            if (pwaPrompt && iosInst && andInst && closeBtn) {
                if (isIos()) {
                    pwaPrompt.style.display = 'flex';
                    iosInst.style.display = 'block';
                } else if (isAndroid()) {
                    pwaPrompt.style.display = 'flex';
                    andInst.style.display = 'block';
                }

                closeBtn.addEventListener('click', () => {
                    pwaPrompt.style.display = 'none';
                    // Salva a decisão para não incomodar o usuário na próxima visita
                    localStorage.setItem('pwaPromptClosed', 'true');
                });
            }
        }
    }, 2500); // Exibe 2.5 segundos após abrir o site
});