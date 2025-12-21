/* 
  TypingMind Tweaks V3.4 (Rail Edition)
  - Button inside Sidebar Rail (Native Look)
  - "Void" Theme (Black + Outlines)
  - Robust Element Hiding
*/

(function() {
    console.log("🚀 V3.4 Rail Edition Starting...");

    const STORAGE_KEY = 'TM_TWEAKS_CONFIG';
    const DEFAULT_CONFIG = {
        hideTeams: true,
        hideKB: true,
        hideAudio: true,
        hidePrompts: true,
        hideProfile: false,
        themeColor: '#3b82f6', // Bright Blue for outlines
        userBubbleColor: '#2563eb',
        enableBorderTheme: true
    };
    let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_CONFIG;

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        applyStyles();
        runMonitor();
    }

    // --- UI MODAL (Same as before) --- //
    function createSettingsModal() {
        if (document.getElementById('tm-tweaks-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'tm-tweaks-modal';
        modal.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-header"><h2>✨ UI Tweaks</h2><button id="tm-close-btn">×</button></div>
                
                <div class="tm-section">
                    <h3>Visibility</h3>
                    <label><input type="checkbox" id="chk-teams"> Hide Teams</label>
                    <label><input type="checkbox" id="chk-kb"> Hide Knowledge Base</label>
                    <label><input type="checkbox" id="chk-prompts"> Hide Prompt Library (List More)</label>
                    <label><input type="checkbox" id="chk-audio"> Hide Audio Button</label>
                    <label><input type="checkbox" id="chk-profile"> Hide Profile</label>
                </div>

                <div class="tm-section">
                    <h3>The "Void" Theme</h3>
                    <div class="tm-col-opt"><label><input type="checkbox" id="chk-border"> Enable Black + Outlines</label></div>
                    <div class="tm-color-row"><span>Outline Color</span><input type="color" id="col-theme"></div>
                    <div class="tm-color-row"><span>User Bubble</span><input type="color" id="col-user"></div>
                </div>
                <div class="tm-footer"><button id="tm-save-close">Done</button></div>
            </div>`;
        document.body.appendChild(modal);

        const close = () => modal.style.display = 'none';
        document.getElementById('tm-close-btn').onclick = close;
        document.getElementById('tm-save-close').onclick = close;

        const bindChk = (id, key) => {
            const el = document.getElementById(id);
            el.checked = config[key];
            el.onchange = (e) => { config[key] = e.target.checked; saveConfig(); };
        };
        const bindCol = (id, key) => {
            const el = document.getElementById(id);
            el.value = config[key];
            el.oninput = (e) => { config[key] = e.target.value; saveConfig(); };
        };

        bindChk('chk-teams', 'hideTeams');
        bindChk('chk-kb', 'hideKB');
        bindChk('chk-prompts', 'hidePrompts');
        bindChk('chk-audio', 'hideAudio');
        bindChk('chk-profile', 'hideProfile');
        bindChk('chk-border', 'enableBorderTheme');
        bindCol('col-theme', 'themeColor');
        bindCol('col-user', 'userBubbleColor');
    }

    // --- THE RAIL INJECTOR --- //
    function injectRailButton() {
        if (document.getElementById('tm-rail-btn')) return;

        // Strategy: Find the "Settings" button in the Rail
        // It usually has "Settings" text or a specific icon, but let's look for "Settings" aria-label or text
        const settingsBtn = findElementByText('Settings', 'div, a, button');
        
        if (settingsBtn) {
            // Found it! Get its container (the Rail item wrapper)
            const railItem = settingsBtn.closest('div'); 
            if (railItem && railItem.parentElement) {
                // Create our button wrapper looking like a rail item
                const btnContainer = document.createElement('div');
                btnContainer.className = railItem.className; // Steal the class to look native
                btnContainer.style.cursor = 'pointer';
                btnContainer.style.display = 'flex';
                btnContainer.style.justifyContent = 'center';
                btnContainer.style.padding = '8px 0';

                const btn = document.createElement('button');
                btn.id = 'tm-rail-btn';
                // Using a gear SVG or emoji
                btn.innerHTML = '⚙️'; 
                btn.style.fontSize = '20px';
                btn.style.background = 'transparent';
                btn.style.border = 'none';
                btn.style.opacity = '0.7';
                
                btn.onclick = (e) => {
                    e.stopPropagation();
                    createSettingsModal(); 
                    document.getElementById('tm-tweaks-modal').style.display = 'flex';
                };

                btnContainer.appendChild(btn);
                
                // Insert BEFORE the Settings button
                railItem.parentElement.insertBefore(btnContainer, railItem);
                console.log("✅ Tweaks Button Injected into Rail");
                return;
            }
        }
    }

    // --- ELEMENT HIDER (Scanner) --- //
    function runMonitor() {
        injectRailButton();

        if (config.hideTeams) hideByText('Teams');
        if (config.hideKB) { hideByText('Knowledge Base'); hideByText('KB'); }
        if (config.hidePrompts) { 
            hideByText('List more'); // The stubbon one
            hideByText('Prompts'); 
        }
    }

    function findElementByText(text, selector = '*') {
        const snapshot = document.evaluate(
            `//${selector}[contains(text(), '${text}')] | //${selector}[@aria-label='${text}']`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        );
        return snapshot.singleNodeValue;
    }

    function hideByText(text) {
        const snapshot = document.evaluate(
            `//*[contains(text(), '${text}')]`,
            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
        );
        for (let i = 0; i < snapshot.snapshotLength; i++) {
            const node = snapshot.snapshotItem(i);
            const container = node.closest('button, a, [role="button"], .group');
            if (container) container.style.display = 'none';
        }
    }

    // --- CSS THEME --- //
    function applyStyles() {
        let style = document.getElementById('tm-tweaks-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'tm-tweaks-style';
            document.head.appendChild(style);
        }

        const borderAlpha = Math.floor(0.4 * 255).toString(16).padStart(2,'0'); // 40% opacity hex
        const css = `
            #tm-tweaks-modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:999999; justify-content:center; align-items:center; }
            .tm-modal-content { background:#000; border:1px solid ${config.themeColor}; padding:20px; border-radius:8px; width:300px; color:#fff; font-family:sans-serif; }
            /* Audio & Profile Hard Hides */
            ${config.hideAudio ? `[data-element-id="voice-input-button"], button[aria-label="Voice Input"] { display: none !important; }` : ''}
            ${config.hideProfile ? `[data-element-id="workspace-profile-button"] { display: none !important; }` : ''}

            /* User Color */
            [data-is-user="true"] .prose, .bg-blue-600 { background-color: ${config.userBubbleColor} !important; }

            ${config.enableBorderTheme ? `
                /* THE VOID THEME */
                html.dark body, html.dark main, 
                html.dark [data-element-id="side-bar-body"],
                html.dark [data-element-id="side-bar-nav-rail"],
                html.dark [data-element-id="chat-space-middle-part"],
                html.dark [data-element-id="response-block"],
                html.dark header {
                    background-color: #000000 !important;
                }

                /* OUTLINES */
                /* 1. Sidebar Rail */
                [data-element-id="side-bar-nav-rail"] {
                    border-right: 1px solid ${config.themeColor}${borderAlpha} !important;
                }
                /* 2. Chat Area Header */
                header, [data-element-id="chat-space-header"] {
                    border-bottom: 1px solid ${config.themeColor}${borderAlpha} !important;
                }
                /* 3. Input Area */
                [data-element-id="chat-input-area"] {
                    background-color: #000 !important;
                    border: 1px solid ${config.themeColor}${borderAlpha} !important;
                    border-radius: 8px !important;
                }
                /* 4. Response Blocks (AI) */
                [data-element-id="response-block"] {
                    border-left: 1px solid ${config.themeColor}22 !important; /* Very faint left line */
                }
                
                /* New Chat Button */
                [data-element-id="new-chat-button-in-side-bar"] {
                    background: transparent !important;
                    border: 1px solid ${config.themeColor} !important;
                    color: ${config.themeColor} !important;
                }
            ` : ''}
        `;
        style.textContent = css;
    }

    // --- START --- //
    applyStyles();
    setInterval(runMonitor, 800); // Check every 0.8s
    console.log("🚀 V3.4 Loaded");
})();
