import React from "react";
import { observer } from "mobx-react-lite";
import AppRouter from "./AppRouter";

const App: React.FC = observer(() => {
  return <AppRouter />;
});

export default App;
