/* 
  TypingMind Ultimate Dark Mode + UI Tweaks
  Merged & Customized
*/

(function() {
    // --- ⚙️ CONFIGURATION ⚙️ --- //
    const CONFIG = {
        // Colors
        newChatButtonColor: '#2563eb', // Change this hex code (e.g. #ff0000 for red)
        
        // Hiding Feature (Set to true/false)
        hideTeams: true,
        hideKnowledgeBase: true,    // Hides both the Sidebar Tab and the Toggle Button
        hideLogo: true,             // Hides the "TypingMind" logo in sidebar
        hideProfile: true,          // Hides the User Profile button
        hidePinnedCharacters: true, // Hides the characters list in new chat
    };

    // --- 🔧 THE LOGIC (Do not edit below) --- //
    const css = `
        /* --- 1. TRUE DARK MODE --- */
        html.dark body, html.dark main, 
        html.dark [data-element-id="chat-space-middle-part"],
        html.dark [data-element-id="side-bar-body"],
        html.dark [data-element-id="response-block"],
        html.dark .prose {
            background-color: #000000 !important;
        }
        html.dark [data-element-id="chat-input-area"] {
            background-color: #000000 !important;
            border-top: 1px solid #222 !important;
        }

        /* --- 2. UI TWEAKS --- */
        /* Hide Teams */
        ${CONFIG.hideTeams ? '[data-element-id="workspace-tab-teams"] { display: none !important; }' : ''}
        
        /* Hide Knowledge Base (Sidebar + Toggle) */
        ${CONFIG.hideKnowledgeBase ? `
            [data-element-id="workspace-tab-knowledge-base"],
            [data-element-id="toggle-kb-button"] { display: none !important; }
        ` : ''}

        /* Hide Logo */
        ${CONFIG.hideLogo ? '[data-element-id="side-bar-body"] img[src*="logo"] { display: none !important; }' : ''}
        
        /* Hide Profile */
        ${CONFIG.hideProfile ? '[data-element-id="workspace-profile-button"] { display: none !important; }' : ''}
        
        /* Hide Pinned Characters */
        ${CONFIG.hidePinnedCharacters ? '[data-element-id="pinned-characters-container"] { display: none !important; }' : ''}

        /* Custom New Chat Button Color */
        [data-element-id="new-chat-button-in-side-bar"] {
            background-color: ${CONFIG.newChatButtonColor} !important;
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    
    console.log("🚀 TypingMind Ultimate Tweaks Loaded");
})();
