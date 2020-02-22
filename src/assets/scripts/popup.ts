import {
  sendMessageToTab,
  storageGet,
  storageSet,
  getTabsQuery,
  sendMessage
} from "./crossBrowserSupport";

const button = document.getElementById(
  "disable-enable-button"
) as HTMLButtonElement;
const slider = document.getElementById("mouse-history") as HTMLInputElement;
const enable = "Enable";
const disable = "Disable";
let tab: chrome.tabs.Tab | browser.tabs.Tab;

button.addEventListener("click", () => {
  if (!tab) return;
  const url = new URL(tab.url).hostname;
  storageGet("origins", data => {
    const or: string[] = data.origins ? data.origins : [];
    if (button.textContent === disable) {
      if (!or.includes(url)) or.push(url);
    } else {
      const indexOf = or.indexOf(url);
      if (indexOf !== -1) or.splice(indexOf, 1);
    }
    storageSet({ origins: or }, () => {
      sendMessageToTab(tab.id, { type: "refresh" });
      update();
    });
  });
});

slider.addEventListener("change", () => {
  const sensitivity = parseInt(slider.value);
  storageSet({ sensitivity });
  getTabsQuery({}, tabs => {
    tabs.forEach(tab => {
      sendMessageToTab(tab.id, { type: "sensitivity", sensitivity });
    });
  });
});

function getTab() {
  getTabsQuery(
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
  storageGet("sensitivity", data => {
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
  storageGet("origins", data => {
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
