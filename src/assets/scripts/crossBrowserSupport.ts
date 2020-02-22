let environment: "chrome" | "browser" | "unknown" = "unknown";
try {
  if (browser) environment = "browser";
} catch (err) {
  try {
    if (chrome) environment = "chrome";
  } catch (err) {
    console.error("Cannot find browser API!");
  }
}

export function onMessage(
  sendResponse: (
    msg,
    sender: chrome.runtime.MessageSender | browser.runtime.MessageSender,
    response
  ) => void
) {
  console.log("binded");
  if (environment === "chrome") {
    chrome.runtime.onMessage.addListener((msg, sender, response) => {
      console.log("ping");
      sendResponse(msg, sender, response);
    });
  } else if (environment === "browser") {
    browser.runtime.onMessage.addListener((msg, sender, response) =>
      sendResponse(msg, sender, response)
    );
  }
}

export function sendMessage(request: any, response?: (res) => void) {
  if (!response)
    response = () => {
      /* ignore */
    };

  if (environment === "chrome") {
    chrome.runtime.sendMessage(request, res => response(res));
  } else if (environment === "browser") {
    browser.runtime.sendMessage(request, res => response(res));
  }
}

export function sendMessageToTab(
  tabId: number,
  message: any,
  options?: any,
  response?: (res) => void
) {
  if (!response)
    response = () => {
      /* ignore */
    };

  if (environment === "chrome") {
    chrome.tabs.sendMessage(tabId, message, res => response(res));
  } else if (environment === "browser") {
    browser.tabs.sendMessage(tabId, message, options);
  }
}

export async function storageGet(key: string, data: (data) => void) {
  if (environment === "chrome") {
    chrome.storage.local.get([key], data);
  } else if (environment === "browser") {
    await browser.storage.local.get(key).then(d => data(d));
  }
}

export async function storageSet(items: Object, response?: () => void) {
  if (!response)
    response = () => {
      /* ignore */
    };

  if (environment === "chrome") {
    chrome.storage.local.set(items, response);
  } else if (environment === "browser") {
    await browser.storage.local.set(items).then(d => response());
  }
}

export function getURL(url: string) {
  if (environment === "chrome") {
    return chrome.extension.getURL(url);
  } else if (environment === "browser") {
    return browser.extension.getURL(url);
  }
}

export function getTabsQuery(
  query: chrome.tabs.QueryInfo,
  response: (tabs: chrome.tabs.Tab[] | browser.tabs.Tab[]) => void
) {
  if (environment === "chrome") {
    chrome.tabs.query(query, tabs => response(tabs));
  } else if (environment === "browser") {
    browser.tabs.query(query).then(tabs => response(tabs));
  }
}

/*
 if (environment === "chrome") {


  } else if (environment === "browser") {


  }


*/
