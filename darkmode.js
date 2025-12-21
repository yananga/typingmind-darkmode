/* 
  TypingMind Ultimate Tweaks v2
  - True Black Answers
  - Custom UI Hiding
  - Custom Colors
*/

(function() {
    // --- ⚙️ CONFIGURATION ⚙️ --- //
    const CONFIG = {
        // Color Settings
        newChatButtonColor: '#2563eb', // Your Blue
        
        // Hiding Features (Set to true/false)
        hideTeams: true,
        hideKnowledgeBase: true,
        hideLogo: true,
        hideProfile: true,
        hidePinnedCharacters: true,
        
        // NEW Features
        hideAudioMessageButton: true,   // Hides the microphone icon in input
        hideDefaultPrompts: true,       // Hides the "Suggestions" list in empty chat
    };

    // --- 🔧 THE LOGIC --- //
    const css = `
        /* --- 1. TRUE BLACK ANSWERS ONLY --- */
        /* Only target the AI response block */
        html.dark [data-element-id="response-block"],
        html.dark .prose {
            background-color: #000000 !important;
        }
        
        /* Optional: Keep Input Area Darker if you like, or delete this block to match page grey */
        html.dark [data-element-id="chat-input-area"] {
            background-color: #000000 !important; 
            border-top: 1px solid #333 !important;
        }

        /* --- 2. UI TWEAKS --- */
        /* Hide Teams */
        ${CONFIG.hideTeams ? '[data-element-id="workspace-tab-teams"] { display: none !important; }' : ''}
        
        /* Hide Knowledge Base */
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

        /* Hide Audio Button */
        ${CONFIG.hideAudioMessageButton ? `
            [data-element-id="voice-input-button"],
            button[aria-label="Voice Input"] { display: none !important; }
        ` : ''}

        /* Hide Default Prompts (Suggestions) */
        ${CONFIG.hideDefaultPrompts ? `
            [data-element-id="chat-suggestions"], 
            [data-element-id="empty-chat-suggestions-container"] { display: none !important; }
        ` : ''}

        /* Custom New Chat Button Color */
        [data-element-id="new-chat-button-in-side-bar"] {
            background-color: ${CONFIG.newChatButtonColor} !important;
        }
    `;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
    
    console.log("🚀 TypingMind Tweaks v2 Loaded");
})();
