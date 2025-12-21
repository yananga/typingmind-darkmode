/* 
  TypingMind Tweaks V3.7 (Neon Mode)
  - High Visibility Borders + Glow
  - "The Void" Black Theme
  - Robust Hiding & Safe Button
*/

(function() {
    console.log("🚀 V3.7 Neon Mode Starting...");

    // --- 1. SETTINGS & CONFIG --- //
    const STORAGE_KEY = 'TM_TWEAKS_CONFIG';
    const DEFAULT_CONFIG = {
        hideTeams: true, hideKB: true, hideAudio: true, 
        hidePrompts: true, hideProfile: false,
        themeColor: '#3b82f6', 
        userBubbleColor: '#2563eb',
        enableBorderTheme: true
    };
    
    let config = { ...DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };

    function saveConfig() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        updateStyles();
    }

    // --- 2. CSS GENERATOR (High Vis) --- //
    function updateStyles() {
        const styleId = 'tm-tweaks-style';
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }

        // 60% Opacity for Borders (Visible but not solid)
        const borderAlpha = Math.floor(0.6 * 255).toString(16).padStart(2,'0'); 
        
        style.textContent = `
            /* --- MODAL --- */
            #tm-tweaks-modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:99999999; justify-content:center; align-items:center; }
            .tm-modal-content { background:#000; border:1px solid ${config.themeColor}; padding:20px; border-radius:12px; width:320px; color:#fff; font-family:sans-serif; box-shadow: 0 0 50px ${config.themeColor}40; }
            .tm-header { display:flex; justify-content:space-between; margin-bottom:15px; align-items: center; }
            .tm-section { border-top:1px solid #333; padding:15px 0; display:flex; flex-direction:column; gap:8px; }
            .tm-color-row { display:flex; justify-content:space-between; align-items:center; }
            .tm-footer { margin-top:15px; text-align:right; }
            #tm-save-close { background:${config.themeColor}; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; }
            #tm-close-btn { background:none; border:none; color:#666; font-size:24px; cursor:pointer; }

            /* --- HIDING --- */
            ${config.hideAudio ? `[data-element-id="voice-input-button"], button[aria-label="Voice Input"] { display: none !important; }` : ''}
            ${config.hideProfile ? `[data-element-id="workspace-profile-button"] { display: none !important; }` : ''}

            /* --- THEME --- */
            [data-is-user="true"] .prose, .bg-blue-600 { background-color: ${config.userBubbleColor} !important; }

            ${config.enableBorderTheme ? `
                /* 1. NUCLEAR BLACK BACKGROUNDS */
                html.dark body, html.dark main, 
                html.dark [data-element-id="side-bar-body"],
                html.dark [data-element-id="side-bar-nav-rail"],
                html.dark [data-element-id="chat-space-middle-part"],
                html.dark [data-element-id="response-block"],
                html.dark header,
                html.dark .bg-zinc-900, html.dark .bg-gray-900, 
                html.dark .bg-zinc-800, html.dark .bg-gray-800,
                html.dark .bg-white\\/5, html.dark .bg-white\\/10
                {
                    background-color: #000000 !important;
                }

                /* 2. NEON BORDERS (The Fix) */
                
                /* Sidebar Ends (Right Line) */
                [data-element-id="side-bar-body"], [data-element-id="side-bar-nav-rail"] { 
                    border-right: 1px solid ${config.themeColor}${borderAlpha} !important; 
                    box-shadow: 1px 0 10px -5px ${config.themeColor} !important; /* Right Glow */
                }
                
                /* Header (Bottom Line) */
                header, [data-element-id="chat-space-header"] { 
                    border-bottom: 1px solid ${config.themeColor}${borderAlpha} !important; 
                    box-shadow: 0 1px 10px -5px ${config.themeColor} !important; /* Bottom Glow */
                }
                
                /* Input Area (Box) */
                [data-element-id="chat-input-area"] { 
                    background-color: #000 !important; 
                    border: 1px solid ${config.themeColor}${borderAlpha} !important; 
                    border-radius: 8px !important;
                    box-shadow: 0 0 15px -5px ${config.themeColor}40 !important; /* Box Glow */
                }

                /* New Chat Button */
                [data-element-id="new-chat-button-in-side-bar"] {
                    background: transparent !important;
                    border: 1px solid ${config.themeColor} !important;
                    color: ${config.themeColor} !important;
                    box-shadow: 0 0 10px ${config.themeColor}40;
                }
            ` : ''}
        `;
    }

    // --- 3. FLOATING BUTTON & MONITOR --- //
    function createMenuButton() {
        if (document.getElementById('tm-menu-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'tm-menu-btn';
        btn.innerHTML = '⚙️';
        btn.onclick = () => { createModal(); document.getElementById('tm-tweaks-modal').style.display = 'flex'; };
        /* Moved UP to 90px to avoid hiding */
        btn.style.cssText = `
            position: fixed; bottom: 90px; left: 16px; width: 32px; height: 32px;
            background: rgba(0,0,0,0.8); border: 1px solid ${config.themeColor}; border-radius: 50%;
            cursor: pointer; z-index: 9999999; color: ${config.themeColor};
            display: flex; justify-content: center; align-items: center;
            box-shadow: 0 0 10px ${config.themeColor}66;
        `;
        document.body.appendChild(btn);
    }
    
    function createModal() {
        if (document.getElementById('tm-tweaks-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'tm-tweaks-modal';
        modal.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-header"><h2>✨ Tweaks V3.7</h2><button id="tm-close-btn">×</button></div>
                <div class="tm-section">
                    <label><input type="checkbox" id="chk-teams"> Hide Teams</label>
                    <label><input type="checkbox" id="chk-kb"> Hide Knowledge Base</label>
                    <label><input type="checkbox" id="chk-prompts"> Hide Prompt Library</label>
                    <label><input type="checkbox" id="chk-audio"> Hide Audio</label>
                    <label><input type="checkbox" id="chk-profile"> Hide Profile</label>
                </div>
                <div class="tm-section">
                    <label><input type="checkbox" id="chk-border"> Enable "Neon Void" Theme</label>
                    <div class="tm-color-row"><span>Outline</span><input type="color" id="col-theme"></div>
                    <div class="tm-color-row"><span>Bubble</span><input type="color" id="col-user"></div>
                </div>
                <div class="tm-footer"><button id="tm-save-close">Save & Apply</button></div>
            </div>`;
        document.body.appendChild(modal);
        // Bindings
        const close = () => modal.style.display = 'none';
        document.getElementById('tm-close-btn').onclick = close;
        document.getElementById('tm-save-close').onclick = () => { saveConfig(); close(); };
        
        // Load State
        const set = (id, val) => { const el = document.getElementById(id); if(el) el[id.includes('chk')?'checked':'value'] = val; };
        set('chk-teams', config.hideTeams);
        set('chk-kb', config.hideKB);
        set('chk-prompts', config.hidePrompts);
        set('chk-audio', config.hideAudio);
        set('chk-profile', config.hideProfile);
        set('chk-border', config.enableBorderTheme);
        set('col-theme', config.themeColor);
        set('col-user', config.userBubbleColor);

        // Listeners
        const updates = { 
            'chk-teams': 'hideTeams', 'chk-kb': 'hideKB', 'chk-prompts': 'hidePrompts',
            'chk-audio': 'hideAudio', 'chk-profile': 'hideProfile', 'chk-border': 'enableBorderTheme',
            'col-theme': 'themeColor', 'col-user': 'userBubbleColor'
        };
        Object.keys(updates).forEach(id => {
            document.getElementById(id).onchange = (e) => config[updates[id]] = e.target[id.includes('chk')?'checked':'value'];
        });
    }

    function runMonitor() {
        createMenuButton();
        if (config.hideTeams) hideByText('Teams');
        if (config.hideKB) { hideByText('Knowledge Base'); hideByText('KB'); }
        if (config.hidePrompts) { hideByText('List more'); hideByText('Prompts'); }
    }

    function hideByText(text) {
        try {
            const snapshot = document.evaluate(`//*[contains(text(), '${text}')]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < snapshot.snapshotLength; i++) {
                const node = snapshot.snapshotItem(i);
                const container = node.closest('button, a, [role="button"], .group');
                if (container) container.style.display = 'none';
            }
        } catch(e){}
    }

    updateStyles();
    setInterval(runMonitor, 800);
    console.log("🚀 V3.7 Loaded");
})();
