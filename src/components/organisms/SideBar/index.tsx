import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

import "./styles.scss";
import Logo from "../../../assets/images/png/Logo.png";
import SignOut from "../../../assets/images/svg/SignOut.svg";
import Settings from "../../../assets/images/svg/Settings.svg";

import { menuItems } from "../../../data/constants";
import { useStores } from "../../../stores";

const Sidebar: React.FC = observer(() => {
  const location = useLocation();
  const { uiStore } = useStores();

  useEffect(() => {
    uiStore.checkSidebarState(location.pathname);
  }, [location.pathname, uiStore]);

  const isActive = (path: string) => {
    const isCompaniesPage =
      location.pathname.includes("companies") ||
      location.pathname.includes("contractors") ||
      location.pathname.includes("clients");

    if (isCompaniesPage && path === "/companies") {
      return true;
    } else return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <div className="sidebar__header">
          <Link to="/companies" className="sidebar__logo">
            <img src={Logo} alt="logo" />
          </Link>
        </div>

        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.id}
            className={`sidebar__menu-link ${
              isActive(item.path) ? "sidebar__menu-link--active" : ""
            }`}
          >
            <img src={item.icon} alt={item.id} className="sidebar__image" />
          </Link>
        ))}

        <div className="sidebar__footer">
          <span className="sidebar__divider"></span>
          <button className="sidebar__btn">
            <img src={Settings} alt="settings" className="sidebar__image" />
          </button>
          <button className="sidebar__btn">
            <img src={SignOut} alt="logout" className="sidebar__image" />
          </button>
        </div>
      </nav>
    </aside>
  );
});

export default Sidebar;
