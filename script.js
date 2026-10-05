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

    // ==========================================
    // 3. ESCOLHA DE TRANSMISSÃO (KICK / TWITCH)
    // ==========================================
    // Sem JS, os links data-live-choice abrem a Kick direto (href normal).
    const picker = document.getElementById('live-picker');
    const pickerBox = picker && picker.querySelector('.live-picker-box');
    const triggers = document.querySelectorAll('[data-live-choice]');
    let activeTrigger = null;

    if (picker && pickerBox && triggers.length) {
        const isMobile = () => window.matchMedia('(max-width: 992px)').matches;

        const closePicker = () => {
            if (picker.hidden) return;
            picker.hidden = true;
            if (activeTrigger) {
                activeTrigger.setAttribute('aria-expanded', 'false');
                activeTrigger.focus({ preventScroll: true });
            }
            activeTrigger = null;
        };

        const positionPicker = () => {
            if (isMobile() || !activeTrigger) {
                picker.style.top = picker.style.left = '';
                return;
            }
            const r = activeTrigger.getBoundingClientRect();
            const w = pickerBox.offsetWidth;
            picker.style.top = (r.bottom + 8) + 'px';
            picker.style.left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, window.innerWidth - w - 8)) + 'px';
        };

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                if (!picker.hidden && activeTrigger === trigger) { closePicker(); return; }
                if (activeTrigger) activeTrigger.setAttribute('aria-expanded', 'false');
                activeTrigger = trigger;
                trigger.setAttribute('aria-expanded', 'true');
                picker.hidden = false;
                positionPicker();
                const first = pickerBox.querySelector('.live-opt');
                if (first) first.focus({ preventScroll: true });
            });
        });

        // Fecha ao clicar fora (no celular, o fundo escuro), no X ou ao escolher uma opção
        document.addEventListener('click', (e) => {
            if (picker.hidden) return;
            if (e.target.closest('[data-live-choice]')) return;
            if (!pickerBox.contains(e.target) || e.target.closest('.live-picker-close') || e.target.closest('.live-opt')) closePicker();
        });
        document.addEventListener('keydown', (e) => {
            if (picker.hidden) return;
            if (e.key === 'Escape') { closePicker(); return; }
            // Mantém o foco do teclado dentro do menu enquanto ele está aberto
            if (e.key === 'Tab') {
                const items = [...pickerBox.querySelectorAll('a, button')].filter(el => el.offsetParent !== null);
                if (!items.length) return;
                const first = items[0], last = items[items.length - 1];
                if (!pickerBox.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
                else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });
        window.addEventListener('resize', positionPicker);
        window.addEventListener('scroll', () => { if (!picker.hidden && !isMobile()) closePicker(); }, { passive: true });
    }
});