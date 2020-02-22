import { storageGet, storageSet } from "./crossBrowserSupport";

storageGet("origins", data => {
  if (!data.origins) {
    storageSet({ origins: [] });
  }
});
storageGet("sensitivity", data => {
  if (!data.sensitivity) {
    storageSet({ sensitivity: 15 });
  }
});
