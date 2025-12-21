/* 
  TypingMind Tweaks V3 (The "VS Code" Theme)
  - Settings Dashboard (Persistent)
  - Cyberpunk/Border Aesthetics
  - Element Hiding
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
        themeColor: '#3b82f6', // Default Blue
        userBubbleColor: '#2563eb',
        enableBorderTheme: true // The VS Code Look
    };

    // --- STATE MANAGEMENT --- //
    let config = JSON.parse(localStorage.getItem(STORAGE_KEY)) || DEFAULT_CONFIG;

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        applyStyles();
    }

    // --- UI CREATION --- //
    function createSettingsModal() {
        if (document.getElementById('tm-tweaks-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'tm-tweaks-modal';
        modal.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-header">
                    <h2>✨ UI Tweaks</h2>
                    <button id="tm-close-btn">×</button>
                </div>
                
                <div class="tm-section">
                    <h3>Visibility</h3>
                    <label><input type="checkbox" id="chk-teams"> Hide Teams</label>
                    <label><input type="checkbox" id="chk-kb"> Hide Knowledge Base (All)</label>
                    <label><input type="checkbox" id="chk-audio"> Hide Audio Button</label>
                    <label><input type="checkbox" id="chk-prompts"> Hide Prompt Library</label>
                    <label><input type="checkbox" id="chk-profile"> Hide User Profile</label>
                </div>

                <div class="tm-section">
                    <h3>Aesthetics (VS Code Style)</h3>
                    <label><input type="checkbox" id="chk-border"> Enable "Border" Theme</label>
                    
                    <div class="tm-color-row">
                        <span>New Chat / Border Color</span>
                        <input type="color" id="col-theme">
                    </div>
                    <div class="tm-color-row">
                        <span>User Message Bubble</span>
                        <input type="color" id="col-user">
                    </div>
                </div>

                <div class="tm-footer">
                    <button id="tm-save-close">Done</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Event Listeners
        const close = () => modal.style.display = 'none';
        document.getElementById('tm-close-btn').onclick = close;
        document.getElementById('tm-save-close').onclick = close;
        
        // Bind Inputs
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
        // Wait for sidebar to load
        const interval = setInterval(() => {
            const sidebar = document.querySelector('[data-element-id="side-bar-body"]');
            if (sidebar && !document.getElementById('tm-menu-btn')) {
                const btn = document.createElement('button');
                btn.id = 'tm-menu-btn';
                btn.innerHTML = '⚙️'; // Simple Gear Icon
                btn.title = 'UI Tweaks';
                btn.onclick = () => {
                    createSettingsModal();
                    document.getElementById('tm-tweaks-modal').style.display = 'flex';
                };
                
                // Append to bottom of sidebar (usually usually near settings)
                sidebar.appendChild(btn);
                clearInterval(interval);
            }
        }, 1000);
    }

    // --- CSS INJECTION --- //
    function applyStyles() {
        let style = document.getElementById('tm-tweaks-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'tm-tweaks-style';
            document.head.appendChild(style);
        }

        const borderThemeCSS = `
            /* BORDER THEME (VS CODE STYLE) */
            /* New Chat Button: Outline Only */
            [data-element-id="new-chat-button-in-side-bar"] {
                background-color: transparent !important;
                border: 1px solid ${config.themeColor} !important;
                color: ${config.themeColor} !important;
            }
            [data-element-id="new-chat-button-in-side-bar"]:hover {
                background-color: ${config.themeColor}10 !important; /* 10% opacity fill */
            }

            /* Input Area: Dark box with border */
            [data-element-id="chat-input-area"] {
                background-color: #050505 !important;
                border: 1px solid ${config.themeColor}40 !important; /* 40% opacity border */
                border-radius: 6px !important;
            }
        `;

        const css = `
            /* --- MODAL STYLES --- */
            #tm-tweaks-modal {
                display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.8); z-index: 99999;
                justify-content: center; align-items: center;
            }
            .tm-modal-content {
                background: #111; border: 1px solid #333; padding: 20px;
                border-radius: 8px; width: 300px; color: #eee;
                font-family: sans-serif;
            }
            .tm-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .tm-section { border-top: 1px solid #333; padding: 15px 0; display: flex; flex-direction: column; gap: 8px; }
            .tm-section h3 { margin: 0 0 10px 0; font-size: 14px; opacity: 0.7; }
            .tm-footer { margin-top: 15px; text-align: right; }
            #tm-menu-btn {
                position: absolute; bottom: 20px; right: 20px; /* Floating in sidebar */
                background: none; border: none; font-size: 20px; cursor: pointer; opacity: 0.5;
                z-index: 100;
            }
            #tm-menu-btn:hover { opacity: 1; }
            .tm-color-row { display: flex; justify-content: space-between; align-items: center; }

            /* --- CORE STYLES --- */
            /* User Bubbles */
            .prose.bg-blue-600, .bg-blue-600, .bg-blue-500 {
                background-color: ${config.userBubbleColor} !important;
            }

            /* True Black Backgrounds */
            html.dark body, html.dark main, 
            html.dark [data-element-id="chat-space-middle-part"],
            html.dark [data-element-id="side-bar-body"],
            html.dark [data-element-id="response-block"] {
                background-color: #030303 !important;
            }

            /* --- HIDING ELEMENTS --- */
            ${config.hideTeams ? '[data-element-id="workspace-tab-teams"] { display: none !important; }' : ''}
            ${config.hideKB ? '[data-element-id="workspace-tab-knowledge-base"], [data-element-id="toggle-kb-button"] { display: none !important; }' : ''}
            ${config.hideAudio ? '[data-element-id="voice-input-button"], button[aria-label="Voice Input"] { display: none !important; }' : ''}
            /* Hiding Prompt Library (The List More button) */
            ${config.hidePrompts ? '.group\\/prompt-library-button, [data-element-id="prompt-library-button"] { display: none !important; }' : ''}
            ${config.hideProfile ? '[data-element-id="workspace-profile-button"] { display: none !important; }' : ''}

            /* --- CONDITIONAL THEME --- */
            ${config.enableBorderTheme ? borderThemeCSS : ''}
        `;

        style.textContent = css;
    }

    // --- INITIALIZATION --- //
    createMenuButton();
    applyStyles();
    console.log("🚀 TypingMind V3 (VS Code Theme) Loaded");
})();
