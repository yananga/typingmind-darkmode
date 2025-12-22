/* 
  TypingMind Tweaks V3.11 (Precision Mode)
  - Fixed "Disappearing Sidebar" Bug
  - Solid "New Chat" Button
  - Native Settings Injection
  - "Schematic" Outlines
*/

(function() {
    console.log("🚀 V3.11 Precision Starting...");

    // --- CONFIG --- //
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

    // --- CSS GENERATOR --- //
    function updateStyles() {
        const styleId = 'tm-tweaks-style';
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }

        const themeC = config.themeColor;
        const borderAlpha = Math.floor(0.6 * 255).toString(16).padStart(2,'0'); 
        
        style.textContent = `
            /* --- MODAL --- */
            #tm-tweaks-modal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:99999999; justify-content:center; align-items:center; }
            .tm-modal-content { background:#000; border:1px solid ${themeC}; padding:20px; border-radius:12px; width:320px; color:#fff; font-family:sans-serif; box-shadow: 0 0 50px ${themeC}40; }
            .tm-header { display:flex; justify-content:space-between; margin-bottom:15px; align-items: center; }
            .tm-section { border-top:1px solid #333; padding:15px 0; display:flex; flex-direction:column; gap:8px; }
            .tm-footer { margin-top:15px; text-align:right; }
            #tm-save-close { background:${themeC}; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; }
            #tm-close-btn { background:none; border:none; color:#666; cursor:pointer; font-size: 24px;}

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
                html.dark .bg-zinc-800, html.dark .bg-gray-800
                {
                    background-color: #000000 !important;
                }

                /* 2. LAYOUT OUTLINES */
                [data-element-id="side-bar-body"], [data-element-id="side-bar-nav-rail"] { 
                    border-right: 1px solid ${themeC}${borderAlpha} !important; 
                }
                header, [data-element-id="chat-space-header"] { 
                    border-bottom: 1px solid ${themeC}${borderAlpha} !important; 
                }

                /* 3. CONTENT OUTLINES (Fixed) */
                [data-element-id="chat-input-area"] { 
                    background-color: #000 !important; 
                    border: 1px solid rgba(255,255,255,0.2) !important; 
                    border-radius: 8px !important;
                }
                [data-element-id="response-block"] > div > div.prose,
                [data-is-user="true"] .prose {
                    border: 1px solid rgba(255,255,255,0.15) !important;
                    border-radius: 6px !important;
                    padding: 8px 12px !important; 
                }
                
                /* 4. NEW CHAT BUTTON (Solid Match) */
                [data-element-id="new-chat-button-in-side-bar"] {
                    background-color: ${config.userBubbleColor} !important;
                    border: 1px solid rgba(255,255,255,0.2) !important;
                    color: #fff !important;
                }
                [data-element-id="new-chat-button-in-side-bar"]:hover {
                    filter: brightness(1.2);
                }
            ` : ''}
        `;
    }

    // --- BUTTON INJECTION --- //
    function updateRailButton() {
        if (document.getElementById('tm-integrated-btn')) return;

        // Try to find Settings to anchor
        // We look for text OR typical aria labels
        const settingsBtn = findElementByText('Settings') || findElementByText('Preferences');
        
        let targetParent = null;
        let insertBefore = false;

        if (settingsBtn) {
            // Anchor after settings
            targetParent = settingsBtn.closest('div.group') || settingsBtn.parentElement;
        } 
        
        if (!targetParent) {
            // Fallback: Use the profile button
            const profile = document.querySelector('[data-element-id="workspace-profile-button"]');
            if (profile) {
                targetParent = profile.closest('div') || profile.parentElement;
                insertBefore = true; // Put BEFORE profile if we can't find settings
            }
        }

        // Final Fallback: The Rail itself
        const rail = document.querySelector('[data-element-id="side-bar-nav-rail"]');

        // Create Button
        const wrapper = document.createElement('div');
        wrapper.id = 'tm-integrated-btn';
        wrapper.className = 'flex items-center justify-center py-2 mt-1 cursor-pointer group';
        
        const btn = document.createElement('button');
        btn.innerHTML = '⚙️'; 
        btn.className = 'text-gray-400 hover:text-white transition-colors';
        btn.style.cssText = 'background:none; border:none; font-size:20px; opacity:0.8;';
        btn.onclick = (e) => {
            e.stopPropagation();
            createModal();
            document.getElementById('tm-tweaks-modal').style.display = 'flex';
        };
        wrapper.appendChild(btn);

        // Inject
        if (targetParent && targetParent.parentElement && !rail) {
            // We found a specific item (Settings), insert relative to it
            // NOTE: If we insert INSIDE the rail list container
            if (insertBefore) {
                targetParent.parentElement.insertBefore(wrapper, targetParent);
            } else {
                targetParent.parentElement.insertBefore(wrapper, targetParent.nextSibling);
            }
        } else if (rail) {
            // Just append to rail
            // Try to put it before the last item (Profile usually) if possible
            if (rail.children.length > 1) {
                rail.insertBefore(wrapper, rail.lastElementChild); 
            } else {
                rail.appendChild(wrapper);
            }
        }
    }

    // --- MONITOR --- //
    function runMonitor() {
        updateRailButton();

        if (config.hideTeams) hideByText('Teams');
        if (config.hideKB) { hideByText('Knowledge Base'); hideByText('KB'); }
        if (config.hidePrompts) { hideByText('List more'); hideByText('Prompts'); }
        
        hideByContent('TypingMind', 'h1, .text-4xl');
        hideByContent('Your AI agents', 'div');
        hideByContent('The best frontend for LLMs', 'div');
    }

    // --- HELPERS (Fixed Selector) --- //
    function hideByText(text) {
        try {
            const snapshot = document.evaluate(`//*[contains(text(), '${text}')]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < snapshot.snapshotLength; i++) {
                const node = snapshot.snapshotItem(i);
                // REMOVED .group from selector to avoid hiding parent containers
                const container = node.closest('button, a, li, [role="button"]');
                if (container) container.style.display = 'none';
            }
        } catch(e){}
    }
    
    function findElementByText(text) {
        const snapshot = document.evaluate(
            `//*[contains(text(), '${text}')] | //*[@aria-label='${text}']`,
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        );
        return snapshot.singleNodeValue;
    }

    function hideByContent(text, selector = '*') {
        try {
            const snapshot = document.evaluate(`//${selector}[contains(text(), '${text}')]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < snapshot.snapshotLength; i++) {
                const node = snapshot.snapshotItem(i);
                if (node) {
                     let p = node.parentElement;
                     if(p) p.style.display = 'none';
                }
            }
        } catch(e){}
    }
    
    function createModal() {
        if (document.getElementById('tm-tweaks-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'tm-tweaks-modal';
        /* ... (Same Modal HTML) ... */
        modal.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-header"><h2>✨ Tweaks V3.11</h2><button id="tm-close-btn">×</button></div>
                <div class="tm-section">
                    <label><input type="checkbox" id="chk-teams"> Hide Teams</label>
                    <label><input type="checkbox" id="chk-kb"> Hide Knowledge Base</label>
                    <label><input type="checkbox" id="chk-prompts"> Hide Prompt Library</label>
                    <label><input type="checkbox" id="chk-audio"> Hide Audio</label>
                    <label><input type="checkbox" id="chk-profile"> Hide Profile</label>
                </div>
                <div class="tm-section">
                    <label><input type="checkbox" id="chk-border"> Enable "Schematic" Theme</label>
                    <div class="tm-color-row"><span>Accent</span><input type="color" id="col-theme"></div>
                    <div class="tm-color-row"><span>Bubble</span><input type="color" id="col-user"></div>
                </div>
                <div class="tm-footer"><button id="tm-save-close">Save & Apply</button></div>
            </div>`;
        document.body.appendChild(modal);

        const close = () => modal.style.display = 'none';
        document.getElementById('tm-close-btn').onclick = close;
        document.getElementById('tm-save-close').onclick = () => { saveConfig(); close(); };
        
        const load = (id, k) => { const el = document.getElementById(id); if(el) el[id.includes('chk')?'checked':'value'] = config[k]; };
        load('chk-teams','hideTeams'); load('chk-kb','hideKB'); 
        load('chk-prompts','hidePrompts'); load('chk-audio','hideAudio');
        load('chk-profile','hideProfile'); load('chk-border','enableBorderTheme');
        load('col-theme','themeColor'); load('col-user','userBubbleColor');

        const bind = (id, k) => { const el = document.getElementById(id); if(el) el.onchange = (e) => config[k] = e.target[id.includes('chk')?'checked':'value']; };
        bind('chk-teams','hideTeams'); bind('chk-kb','hideKB');
        bind('chk-prompts','hidePrompts'); bind('chk-audio','hideAudio');
        bind('chk-profile','hideProfile'); bind('chk-border','enableBorderTheme');
        bind('col-theme','themeColor'); bind('col-user','userBubbleColor');
    }

    updateStyles();
    setInterval(runMonitor, 800);
    console.log("🚀 V3.11 Loaded");
})();
