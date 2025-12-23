/* 
  TypingMind Tweaks V3.18 (Minimal)
  - Hardcoded: Hide Teams, KB, Audio
  - Theme: "Void" (Black) + Schematic Borders
  - Colors: Light Blue Bubbles & New Chat Button
  - NO Settings Button
*/

(function() {
    console.log("🚀 V3.18 Minimal Starting...");

    const THEME_COLOR = '#3b82f6'; // Light Blue
    const BUBBLE_COLOR = '#2563eb';

    // --- INJECT STYLES --- //
    const style = document.createElement('style');
    style.id = 'tm-tweaks-style';
    style.textContent = `
        /* --- HIDING --- */
        button[data-element-id="workspace-tab-teams"],
        button[data-element-id="voice-input-button"],
        button[aria-label="Voice Input"],
        button[data-element-id="toggle-kb-button"]
        { display: none !important; }

        /* --- VOID THEME (Pure Black) --- */
        html.dark body, 
        html.dark main, 
        html.dark [data-element-id="side-bar-body"],
        html.dark [data-element-id="side-bar-nav-rail"],
        html.dark [data-element-id="chat-space-middle-part"],
        html.dark [data-element-id="response-block"],
        html.dark header,
        html.dark .bg-zinc-900, 
        html.dark .bg-gray-900,
        html.dark .bg-zinc-800,
        html.dark .bg-gray-800
        { background-color: #000000 !important; }

        /* --- SCHEMATIC BORDERS --- */
        [data-element-id="side-bar-body"], 
        [data-element-id="side-bar-nav-rail"] { 
            border-right: 1px solid ${THEME_COLOR}99 !important; 
        }
        header, [data-element-id="chat-space-header"] { 
            border-bottom: 1px solid ${THEME_COLOR}99 !important; 
        }
        [data-element-id="chat-input-area"] { 
            background-color: #000 !important; 
            border: 1px solid rgba(255,255,255,0.2) !important; 
            border-radius: 8px !important; 
        }
        
        /* Content Outlines */
        [data-element-id="response-block"] > div > div.prose { 
            border: 1px solid rgba(255,255,255,0.1) !important; 
            border-radius: 6px !important; 
            padding: 8px 12px !important; 
        }
        [data-is-user="true"] .prose { 
            border: 1px solid rgba(255,255,255,0.2) !important; 
            border-radius: 6px !important; 
        }

        /* --- COLORS --- */
        /* User Bubble */
        [data-is-user="true"] .prose, 
        .bg-blue-600 { 
            background-color: ${BUBBLE_COLOR} !important; 
        }
        
        /* New Chat Button */
        [data-element-id="new-chat-button-in-side-bar"] { 
            background-color: ${BUBBLE_COLOR} !important; 
            border: 1px solid rgba(255,255,255,0.2) !important; 
            color: #fff !important; 
        }
    `;
    document.head.appendChild(style);

    // --- HIDE KB TEXT (XPath for dynamic elements) --- //
    function hideKB() {
        try {
            const snapshot = document.evaluate(
                "//*[contains(text(), 'KB') or contains(text(), 'Knowledge Base')]", 
                document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
            );
            for (let i = 0; i < snapshot.snapshotLength; i++) {
                const node = snapshot.snapshotItem(i);
                const btn = node.closest('button');
                if (btn) btn.style.display = 'none';
            }
        } catch(e){}
    }

    // Run on mutations (for SPA reloads)
    const observer = new MutationObserver(hideKB);
    observer.observe(document.body, { childList: true, subtree: true });
    
    setTimeout(hideKB, 500);
    console.log("✅ V3.18 Minimal Loaded");
})();
