const button = document.getElementById(
  "disable-enable-button"
) as HTMLButtonElement;
const slider = document.getElementById("mouse-history") as HTMLInputElement;
const enable = "Enable";
const disable = "Disable";
let tab: chrome.tabs.Tab;

button.addEventListener("click", () => {
  if (!tab) return;
  const url = new URL(tab.url).hostname;
  chrome.storage.sync.get(["origins"], data => {
    const or: string[] = data.origins ? data.origins : [];
    if (button.textContent === disable) {
      if (!or.includes(url)) or.push(url);
    } else {
      const indexOf = or.indexOf(url);
      if (indexOf !== -1) or.splice(indexOf, 1);
    }
    chrome.storage.sync.set({ origins: or }, () => {
      chrome.tabs.sendMessage(tab.id, { type: "refresh" }, _ => {});
      update();
    });
  });
});

slider.addEventListener("change", () => {
  const sensitivity = parseInt(slider.value);
  chrome.storage.sync.set({ sensitivity });
  chrome.tabs.query({}, tabs => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "sensitivity", sensitivity },
        _ => {}
      );
    });
  });
});

function getTab() {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true
    },
    tabs => {
      tab = tabs[0];
      update();
    }
  );
}

function update() {
  chrome.storage.sync.get(["sensitivity"], data => {
    slider.value = data.sensitivity;
  });

  const span = document.getElementById("page-origin");

  if (!tab) {
    span.textContent = "Unable to detect page";
    return;
  }

  if (tab.url.startsWith("chrome")) changeButton(false);
  else changeButton(true);

  document.getElementById("page-origin").textContent = new URL(
    tab.url
  ).hostname;
}

function changeButton(canEnable: boolean) {
  chrome.storage.sync.get(["origins"], data => {
    if (!data.origins) return;
    const blockedOrigins: string[] = data.origins;

    if (blockedOrigins.includes(new URL(tab.url).hostname)) {
      button.textContent = enable;
    } else {
      if (canEnable) {
        button.disabled = false;
        button.textContent = disable;
      } else {
        button.disabled = true;
        button.textContent = enable;
      }
    }
  });
}

getTab();
