/* 
  TypingMind Tweaks V3.13 (Profile Anchor)
  - Button Inserts ABOVE Profile Picture (High Stability)
  - No Floating Fallback (Forces Bar Integration)
  - Precision Hiding & Clean Theme
*/

(function() {
    console.log("🚀 V3.13 Profile-Anchor Starting...");

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
            /* Hide the container of the voice button */
            body:has([data-element-id="voice-input-button"]) [data-element-id="voice-input-button"] { display: none !important; }
            ${config.hideAudio ? `[data-element-id="voice-input-button"], button[aria-label="Voice Input"] { display: none !important; }` : ''}
            
            /* Hide Profile logic handled by script to avoid breakage */

            /* --- THEME --- */
            [data-is-user="true"] .prose, .bg-blue-600 { background-color: ${config.userBubbleColor} !important; }

            ${config.enableBorderTheme ? `
                html.dark body, html.dark main, 
                html.dark [data-element-id="side-bar-body"],
                html.dark [data-element-id="side-bar-nav-rail"],
                html.dark [data-element-id="chat-space-middle-part"],
                html.dark [data-element-id="response-block"],
                html.dark header,
                html.dark .bg-zinc-900, html.dark .bg-gray-900, 
                html.dark .bg-zinc-800, html.dark .bg-gray-800
                { background-color: #000000 !important; }

                /* Layout Outlines */
                [data-element-id="side-bar-body"], [data-element-id="side-bar-nav-rail"] { border-right: 1px solid ${themeC}${borderAlpha} !important; }
                header, [data-element-id="chat-space-header"] { border-bottom: 1px solid ${themeC}${borderAlpha} !important; }

                /* Content Outlines */
                [data-element-id="chat-input-area"] { background-color: #000 !important; border: 1px solid rgba(255,255,255,0.2) !important; border-radius: 8px !important; }
                [data-element-id="response-block"] > div > div.prose, [data-is-user="true"] .prose { border: 1px solid rgba(255,255,255,0.15) !important; border-radius: 6px !important; padding: 8px 12px !important; }
                
                /* New Chat Button */
                [data-element-id="new-chat-button-in-side-bar"] { background-color: ${config.userBubbleColor} !important; border: 1px solid rgba(255,255,255,0.2) !important; color: #fff !important; }
            ` : ''}
        `;
    }

    // --- BUTTON INJECTION (ANCHOR STRATEGY) --- //
    function injectButton() {
        if (document.getElementById('tm-integrated-btn')) return;

        // TARGET: The User Profile Button
        // It uses data-element-id="workspace-profile-button"
        const profileBtn = document.querySelector('[data-element-id="workspace-profile-button"]');
        
        let targetContainer = null;
        let referenceNode = null;

        if (profileBtn) {
            // Found it! We want to be inside its parent, inserted BEFORE it.
            // Check if profileBtn is wrapped in a div.group
            const wrapper = profileBtn.closest('div.group') || profileBtn.parentElement;
            
            if (wrapper && wrapper.parentElement) {
                targetContainer = wrapper.parentElement;
                referenceNode = wrapper; // Insert BEFORE the profile wrapper
            }
        } else {
            // Fallback: Sidebar Nav Rail (Append to end)
            const rail = document.querySelector('[data-element-id="side-bar-nav-rail"]');
            if(rail) {
                targetContainer = rail;
                referenceNode = null; // Append
            }
        }

        if (targetContainer) {
            const btnDiv = document.createElement('div');
            btnDiv.id = 'tm-integrated-btn';
            btnDiv.className = 'group flex items-center justify-center py-2 cursor-pointer text-gray-400 hover:text-white transition-colors';
            // Mimic the Sidebar Item Structure
            btnDiv.innerHTML = `
                <button style="background:none; border:none; padding:10px; cursor:pointer;" title="Tweaks">
                    <span style="font-size:20px;">✨</span>
                </button>
            `;
            btnDiv.onclick = (e) => {
                e.stopPropagation();
                createModal();
                document.getElementById('tm-tweaks-modal').style.display = 'flex';
            };

            // INJECT
            if (referenceNode) {
                targetContainer.insertBefore(btnDiv, referenceNode);
                console.log("✅ Button injected ABOVE Profile");
            } else {
                targetContainer.appendChild(btnDiv);
                console.log("✅ Button appended to Rail");
            }
        } else {
            console.log("⚠️ Could not find injection target (Profile or Rail)");
        }
    }

    // --- MONITOR --- //
    function runMonitor() {
        injectButton();

        if (config.hideTeams) hideByText('Teams');
        if (config.hideKB) { hideByText('Knowledge Base'); hideByText('KB'); }
        if (config.hidePrompts) { hideByText('List more'); hideByText('Prompts'); }
        if (config.hideProfile) {
             // We can't display:none the profile button directly if we use it as an anchor, 
             // but we can hide the wrapper visually.
             const p = document.querySelector('[data-element-id="workspace-profile-button"]');
             if(p) {
                 const w = p.closest('div.group') || p.parentElement;
                 if(w) w.style.display = 'none';
             }
        }
        
        hideByContent('TypingMind', 'h1, .text-4xl');
        hideByContent('Your AI agents', 'div');
        hideByContent('The best frontend for LLMs', 'div');
    }

    /* --- HELPERS --- */
    function hideByText(text) {
        try {
            const snapshot = document.evaluate(`//*[contains(text(), '${text}')]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < snapshot.snapshotLength; i++) {
                const node = snapshot.snapshotItem(i);
                // Strict interactive targets only
                const container = node.closest('button, a, li[role="button"]');
                if (container) container.style.display = 'none';
            }
        } catch(e){}
    }
    
    function hideByContent(text, selector = '*') {
        try {
            const snapshot = document.evaluate(`//${selector}[contains(text(), '${text}')]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < snapshot.snapshotLength; i++) {
                const node = snapshot.snapshotItem(i);
                if (node && node.parentElement) node.parentElement.style.display = 'none';
            }
        } catch(e){}
    }
    
    function createModal() {
        if (document.getElementById('tm-tweaks-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'tm-tweaks-modal';
        /* (Modal Content Same) */
        modal.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-header"><h2>✨ Tweaks V3.13</h2><button id="tm-close-btn">×</button></div>
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
    console.log("🚀 V3.13 Loaded");
})();
