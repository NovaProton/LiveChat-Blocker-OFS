let hideElements = true; // Default state

// Set initial badge and state on installation
chrome.runtime.onInstalled.addListener(() => {
  hideElements = true;
  updateBadge(hideElements);
});

// Helper function: Validate if the URL is valid for our extension
function isValidUrl(url) {
  return typeof url === "string" && url.includes("oakfurnituresuperstore.co.uk");
}

// Helper function: Update badge based on the current state
function updateBadge(isHidden) {
  const badgeColor = isHidden ? "green" : "red";
  const badgeText = isHidden ? "ON" : "OFF";
  chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  chrome.action.setBadgeText({ text: badgeText });
}

// Function to toggle visibility of elements
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

// Apply and observe toggles
function applyAndObserve(hide) {
  toggleElements(hide); // Apply toggle immediately
  observeMutations(hide); // Start monitoring for changes
}

// Inject the script to apply and observe element toggles
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.includes("oakfurnituresuperstore.co.uk")) {
    chrome.scripting.executeScript({
      target: { tabId },
      function: applyAndObserve,
      args: [true], // Apply hiding
    });
  }
});

// Function to monitor for dynamically added elements
function observeMutations(hide) {
  const observer = new MutationObserver(() => {
    toggleElements(hide); // Reapply visibility settings when DOM changes
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Apply the current state when a relevant tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && isValidUrl(tab.url)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: toggleElements,
      args: [hideElements],
    });
    updateBadge(hideElements);
  }
});

// Listen for action button or popup interactions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleElements") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (isValidUrl(tab.url)) {
        hideElements = !hideElements;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: toggleElements,
          args: [hideElements],
        });
        updateBadge(hideElements);
        sendResponse({ success: true, hideElements });
      } else {
        sendResponse({ success: false, message: "Invalid URL" });
      }
    });
    return true; // Keeps the connection alive for async responses
  } else if (request.action === "getState") {
    sendResponse({ hideElements });
  }
});