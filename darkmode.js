/* 
  TypingMind Tweaks V3.2 (The Failsafe Edition)
  - Fixed Position Menu Button (Guaranteed Visibility)
  - Aggressive Hiding
*/

(function() {
    console.log("🚀 V3.2 Starting...");

    // --- CONFIG & STATE --- //
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
    let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_CONFIG;

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        applyStyles();
    }

    // --- DASHBOARD UI --- //
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
                    <div class="tm-col-opt"><label><input type="checkbox" id="chk-border"> Enable Border Theme</label></div>
                    <div class="tm-color-row"><span>Theme Color</span><input type="color" id="col-theme"></div>
                    <div class="tm-color-row"><span>User Bubble</span><input type="color" id="col-user"></div>
                </div>
                <div class="tm-footer"><button id="tm-save-close">Close</button></div>
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

    // --- BUTTON CREATION (FAILSAFE) --- //
    function createMenuButton() {
        if (document.getElementById('tm-menu-btn')) return;
        
        const btn = document.createElement('button');
        btn.id = 'tm-menu-btn';
        btn.innerHTML = '⚙️';
        btn.onclick = () => { createSettingsModal(); document.getElementById('tm-tweaks-modal').style.display = 'flex'; };
        
        // FIXED POSITIONING: Will appear regardless of sidebar
        btn.style.cssText = `
            position: fixed; 
            bottom: 20px; 
            left: 20px; 
            width: 40px; 
            height: 40px;
            background: #111; 
            border: 1px solid #333; 
            border-radius: 50%;
            cursor: pointer; 
            z-index: 999999; 
            font-size: 20px;
            display: flex; justify-content: center; align-items: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        `;
        document.body.appendChild(btn);
    }

    // --- STYLES --- //
    function applyStyles() {
        let style = document.getElementById('tm-tweaks-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'tm-tweaks-style';
            document.head.appendChild(style);
        }

        const css = `
            /* MODAL CSS */
            #tm-tweaks-modal { display: none; position: fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:999999; justify-content:center; align-items:center; }
            .tm-modal-content { background:#0a0a0a; border:1px solid #333; padding:20px; border-radius:8px; width:300px; color:#eee; font-family:sans-serif; }
            .tm-header { display:flex; justify-content:space-between; margin-bottom:15px; }
            .tm-section { border-top:1px solid #333; padding:15px 0; display:flex; flex-direction:column; gap:10px; }
            .tm-color-row { display:flex; justify-content:space-between; align-items:center; }

            /* --- ELEMENT HIDING --- */
            /* Teams: Targets link by href */
            ${config.hideTeams ? `a[href*="/teams"], [aria-label="Teams"] { display: none !important; }` : ''}

            /* KB: Targets by known IDs and text */
            ${config.hideKB ? `
               [data-element-id*="knowledge-base"],
               [aria-label="Knowledge Base"],
               a[href*="/knowledge-base"] 
               { display: none !important; }
            ` : ''}

            /* Prompts: Targets href */
            ${config.hidePrompts ? `a[href*="/prompts"], [data-element-id*="prompt"] { display: none !important; }` : ''}

            /* Audio Button */
            ${config.hideAudio ? `[data-element-id="voice-input-button"], button[aria-label="Voice Input"] { display: none !important; }` : ''}

            /* Profile */
            ${config.hideProfile ? `[data-element-id="workspace-profile-button"] { display: none !important; }` : ''}

            /* --- THEME --- */
            html.dark body, html.dark main, html.dark [data-element-id="response-block"] {
                background-color: #030303 !important;
            }
            .prose.bg-blue-600 { background-color: ${config.userBubbleColor} !important; }

            ${config.enableBorderTheme ? `
                [data-element-id="chat-input-area"] { background: #050505 !important; border: 1px solid ${config.themeColor}50 !important; }
                [data-element-id="new-chat-button-in-side-bar"] { background: transparent !important; border: 1px solid ${config.themeColor} !important; color: ${config.themeColor} !important; }
            ` : ''}
        `;
        style.textContent = css;
    }

    // Run immediately
    createMenuButton();
    applyStyles();
    console.log("🚀 V3.2 Loaded");
})();
