/*
 * This Script was made up for the ```Tampermonkey Extension``` is the same than gen-gui but in the web browser...
 */

// ==UserScript==
// @name         Gen GUI WEB
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Gen GUI Web Version
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const ACTIVITY_INTERVAL = 60000; // 1 minuto (60,000 ms)
    let activityTimer = null;
    let audioContext = null;
    let oscillator = null;

    let isActive = localStorage.getItem('tab_keeper_active') === 'true';

    const ui = document.createElement('div');
    ui.id = 'tab-keeper-ui';
    ui.innerHTML = `
        <div style="font-family: monospace; font-size: 11px; font-weight: bold; margin-bottom: 5px;">TAB KEEPER</div>
        <button id="tk-toggle-btn" style="
            width: 100%; padding: 6px 10px; border: none; border-radius: 4px;
            cursor: pointer; font-weight: bold; font-family: monospace; transition: all 0.2s ease;
        "></button>
    `;

    Object.assign(ui.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: '99999',
        backgroundColor: '#1e1e2e',
        color: '#cdd6f4',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        border: '1px solid #45475a',
        textAlign: 'center',
        userSelect: 'none'
    });

    document.body.appendChild(ui);
    const btn = document.getElementById('tk-toggle-btn');

    function updateUI() {
        if (isActive) {
            btn.textContent = 'ESTADO: ACTIVO';
            btn.style.backgroundColor = '#a6e3a1';
            btn.style.color = '#11111b';
            ui.style.borderColor = '#a6e3a1';
        } else {
            btn.textContent = 'ESTADO: APAGADO';
            btn.style.backgroundColor = '#f38ba8';
            btn.style.color = '#11111b';
            ui.style.borderColor = '#45475a';
        }
    }

    function simulateUserActivity() {
        console.log('%c[Tab Keeper] Simulando actividad en el DOM...', 'color: #f9e2af');

        const mouseEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: Math.floor(Math.random() * 500),
            clientY: Math.floor(Math.random() * 500)
        });
        document.dispatchEvent(mouseEvent);

        const keyEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Shift',
            keyCode: 16,
            which: 16
        });
        document.dispatchEvent(keyEvent);

        window.dispatchEvent(new Event('scroll'));

        fetch(`${window.location.origin}/favicon.ico`, {
            method: 'HEAD',
            cache: 'no-store'
        })
            .then(response => {
            if (response.ok || response.status === 404) {
                console.log('%c[Session] Token revalidado con éxito del lado del servidor.', 'color: #a6e3a1');
            }
        })
            .catch(err => {
            console.error('[Session] Error de red al intentar validar la sesión:', err);
        });
    }

    function startKeeper() {
        if (!audioContext) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioContext();
                oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(1, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.0001, audioContext.currentTime);

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                oscillator.start();
                console.log('%c[Tab Keeper] Audio anti-suspensión activo.', 'color: #00ffff');
            } catch (e) {
                console.error('[Tab Keeper] Error AudioContext:', e);
            }
        } else if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        if (!activityTimer) {
            simulateUserActivity();
            activityTimer = setInterval(simulateUserActivity, ACTIVITY_INTERVAL);
        }
    }

    function stopKeeper() {
        if (audioContext && audioContext.state === 'running') {
            audioContext.suspend();
        }
        if (activityTimer) {
            clearInterval(activityTimer);
            activityTimer = null;
            console.log('%c[Tab Keeper] Simulación de actividad detenida.', 'color: #f38ba8');
        }
    }

    btn.addEventListener('click', () => {
        isActive = !isActive;
        localStorage.setItem('tab_keeper_active', isActive);
        updateUI();

        if (isActive) {
            startKeeper();
        } else {
            stopKeeper();
        }
    });

    updateUI();
    if (isActive) {
        document.addEventListener('click', function autoStart() {
            if (isActive) startKeeper();
            document.removeEventListener('click', autoStart);
        }, { once: true });
    }
})();