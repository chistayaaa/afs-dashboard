import React from "react";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "../../../stores";

import Sidebar from "../SideBar";
import Header from "../Header";

import "./styles.scss";

const Layout: React.FC = observer(() => {
  const { uiStore } = useStores();

  return (
    <div className="layout">
      <div className="layout__sidebar">
        <Sidebar />
        <Header
          isOpen={uiStore.isSidebarOpen}
        />
      </div>
      <main className="layout__content">
        <Outlet />
      </main>
    </div>
  );
});

export default Layout;
