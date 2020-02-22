chrome.storage.sync.get(["origins"], data => {
  if (!data.origins) {
    chrome.storage.sync.set({ origins: [] });
  }
});

chrome.storage.sync.get(["sensitivity"], data => {
  if (!data.sensitivity) {
    chrome.storage.sync.set({ sensitivity: 15 });
  }
});
