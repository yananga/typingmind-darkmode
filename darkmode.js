/* 
  TypingMind Tweaks V3.5 (Safe Mode)
  - Floating "Rail-Like" Button (No Conflicts)
  - Instant Theme Application
  - Robust Hiding
*/

(function() {
    console.log("🚀 V3.5 Starting...");

    // --- 1. APPLY CSS IMMEDIATELY (Guarantees Theme Works) --- //
    const styleId = 'tm-tweaks-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
    }
    
    // Default Config (fallback)
    const DEFAULT_CONFIG = {
        hideTeams: true, toggleTeams: true, // Legacy handling
        hideKB: true,
        hideAudio: true,
        hidePrompts: true,
        hideProfile: false,
        themeColor: '#3b82f6', 
        userBubbleColor: '#2563eb',
        enableBorderTheme: true
    };
    
    // --- LOAD CONFIG --- //
    const STORAGE_KEY = 'TM_TWEAKS_CONFIG';
    let config = { ...DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        updateStyles();
        runMonitor();
    }

    // --- 2. THE FLOATING BUTTON (Safe Implementation) --- //
    function createMenuButton() {
        if (document.getElementById('tm-menu-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'tm-menu-btn';
        btn.innerHTML = '⚙️';
        btn.title = 'UI Tweaks Settings';
        
        // POSITON: Fixed to the left rail area, but floating ON TOP
        // Placed slightly above the bottom to avoid covering the "User" or "Settings" if they differ
        btn.style.cssText = `
            position: fixed; 
            bottom: 80px; /* Above standard settings */
            left: 18px;   /* Aligned with rail icons */
            width: 32px; height: 32px;
            background: rgba(0,0,0,0.5); 
            border: 1px solid #333; 
            border-radius: 50%;
            cursor: pointer; 
            z-index: 9999999; /* Highest priority */
            display: flex; justify-content: center; align-items: center;
            font-size: 16px;
            color: #ccc;
            backdrop-filter: blur(4px);
            transition: all 0.2s;
        `;
        
        btn.onmouseenter = () => { btn.style.background = config.themeColor; btn.style.color = '#fff'; };
        btn.onmouseleave = () => { btn.style.background = 'rgba(0,0,0,0.5)'; btn.style.color = '#ccc'; };
        btn.onclick = () => { 
            createSettingsModal(); 
            document.getElementById('tm-tweaks-modal').style.display = 'flex'; 
        };
        
        document.body.appendChild(btn);
    }

    // --- 3. SETTINGS MODAL --- //
    function createSettingsModal() {
        if (document.getElementById('tm-tweaks-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'tm-tweaks-modal';
        modal.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-header"><h2>✨ UI Tweaks</h2><button id="tm-close-btn">×</button></div>
                <div class="tm-scroll-area">
                    <div class="tm-section">
                        <h3>Visibility</h3>
                        <label><input type="checkbox" id="chk-teams"> Hide Teams</label>
                        <label><input type="checkbox" id="chk-kb"> Hide Knowledge Base</label>
                        <label><input type="checkbox" id="chk-prompts"> Hide Prompt Library</label>
                        <label><input type="checkbox" id="chk-audio"> Hide Audio Input</label>
                        <label><input type="checkbox" id="chk-profile"> Hide Profile</label>
                    </div>
                    <div class="tm-section">
                        <h3>The "Void" Theme</h3>
                        <div class="tm-col-opt"><label><input type="checkbox" id="chk-border"> Enable Black + Outlines</label></div>
                        <div class="tm-color-row"><span>Outline Color</span><input type="color" id="col-theme"></div>
                        <div class="tm-color-row"><span>User Bubble</span><input type="color" id="col-user"></div>
                    </div>
                </div>
                <div class="tm-footer"><button id="tm-save-close">Done</button></div>
            </div>`;
        document.body.appendChild(modal);

        const close = () => modal.style.display = 'none';
        document.getElementById('tm-close-btn').onclick = close;
        document.getElementById('tm-save-close').onclick = close;

        const bindChk = (id, key) => {
            const el = document.getElementById(id);
            el.checked = !!config[key];
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

    // --- 4. CSS GENERATOR --- //
    function updateStyles() {
        const style = document.getElementById('tm-tweaks-style');
        if (!style) return;

        const borderAlpha = Math.floor(0.3 * 255).toString(16).padStart(2,'0'); 
        
        style.textContent = `
            #tm-tweaks-modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:99999999; justify-content:center; align-items:center; }
            .tm-modal-content { background:#050505; border:1px solid ${config.themeColor}; padding:20px; border-radius:12px; width:320px; color:#fff; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
            .tm-header { display:flex; justify-content:space-between; margin-bottom:15px; align-items: center; }
            .tm-header h2 { margin:0; font-size: 18px; font-weight: 600; }
            #tm-close-btn { background:none; border:none; color:#666; font-size:24px; cursor:pointer; }
            #tm-close-btn:hover { color:#fff; }
            .tm-section { border-top:1px solid #222; padding:15px 0; display:flex; flex-direction:column; gap:10px; }
            .tm-section h3 { margin:0 0 5px 0; font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#666; }
            .tm-color-row { display:flex; justify-content:space-between; align-items:center; margin-top: 5px; }
            .tm-footer { margin-top:15px; text-align:right; }
            #tm-save-close { background:${config.themeColor}; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; font-weight:500; }
            
            /* --- HIDING RULES (Hard CSS) --- */
            ${config.hideAudio ? `[data-element-id="voice-input-button"], button[aria-label="Voice Input"] { display: none !important; }` : ''}
            ${config.hideProfile ? `[data-element-id="workspace-profile-button"] { display: none !important; }` : ''}
            
            /* --- THEME RULES --- */
            [data-is-user="true"] .prose, .bg-blue-600 { background-color: ${config.userBubbleColor} !important; }
            
            ${config.enableBorderTheme ? `
                /* VOID THEME */
                html.dark body, html.dark main, 
                html.dark [data-element-id="side-bar-body"],
                html.dark [data-element-id="side-bar-nav-rail"],
                html.dark [data-element-id="chat-space-middle-part"],
                html.dark [data-element-id="response-block"],
                html.dark header {
                    background-color: #000000 !important;
                }
                
                /* 1. Sidebar Rail right border */
                [data-element-id="side-bar-nav-rail"] { border-right: 1px solid ${config.themeColor}${borderAlpha} !important; }
                
                /* 2. Chat Header bottom border */
                header, [data-element-id="chat-space-header"] { border-bottom: 1px solid ${config.themeColor}${borderAlpha} !important; }
                
                /* 3. Input Area Box */
                [data-element-id="chat-input-area"] { 
                    background-color: #000 !important; 
                    border: 1px solid ${config.themeColor}${borderAlpha} !important; 
                    border-radius: 8px !important;
                }
                
                /* 4. New Chat Button Outline */
                [data-element-id="new-chat-button-in-side-bar"] {
                    background: transparent !important;
                    border: 1px solid ${config.themeColor} !important;
                    color: ${config.themeColor} !important;
                }
            ` : ''}
        `;
    }

    // --- 5. MONITOR (For dynamic hiding) --- //
    function runMonitor() {
        createMenuButton();

        // Robust Hider for "List more" and others
        if (config.hideTeams) hideByText('Teams');
        if (config.hideKB) { hideByText('Knowledge Base'); hideByText('KB'); }
        if (config.hidePrompts) { 
            hideByText('List more'); // Targets the prompt list specifically
            hideByText('Prompts'); 
        }
    }

    function hideByText(text) {
        try {
            const snapshot = document.evaluate(
                `//*[contains(text(), '${text}')]`,
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
            );
            for (let i = 0; i < snapshot.snapshotLength; i++) {
                const node = snapshot.snapshotItem(i);
                // Try to find the container button or link
                const container = node.closest('button, a, [role="button"], .group');
                if (container) container.style.display = 'none';
            }
        } catch(e) { /* ignore errors */ }
    }

    // --- START --- //
    updateStyles(); // Apply CSS first!
    setInterval(runMonitor, 800); // Check repeatedly
    console.log("🚀 V3.5 Loaded");
})();
