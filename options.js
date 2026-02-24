// options.js
const saveBtn = document.getElementById("saveBtn");
const apiKeyInput = document.getElementById("apiKey");
const statusText = document.getElementById("status");

// Load the saved key when the page opens
chrome.storage.local.get(["geminiApiKey"], (result) => {
  if (result.geminiApiKey) apiKeyInput.value = result.geminiApiKey;
});

// Save the key when the button is clicked
saveBtn.addEventListener("click", () => {
  const key = apiKeyInput.value.trim();
  chrome.storage.local.set({ geminiApiKey: key }, () => {
    statusText.innerText = "✅ API Key saved securely!";
    setTimeout(() => (statusText.innerText = ""), 3000);
  });
});
