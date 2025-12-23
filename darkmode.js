/* 
  TypingMind Tweaks V3.17 (Force Visibility)
  - Button: Hardcoded White/Visible (No more hiding)
  - Layout: Aggressive "Nuclear" CSS for Full Width
  - Injection: "Original Method" (Before Settings)
*/

(function() {
    console.log("🚀 V3.17 Starting...");

    // --- CONFIG --- //
    const STORAGE_KEY = 'TM_TWEAKS_CONFIG';
    const DEFAULT_CONFIG = {
        hideTeams: true, hideKB: true, hideAudio: true, 
        hidePrompts: true, hideProfile: false,
        themeColor: '#3b82f6', 
        userBubbleColor: '#2563eb',
        enableBorderTheme: true,
        enableCenterLayout: true
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
            body:has([data-element-id="voice-input-button"]) [data-element-id="voice-input-button"] { display: none !important; }
            ${config.hideAudio ? `[data-element-id="voice-input-button"], button[aria-label="Voice Input"] { display: none !important; }` : ''}
            
            /* --- THEME --- */
            [data-is-user="true"] .prose, .bg-blue-600 { background-color: ${config.userBubbleColor} !important; }

            ${config.enableBorderTheme ? `
                html.dark body, html.dark main, 
                html.dark [data-element-id="side-bar-body"],
                html.dark [data-element-id="side-bar-nav-rail"],
                html.dark header,
                html.dark .bg-zinc-900, html.dark .bg-gray-900
                { background-color: #000000 !important; }

                [data-element-id="side-bar-body"], [data-element-id="side-bar-nav-rail"] { border-right: 1px solid ${themeC}${borderAlpha} !important; }
                header, [data-element-id="chat-space-header"] { border-bottom: 1px solid ${themeC}${borderAlpha} !important; }
                [data-element-id="chat-input-area"] { background-color: #000 !important; border: 1px solid rgba(255,255,255,0.2) !important; border-radius: 8px !important; }
                [data-element-id="response-block"] > div > div.prose, [data-is-user="true"] .prose { border: 1px solid rgba(255,255,255,0.15) !important; border-radius: 6px !important; padding: 8px 12px !important; }
            ` : ''}

            /* --- CENTER LAYOUT (NUCLEAR) --- */
            ${config.enableCenterLayout ? `
                /* 1. USER Messaages */
                [data-is-user="true"] {
                    display: flex !important;
                    flex-direction: column-reverse !important; /* Avatar below text? Or column for above? Let's try column to put avatar on top first, or check structure. Usually avatar is first child. */
                    align-items: center !important;
                }
                /* Wrapper for Avatar */
                [data-is-user="true"] > .flex-shrink-0 { 
                    margin: 0 0 10px 0 !important;
                }
                /* Wrapper for Bubble */
                [data-is-user="true"] > .relative, 
                [data-is-user="true"] .prose, 
                [data-is-user="true"] .w-full {
                    width: 100% !important;
                    max-width: 100% !important;
                }

                /* 2. AI Messages */
                /* Forces the container of the AI response to stack */
                [data-element-id="chat-space-middle-part"] .group.w-full.text-gray-800,
                [data-element-id="chat-space-middle-part"] .group.w-full.dark\\:text-gray-100 {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                }
                /* AI Avatar Wrapper */
                [data-element-id="chat-space-middle-part"] .group > .flex-shrink-0 {
                    margin: 0 0 10px 0 !important;
                }
                /* AI Response Block */
                [data-element-id="response-block"] {
                    width: 100% !important;
                    max-width: 100% !important;
                }
                [data-element-id="response-block"] .prose {
                    max-width: 100% !important;
                }
            ` : ''}
        `;
    }

    // --- HELPERS --- //
    function hideByText(text) {
        try {
            const snapshot = document.evaluate(`//*[contains(text(), '${text}')]`, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < snapshot.snapshotLength; i++) {
                const snapshotItem = snapshot.snapshotItem(i);
                if(snapshotItem) {
                     const container = snapshotItem.closest('button, a, li[role="button"]');
                     if (container) container.style.display = 'none';
                }
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

    // --- MAIN --- //
    function applyTweaks() {
        if (!document.querySelector('div[data-element-id="workspace-bar"]')) return;

        // Apply Hiding
        if (config.hideTeams) hideByText('Teams');
        if (config.hideKB) { hideByText('Knowledge Base'); hideByText('KB'); }
        if (config.hidePrompts) { hideByText('List more'); hideByText('Prompts'); }
        hideByContent('TypingMind', 'h1, .text-4xl');

        // Button Injection
        let tweaksButton = document.getElementById("workspace-tab-tweaks");
        const settingsButton = document.querySelector('button[data-element-id="workspace-tab-settings"]');
        
        if (!tweaksButton && settingsButton) {
            tweaksButton = document.createElement("button");
            tweaksButton.id = "workspace-tab-tweaks";
            tweaksButton.title = "Tweaks";
            
            // --- FORCE VISIBILITY ---
            // We do NOT rely on class cloning for visibility anymore
            tweaksButton.className = "flex items-center justify-center w-full h-10 mt-1 cursor-pointer hover:opacity-80"; 
            tweaksButton.style.cssText = `
                color: white !important;
                border: 1px solid rgba(255,255,255,0.3) !important;
                border-radius: 8px;
                background: transparent;
                display: flex;
                justify-content: center;
                align-items: center;
            `;

            tweaksButton.innerHTML = `<span style="font-size: 1.2rem;">✨</span>`;
            
            tweaksButton.onclick = (e) => {
                e.preventDefault(); e.stopPropagation();
                createModal();
                document.getElementById('tm-tweaks-modal').style.display = 'flex';
            };

            settingsButton.parentNode.insertBefore(tweaksButton, settingsButton);
            console.log("✅ Button Injected (Forced Visible)");
        }
    }

    /* --- MODAL --- */
    function createModal() {
        if (document.getElementById('tm-tweaks-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'tm-tweaks-modal';
        modal.innerHTML = `
            <div class="tm-modal-content">
                <div class="tm-header"><h2>✨ Tweaks V3.17</h2><button id="tm-close-btn">×</button></div>
                <div class="tm-section">
                    <label><input type="checkbox" id="chk-teams"> Hide Teams</label>
                    <label><input type="checkbox" id="chk-kb"> Hide KB</label>
                    <label><input type="checkbox" id="chk-prompts"> Hide Prompts</label>
                    <label><input type="checkbox" id="chk-audio"> Hide Audio</label>
                </div>
                <div class="tm-section">
                    <label><input type="checkbox" id="chk-border"> Enable "Schematic" Theme</label>
                    <label><input type="checkbox" id="chk-center"> <b>Enable Center Layout</b></label>
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
        load('chk-border','enableBorderTheme'); load('chk-center','enableCenterLayout');
        load('col-theme','themeColor'); load('col-user','userBubbleColor');

        const bind = (id, k) => { const el = document.getElementById(id); if(el) el.onchange = (e) => config[k] = e.target[id.includes('chk')?'checked':'value']; };
        bind('chk-teams','hideTeams'); bind('chk-kb','hideKB');
        bind('chk-prompts','hidePrompts'); bind('chk-audio','hideAudio');
        bind('chk-border','enableBorderTheme'); bind('chk-center','enableCenterLayout');
        bind('col-theme','themeColor'); bind('col-user','userBubbleColor');
    }

    updateStyles();
    const observer = new MutationObserver(() => applyTweaks());
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(applyTweaks, 500); 
    console.log("🚀 V3.17 Loaded");
})();
