import { WebContainer } from "@webcontainer/api";

let webContainerInstance = null;
export const getWebContainer = async () => {
  if (webContainerInstance === null) {
    webContainerInstance = await WebContainer.boot();
  } else {
    console.warn(
      "WebContainer instance already exists, returning the existing instance."
    );
  }

  return webContainerInstance;
};
