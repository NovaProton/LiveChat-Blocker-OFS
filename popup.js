document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("toggleButton");

    // Retrieve the current state from the background script
    chrome.runtime.sendMessage({ action: "getState" }, (response) => {
        if (response && response.hideElements !== undefined) {
            updateButtonStyle(response.hideElements);
        }
    });

    // Toggle the state and update the button on click
    button.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "toggleElements" }, (response) => {
            if (response && response.hideElements !== undefined) {
                updateButtonStyle(response.hideElements);
            }
        });
    });

    // Update the button's appearance based on the state
    function updateButtonStyle(isOn) {
        button.style.backgroundColor = isOn ? "#4caf50" : "#f44336";
        button.textContent = isOn ? "ON" : "OFF";
    }
});