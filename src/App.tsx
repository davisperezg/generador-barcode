import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import LoginScreen from "./views/LoginScreen";
import PrincipalScreen from "./views/PrincipalScreen";
import viteLogo from "/vite.svg";

function App() {
  if (localStorage.getItem("logged")) {
    return <PrincipalScreen />;
  }

  return <LoginScreen />;
}

export default App;
