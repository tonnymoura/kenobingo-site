(function () {
    var KEY = 'kb-cookies';
    var PH_KEY = 'phc_xvsxCi3EtHw6mupqxVi3aek6eFt6pP6MHZY8U7LaHoLh';
    var PH_HOST = 'https://us.i.posthog.com';

    function getChoice() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }

    function setChoice(value) {
        try { localStorage.setItem(KEY, value); } catch (e) { /* sem armazenamento: pergunta de novo na próxima visita */ }
    }

    function loadPostHog() {
        if (window.posthog && window.posthog.__loaded) {
            window.posthog.opt_in_capturing();
            return;
        }
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        window.posthog.init(PH_KEY, {
            api_host: PH_HOST,
            person_profiles: 'identified_only',
            disable_session_recording: true
        });
    }

    function stopPostHog() {
        if (window.posthog && window.posthog.opt_out_capturing) {
            window.posthog.opt_out_capturing();
            window.posthog.reset();
        }
    }

    function closeBanner() {
        var el = document.getElementById('cookie-banner');
        if (el) el.remove();
    }

    function choose(value) {
        setChoice(value);
        closeBanner();
        if (value === 'aceito') loadPostHog(); else stopPostHog();
    }

    function showBanner() {
        if (document.getElementById('cookie-banner')) return;
        var box = document.createElement('div');
        box.id = 'cookie-banner';
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-label', 'Aviso de cookies');
        box.innerHTML =
            '<p>Usamos cookies de estatística (PostHog) para entender como o site é usado e melhorá-lo. ' +
            'Só ativamos se você aceitar. Veja a <a href="privacidade.html">Política de Privacidade</a>.</p>' +
            '<div class="cookie-actions">' +
            '<button type="button" class="cookie-btn" data-choice="recusado">Recusar</button>' +
            '<button type="button" class="cookie-btn" data-choice="aceito">Aceitar</button>' +
            '</div>';
        box.addEventListener('click', function (ev) {
            var btn = ev.target.closest('[data-choice]');
            if (btn) choose(btn.getAttribute('data-choice'));
        });
        document.body.appendChild(box);
    }

    document.addEventListener('click', function (ev) {
        if (ev.target.closest('[data-cookie-prefs]')) {
            ev.preventDefault();
            showBanner();
        }
    });

    var current = getChoice();
    if (current === 'aceito') loadPostHog();
    else if (current !== 'recusado') showBanner();
})();
