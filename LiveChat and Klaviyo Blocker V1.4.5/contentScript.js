// contentScript.js

function toggleElements(hide) {
    const selectors = [
        "#chat-widget-minimized",
        "#chat-widget-container",
        '[role="dialog"][aria-label="FLYOUT Form"]',
    ];

    selectors.forEach((selector) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = hide ? "none" : "";
        }
    });
}

// Monitor for dynamically added elements and re-apply toggles
function observeMutations(hide) {
    const observer = new MutationObserver(() => {
        toggleElements(hide);
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Optionally, we can automatically apply + observe on page load:
(function init() {
    // If you always want to hide by default, call them right away:
    toggleElements(true);
    observeMutations(true);
})();

// If you prefer toggling on/off from background or popup, then
// you can also listen for messages from background:
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleElements") {
        toggleElements(request.hide);
        sendResponse({ success: true });
    }
});