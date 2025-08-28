import React from "react";
import { observer } from "mobx-react-lite";
import "./styles.scss";

import { companiesItems } from "../../../data/constants";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  isOpen: boolean;
}

/* Header component with menu company info -> can be extened later */
const Header: React.FC<HeaderProps> = observer(({ isOpen }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const isCompaniesPage =
    location.pathname.includes("companies") ||
    location.pathname.includes("contractors") ||
    location.pathname.includes("clients");

  return (
    <header className={`header ${isOpen ? "header--open" : ""}`}>
      {isCompaniesPage && (
        <>
          <div className="header--companies__top">
            <h2 className="header--companies__title">Oak Tree Cemetery</h2>
            <h4 className="header--companies__sub-title">Process Manager</h4>
          </div>
          <div className="header--companies__items">
            {companiesItems.map((item) => {
              const IconComponent = item.icon;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`header--companies__button ${
                    isActive(item.path)
                      ? "header--companies__button--active"
                      : ""
                  }`}
                >
                  <IconComponent width={20} height={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="header--companies__footer">
            All Funeral Services © 2015-{new Date().getFullYear()}
          </div>
        </>
      )}
    </header>
  );
});

export default Header;
