import React from "react";
import ReactDOM from "react-dom/client";
import { StoresContext, useStores } from "./stores";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const StoresProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const stores = useStores();
  return (
    <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
  );
};

root.render(
  <React.StrictMode>
    <StoresProvider>
      <App />
    </StoresProvider>
  </React.StrictMode>
);
