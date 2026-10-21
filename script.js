document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DO EFEITO SANFONA E BUSCA (PONTOS ONLINE)
    // ==========================================
    const btnTogglePontos = document.getElementById('btn-toggle-pontos');
    const listaPontos = document.getElementById('lista-pontos');
    const inputBusca = document.getElementById('busca-ponto');
    const btnLimparBusca = document.getElementById('limpar-busca');
    const contadorPontos = document.getElementById('pontos-contador');
    const avisoVazio = document.getElementById('pontos-vazio');
    const cardAdquiraCartela = document.getElementById('card-adquira-cartela');

    const normalizarTexto = (str) =>
        (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const atualizarBotaoSanfona = (aberto) => {
        if (!btnTogglePontos) return;
        if (aberto) {
            btnTogglePontos.innerHTML = '<i class="fas fa-times"></i> Ocultar Pontos';
            btnTogglePontos.style.backgroundColor = 'transparent';
            btnTogglePontos.style.color = '#FF007F';
        } else {
            btnTogglePontos.innerHTML = '<i class="fas fa-map-marker-alt"></i> Mostrar Todos os Pontos';
            btnTogglePontos.style.backgroundColor = '#FF007F';
            btnTogglePontos.style.color = '#FFFFFF';
        }
    };

    if (btnTogglePontos && listaPontos) {
        btnTogglePontos.addEventListener('click', () => {
            const aberto = listaPontos.classList.toggle('open');
            atualizarBotaoSanfona(aberto);
            if (!aberto) {
                document.getElementById('accordion-container').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Os pontos podem ser trocados depois do carregamento (lista vinda do sistema, ver 1.0):
    // quem troca chama window.recarregarPontos() para refazer a busca e o contador.
    window.recarregarPontos = () => {};

    if (listaPontos && inputBusca) {
        let totalPontos = 0;
        let dadosPontos = [];
        const lerPontos = () => {
            const linksPontos = Array.from(listaPontos.querySelectorAll('.ponto-link'));
            totalPontos = linksPontos.length;
            dadosPontos = linksPontos.map((el) => ({
                el,
                texto: normalizarTexto(el.textContent)
            }));
        };
        lerPontos();

        const filtrarPontos = () => {
            const termo = normalizarTexto(inputBusca.value.trim());
            if (btnLimparBusca) btnLimparBusca.hidden = !termo;

            if (termo && !listaPontos.classList.contains('open')) {
                listaPontos.classList.add('open');
                atualizarBotaoSanfona(true);
            }

            let visiveis = 0;
            dadosPontos.forEach(({ el, texto }) => {
                const bate = !termo || texto.includes(termo);
                el.hidden = !bate;
                if (bate) visiveis++;
            });

            if (contadorPontos) {
                contadorPontos.textContent = termo
                    ? `${visiveis} de ${totalPontos} pontos encontrados`
                    : `${totalPontos} pontos oficiais disponíveis`;
            }
            if (avisoVazio) {
                avisoVazio.hidden = visiveis > 0;
            }
        };

        inputBusca.addEventListener('input', filtrarPontos);
        if (btnLimparBusca) {
            btnLimparBusca.addEventListener('click', () => {
                inputBusca.value = '';
                filtrarPontos();
                inputBusca.focus();
            });
        }
        filtrarPontos();
        window.recarregarPontos = () => { lerPontos(); filtrarPontos(); };
    }

    // ==========================================
    // 1.0 LISTA DE PONTOS VINDA DO SISTEMA (pontos-kenobingo.json)
    // A lista fixa do HTML continua como reserva: se o sistema estiver fora do ar ou devolver algo
    // suspeito, nada muda na tela.
    // ==========================================
    const URL_PONTOS = 'https://manutencao.jmdiversoes.com/publico/pontos-kenobingo.json';
    const LINK_PONTO_VALIDO = /^https:\/\/[a-z0-9-]+\.123client\.net$/;
    const MINIMO_PONTOS = 50;

    if (listaPontos && typeof fetch === 'function') {
        fetch(URL_PONTOS, { cache: 'no-cache' })
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status))))
            .then((dados) => {
                const pontos = ((dados && dados.pontos) || []).filter(
                    (p) => p && typeof p.nome === 'string' && p.nome.trim() && LINK_PONTO_VALIDO.test(String(p.link))
                );
                if (pontos.length < MINIMO_PONTOS) return;

                const fragmento = document.createDocumentFragment();
                pontos.forEach((p) => {
                    const a = document.createElement('a');
                    a.href = p.link;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    a.className = 'ponto-link active-effect';
                    a.textContent = p.nome.trim();
                    fragmento.appendChild(a);
                });
                listaPontos.querySelectorAll('.ponto-link').forEach((el) => el.remove());
                listaPontos.appendChild(fragmento);
                window.recarregarPontos();
            })
            .catch(() => { /* mantém a lista fixa do HTML */ });
    }

    if (cardAdquiraCartela && listaPontos) {
        cardAdquiraCartela.addEventListener('click', (e) => {
            e.preventDefault();
            if (!listaPontos.classList.contains('open')) {
                listaPontos.classList.add('open');
                atualizarBotaoSanfona(true);
            }
            const secaoPontos = document.getElementById('pontos-online');
            if (secaoPontos) secaoPontos.scrollIntoView({ behavior: 'smooth' });
            if (inputBusca) {
                setTimeout(() => inputBusca.focus({ preventScroll: true }), 450);
            }
        });
    }

    // ==========================================
    // 1.1 STATUS DAS RODADAS (SALA 214 KENO + SALA 568 SUPER — HORÁRIO DE BRASÍLIA)
    // ==========================================
    const statusDot = document.getElementById('round-status-dot');
    const statusText = document.getElementById('round-status-text');

    if (statusDot && statusText) {
        // Grade Terça a Sábado (Sala 214 KENO + entradas SUPER):
        // 08:00 às 10:00 -> a cada 30 min (08:00, 08:30, 09:00, 09:30, 10:00)
        // 10:00 às 22:00 -> a cada 15 min (com pausa às 20:45 de Ter a Sex e às 19:45 na Qua/Sáb)
        const construirGradeDia = (diaSemana) => {
            // Domingo (0) e Segunda-feira (1): operação 100% na Sala 568 (SUPER) das 10:00 (600) às 23:45 (1425)
            if (diaSemana === 0 || diaSemana === 1) {
                const gradeSuper = [];
                for (let t = 600; t <= 1425; t += 15) {
                    if (t !== 1185) gradeSuper.push(t); // pausa às 19:45 (1185) antes da 20:00★
                }
                return gradeSuper;
            }

            // Terça (2) a Sábado (6): começa às 08:00 (480) de 30 em 30 min até 10:00 (600), depois de 15 em 15 min até 22:00 (1320)
            const grade214 = [480, 510, 540, 570];
            for (let t = 600; t <= 1320; t += 15) {
                // Quarta (3) e Sábado (6) pausam às 19:45 (1185) antes da Super Rodada das 20:00★
                if ((diaSemana === 3 || diaSemana === 6) && t === 1185) continue;
                // Terça a Sexta (2..5) pausam às 20:45 (1245) antes da Rodada Nobre das 21:00★
                if (diaSemana >= 2 && diaSemana <= 5 && t === 1245) continue;
                grade214.push(t);
            }
            return grade214;
        };

        const atualizarStatusRodada = () => {
            const agora = new Date();
            // Converter para horário de Brasília (UTC-3)
            const utcMs = agora.getTime() + agora.getTimezoneOffset() * 60000;
            const brt = new Date(utcMs - 3 * 3600000);
            const diaSemana = brt.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb
            const h = brt.getHours();
            const m = brt.getMinutes();
            const minDia = h * 60 + m;

            const gradeHoje = construirGradeDia(diaSemana);
            const inicioDia = gradeHoje[0];
            const fimDia = gradeHoje[gradeHoje.length - 1];

            if (minDia >= inicioDia && minDia <= fimDia) {
                const proxMinTotal = gradeHoje.find((t) => t >= minDia) || fimDia;
                const faltam = proxMinTotal - minDia;
                const proxH = String(Math.floor(proxMinTotal / 60)).padStart(2, '0');
                const proxM = String(proxMinTotal % 60).padStart(2, '0');

                statusDot.classList.add('live');
                statusText.textContent = faltam === 0
                    ? `Rodada das ${proxH}:${proxM}h em andamento`
                    : `Próxima rodada às ${proxH}:${proxM}h (${faltam} min)`;
            } else {
                statusDot.classList.remove('live');
                statusText.textContent = 'Sorteios diários das 08:00h às 23:45h';
            }
        };

        atualizarStatusRodada();
        setInterval(atualizarStatusRodada, 30000);
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