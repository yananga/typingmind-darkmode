/* true-dark-mode.js */
(function() {
  const css = `
    /* Force Pure Black Backgrounds */
    html.dark body, 
    html.dark main, 
    html.dark [data-element-id="chat-space-middle-part"],
    html.dark [data-element-id="side-bar-body"],
    html.dark [data-element-id="response-block"],
    html.dark .prose {
        background-color: #000000 !important;
    }
    
    /* Input Area */
    html.dark [data-element-id="chat-input-area"] {
        background-color: #000000 !important;
        border-top: 1px solid #222 !important;
    }
  `;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
  console.log("🌑 True Dark Mode Loaded");
})();
