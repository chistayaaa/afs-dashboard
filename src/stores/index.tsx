import React from "react";
import { OrganizationStore } from "./organizationStore";
import UIStore from "./uiStore";

class RootStore {
  organizationStore: OrganizationStore;
  uiStore: UIStore;

  constructor() {
    this.organizationStore = new OrganizationStore();
    this.uiStore = new UIStore();
  }
}

export const rootStore = new RootStore();

export const StoresContext = React.createContext(rootStore);

export const useStores = () => {
  const context = React.useContext(StoresContext);
  if (!context) {
    throw new Error("useStores must be used within a StoresProvider");
  }
  return context;
};
