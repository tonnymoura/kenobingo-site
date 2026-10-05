# Kenobingo site

Site estático (HTML, CSS e JS puro, sem build) do Kenobingo. Produção: https://kenobingo.jmdiversoes.com/

## Estrutura
- `index.html` página única; `style.css`; `script.js` (sanfona de pontos, pop-up PWA, menu de escolha Kick/Twitch).
- PWA: `manifest.json` + `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`.
- SEO: `og-image.jpg` (1200x630), JSON-LD no `<head>`, `sitemap.xml`, `robots.txt`.
- Mídia leve: `logo-header.jpg` (usado no site), `TV.mp4` (comprimido) e `TV-poster.jpg`. `LOGOMARCA.jpg` só no JSON-LD/og.

## Regras de edição
- Sem bibliotecas novas. Font Awesome 6.5.2 via CDN com SRI.
- Kick (https://kick.com/livekenobingo) é o canal prioritário e vem sempre antes da Twitch (https://www.twitch.tv/livekenobingo).
- Botão LIVE e card "Acompanhe ao Vivo" têm `data-live-choice` e abrem `#live-picker` (menu no desktop, modal até 992px). O `href` é a Kick, como reserva sem JS.
- Ao editar `style.css` ou `script.js`, incremente o `?v=N` no `index.html` (cache-buster manual).
- Links externos com `target="_blank"` levam `rel="noopener"`; ícones sem texto levam `aria-label`.
- Backups locais `*.backup-*` e `.DS_Store` são ignorados pelo git.

## Publicação (docker01)
Só publique com confirmação do usuário.
1. `ssh -i ~/.ssh/id_ed25519_piserver root@100.64.76.69` (Tailscale; o IP da LAN 192.168.18.202 só funciona na rede local).
2. Pasta `/opt/stack/apps/kenobingo` (não é repo git): faça backup (`cp -a`), copie os arquivos alterados com `scp`.
3. `docker compose up -d --build` (imagem nginx:alpine com `COPY .`, container `kenobingo-kenobingo-1`, porta 8081).
4. Confira com `curl localhost:8081/` e no endereço público.
