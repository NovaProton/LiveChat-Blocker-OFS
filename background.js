// background.js (service worker in MV3)

let hideElements = true; // Default

chrome.runtime.onInstalled.addListener(() => {
  hideElements = true;
  updateBadge(hideElements);
});

// Validate URL
function isValidUrl(url) {
  return typeof url === "string" && url.includes("oakfurnituresuperstore.co.uk");
}

// Update the action badge
function updateBadge(isHidden) {
  const badgeColor = isHidden ? "green" : "red";
  const badgeText = isHidden ? "ON" : "OFF";
  chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  chrome.action.setBadgeText({ text: badgeText });
}

// Whenever a tab updates, set the correct badge if it's a valid URL
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && isValidUrl(tab.url)) {
    // Update the badge to reflect the current hide state
    updateBadge(hideElements);

    // If you want to re-send the hide/show state to the content script:
    chrome.tabs.sendMessage(tabId, {
      action: "toggleElements",
      hide: hideElements,
    });
  }
});

// Listen for messages from the popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleElements") {
    // Toggle the hideElements global state
    hideElements = !hideElements;
    updateBadge(hideElements);

    // Send a message to the active tab's content script to show/hide
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && isValidUrl(tabs[0].url)) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "toggleElements",
          hide: hideElements
        }, (response) => {
          sendResponse({ success: true, hideElements });
        });
      } else {
        sendResponse({ success: false, message: "Invalid URL" });
      }
    });

    return true; // keep the message channel open for async response
  }
  else if (request.action === "getState") {
    sendResponse({ hideElements });
  }
});