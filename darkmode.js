/* 
  TypingMind Tweaks V3.3 (Live Monitor Edition)
  - MutationObserver for Robust Hiding
  - Auto-Reinjecting Sidebar Button
  - "All Black + Outlines" Theme
*/

(function() {
    console.log("🚀 V3.3 Monitor Starting...");

    // --- CONFIG --- //
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
        applyStyles(); // Re-run styles
        runLiveChecks(); // Re-run hiding logic
    }

    // --- UI: SETTINGS MODAL --- //
    function createSettingsModal() {
        if (document.getElementById('tm-tweaks-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'tm-tweaks-modal';
        modal.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-header"><h2>✨ UI Tweaks</h2><button id="tm-close-btn">×</button></div>
                
                <div class="tm-section">
                    <h3>Visibility (Live)</h3>
                    <label><input type="checkbox" id="chk-teams"> Hide Teams</label>
                    <label><input type="checkbox" id="chk-kb"> Hide Knowledge Base</label>
                    <label><input type="checkbox" id="chk-prompts"> Hide Prompt Library</label>
                    <label><input type="checkbox" id="chk-audio"> Hide Audio Button</label>
                    <label><input type="checkbox" id="chk-profile"> Hide Profile</label>
                </div>

                <div class="tm-section">
                    <h3>The "Outline" Theme</h3>
                    <div class="tm-col-opt"><label><input type="checkbox" id="chk-border"> Enable All Low-Light + Outlines</label></div>
                    <div class="tm-color-row"><span>Outline Color</span><input type="color" id="col-theme"></div>
                    <div class="tm-color-row"><span>User Bubble</span><input type="color" id="col-user"></div>
                </div>
                <div class="tm-footer"><button id="tm-save-close">Done</button></div>
            </div>`;
        document.body.appendChild(modal);

        // Logic
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

    // --- LOGIC: THE LIVE MONITOR --- //
    function runLiveChecks() {
        // 1. Re-Inject Menu Button if missing (but sidebar exists)
        const sidebar = document.querySelector('[data-element-id="side-bar-body"]');
        const existingBtn = document.getElementById('tm-menu-btn');
        
        if (sidebar && !existingBtn) {
            const btn = document.createElement('button');
            btn.id = 'tm-menu-btn';
            btn.innerHTML = '⚙️';
            btn.title = 'UI Tweaks';
            btn.onclick = () => { createSettingsModal(); document.getElementById('tm-tweaks-modal').style.display = 'flex'; };
            // Style it to look integrated but float safely
            btn.style.cssText = `
                position: absolute; bottom: 10px; right: 10px;
                background: none; border: none; font-size: 20px; 
                cursor: pointer; opacity: 0.6; z-index: 50; 
                filter: grayscale(100%) brightness(200%);
            `;
            sidebar.appendChild(btn); 
        }

        // 2. Hide Elements (by Text Content - Very Robust)
        if (config.hideTeams) hideByText('Teams');
        if (config.hideKB) { hideByText('Knowledge Base'); hideByText('KB'); }
        if (config.hidePrompts) { hideByText('Prompts'); }
    }

    // Helper to find and hide buttons/links by text
    function hideByText(text) {
        // Xpath to find element containing text
        const snapshot = document.evaluate(
            `//*[contains(text(), '${text}')]`,
            document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
        );
        
        for (let i = 0; i < snapshot.snapshotLength; i++) {
            const node = snapshot.snapshotItem(i);
            // Walk up to find the clickable container (button or a)
            const container = node.closest('button, a, [role="button"]');
            if (container) container.style.display = 'none';
        }
    }

    // --- CSS STYLES --- //
    function applyStyles() {
        let style = document.getElementById('tm-tweaks-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'tm-tweaks-style';
            document.head.appendChild(style);
        }

        const css = `
            #tm-tweaks-modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:999999; justify-content:center; align-items:center; }
            .tm-modal-content { background:#0a0a0a; border:1px solid #333; padding:20px; border-radius:8px; width:300px; color:#fff; font-family:sans-serif; }
            .tm-header { display:flex; justify-content:space-between; margin-bottom:15px; }
            .tm-section { border-top:1px solid #333; padding:15px 0; display:flex; flex-direction:column; gap:8px; }
            .tm-color-row { display:flex; justify-content:space-between; align-items:center; }
            .tm-footer { margin-top:15px; text-align:right; }

            /* Audio Button (Hard Select) */
            ${config.hideAudio ? `[data-element-id="voice-input-button"], button[aria-label="Voice Input"] { display: none !important; }` : ''}
            
            /* Profile */
            ${config.hideProfile ? `[data-element-id="workspace-profile-button"] { display: none !important; }` : ''}

            /* --- THEME LOGIC --- */
            /* Force User Bubble Color */
            [data-is-user="true"] .prose, 
            .bg-blue-600, .bg-blue-500 { 
                background-color: ${config.userBubbleColor} !important; 
            }

            ${config.enableBorderTheme ? `
                /* ALL BLACK BACKGROUNDS */
                html.dark body, html.dark main, 
                html.dark [data-element-id="side-bar-body"],
                html.dark [data-element-id="chat-space-middle-part"],
                html.dark [data-element-id="response-block"] {
                    background-color: #000000 !important;
                }

                /* OUTLINES */
                /* Sidebar: Right Border */
                [data-element-id="side-bar-body"] {
                    border-right: 1px solid ${config.themeColor}33 !important; /* 33 = 20% opacity */
                }

                /* Header: Bottom Border */
                header, [data-element-id="chat-space-header"] {
                    border-bottom: 1px solid ${config.themeColor}33 !important;
                }

                /* Input: Box Border */
                [data-element-id="chat-input-area"] {
                    background-color: #000000 !important;
                    border: 1px solid ${config.themeColor}66 !important; /* 66 = 40% opacity */
                    border-radius: 8px !important;
                }

                /* New Chat Button: Outline */
                [data-element-id="new-chat-button-in-side-bar"] {
                    background: transparent !important;
                    border: 1px solid ${config.themeColor} !important;
                    color: ${config.themeColor} !important;
                }
            ` : ''}
        `;
        style.textContent = css;
    }

    // --- START THE MONITOR --- //
    applyStyles();
    
    // Check every 500ms for changes (Sidebar reload, new elements)
    setInterval(() => {
        runLiveChecks();
    }, 500);

    console.log("🚀 V3.3 Alive");
})();
