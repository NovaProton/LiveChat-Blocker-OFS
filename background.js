let hideElements = true; // Default state (hidden)

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url.includes("oakfurnituresuperstore.co.uk")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: toggleElements,
      args: [true] // Always hide by default
    });

    // Set badge to green (hidden state)
    chrome.action.setBadgeBackgroundColor({ color: "green" });
    chrome.action.setBadgeText({ text: "Show" });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: toggleElements,
    args: [hideElements]
  });

  // Toggle state
  hideElements = !hideElements;

  // Update badge color and text based on state
  const badgeColor = hideElements ? "green" : "red";
  const badgeText = hideElements ? "Show" : "Hiden";
  chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  chrome.action.setBadgeText({ text: badgeText });
});

function toggleElements(hide) {
  const elementsToToggle = [
    document.querySelector('#chat-widget-minimized'),
    document.querySelector('#chat-widget-container'),
    document.querySelector('[role="dialog"][aria-label="FLYOUT Form"]') // Klaviyo popup
  ];

  elementsToToggle.forEach(el => {
    if (el) el.style.display = hide ? 'none' : ''; // Toggle visibility
  });

  console.log(hide ? 'Elements hidden' : 'Elements shown');
}
