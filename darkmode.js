/* 
  TypingMind Tweaks V3.1 (Robust Edition)
  - Fixed Sidebar Hiding for Rail Layout
  - VS Code Theme
*/

(function() {
    // --- CONSTANTS --- //
    const STORAGE_KEY = 'TM_TWEAKS_V3_CONFIG';
    const DEFAULT_CONFIG = {
        hideTeams: true,
        hideKB: true,
        hideAudio: true,
        hidePrompts: true,
        hideProfile: false,
        themeColor: '#3b82f6', 
        userBubbleColor: '#2563eb',
        enableBorderTheme: true
    };

    // --- STATE --- //
    let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_CONFIG;

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        applyStyles();
    }

    // --- UI DASHBOARD (Same as before) --- //
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
                    <label><input type="checkbox" id="chk-audio"> Hide Audio Input</label>
                    <label><input type="checkbox" id="chk-prompts"> Hide Prompt Library</label>
                    <label><input type="checkbox" id="chk-profile"> Hide User Profile</label>
                </div>
                <div class="tm-section">
                    <h3>Aesthetics</h3>
                    <label><input type="checkbox" id="chk-border"> Enable "Border" Theme</label>
                    <div class="tm-color-row"><span>Border Color</span><input type="color" id="col-theme"></div>
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
        bindChk('chk-audio', 'hideAudio');
        bindChk('chk-prompts', 'hidePrompts');
        bindChk('chk-profile', 'hideProfile');
        bindChk('chk-border', 'enableBorderTheme');
        bindCol('col-theme', 'themeColor');
        bindCol('col-user', 'userBubbleColor');
    }

    function createMenuButton() {
        const interval = setInterval(() => {
            const sidebar = document.querySelector('[data-element-id="side-bar-body"]');
            if (sidebar && !document.getElementById('tm-menu-btn')) {
                const btn = document.createElement('button');
                btn.id = 'tm-menu-btn';
                btn.innerHTML = '⚙️';
                btn.onclick = () => { createSettingsModal(); document.getElementById('tm-tweaks-modal').style.display = 'flex'; };
                // Styling the gear explicitly to be visible
                btn.style.cssText = "position: absolute; bottom: 15px; right: 15px; font-size: 24px; background: none; border: none; cursor: pointer; z-index: 9999; filter: grayscale(1) brightness(1.5);";
                sidebar.appendChild(btn);
                clearInterval(interval);
            }
        }, 1000);
    }

    // --- SMART STYLES --- //
    function applyStyles() {
        let style = document.getElementById('tm-tweaks-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'tm-tweaks-style';
            document.head.appendChild(style);
        }

        /* ROBUST SELECTORS: Matches partial text in links/buttons */
        const css = `
            #tm-tweaks-modal { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:99999; justify-content:center; align-items:center; }
            .tm-modal-content { background:#111; border:1px solid #333; padding:20px; border-radius:8px; width:300px; color:#eee; font-family:sans-serif; }
            .tm-header { display:flex; justify-content:space-between; margin-bottom:20px; }
            .tm-section { border-top:1px solid #333; padding:15px 0; display:flex; flex-direction:column; gap:8px; }
            .tm-color-row { display:flex; justify-content:space-between; }
            .tm-footer { margin-top:15px; text-align:right; }

            /* True Black Backgrounds */
            html.dark body, html.dark main, html.dark [data-element-id="chat-space-middle-part"], 
            html.dark [data-element-id="side-bar-body"], html.dark [data-element-id="response-block"] {
                background-color: #030303 !important;
            }

            /* --- HIDING (Using Attribute Selectors) --- */
            /* Teams */
            ${config.hideTeams ? `[href*="/teams"], [aria-label*="Team"], button:has(span:contains("Teams")) { display: none !important; }` : ''}
            
            /* Knowledge Base (Matches any link/button with KB or Knowledge Base in text/label) */
            ${config.hideKB ? `
                [data-element-id*="knowledge-base"],
                [aria-label*="Knowledge Base"],
                a[href*="/knowledge-base"],
                button:has(svg):has(span:contains("KB")) 
                { display: none !important; }
            ` : ''}

            /* Prompts */
            ${config.hidePrompts ? `
                [data-element-id*="prompt"], 
                [aria-label*="Prompt"],
                a[href*="/prompts"]
                { display: none !important; }
            ` : ''}

            /* Hide User Profile */
            ${config.hideProfile ? '[data-element-id="workspace-profile-button"] { display: none !important; }' : ''}

            /* Hide Audio */
            ${config.hideAudio ? '[data-element-id="voice-input-button"], button[aria-label="Voice Input"] { display: none !important; }' : ''}

            /* --- THEME --- */
            .prose.bg-blue-600 { background-color: ${config.userBubbleColor} !important; }
            
            ${config.enableBorderTheme ? `
                [data-element-id="new-chat-button-in-side-bar"] { background: transparent !important; border: 1px solid ${config.themeColor} !important; color: ${config.themeColor} !important; }
                [data-element-id="chat-input-area"] { background: #050505 !important; border: 1px solid ${config.themeColor}40 !important; border-radius: 6px; }
            ` : ''}
        `;
        style.textContent = css;
    }

    createMenuButton();
    applyStyles();
    console.log("🚀 TypingMind V3.1 Loaded");
})();
