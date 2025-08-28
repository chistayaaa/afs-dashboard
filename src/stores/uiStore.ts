import { makeAutoObservable } from "mobx";
import { companiesItems, menuItems } from "../data/constants";

class UIStore {
  isSidebarOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  openSidebar = () => {
    this.isSidebarOpen = true;
  };

  closeSidebar = () => {
    this.isSidebarOpen = false;
  };

  toggleSidebar = () => {
    this.isSidebarOpen = !this.isSidebarOpen;
  };

  checkSidebarState = (pathname: string) => {
    const currentPath = [...menuItems, ...companiesItems].find((item) =>
      pathname.includes(item.path)
    );

    this.isSidebarOpen = currentPath?.isSidebarOpen || false;
  };
}

export default UIStore;
