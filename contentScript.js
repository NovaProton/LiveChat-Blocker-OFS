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

function observeMutations(hide) {
    const observer = new MutationObserver(() => {
        toggleElements(hide);
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function applyAndObserve(hide) {
    toggleElements(hide);
    observeMutations(hide);
}

// Optionally, listen for messages from the background script
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "toggleElements") {
        toggleElements(request.hide);
    }
});
