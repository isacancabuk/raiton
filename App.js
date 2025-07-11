import { useState } from "react";

import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import AdminScreen from "./screens/AdminScreen";
import SignUpScreen from "./screens/SignUpScreen";

export default function App() {
  const [authScreen, setAuthScreen] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const switchAuthScreenHandler = (screenName) => {
    setAuthScreen(screenName);
  };

  const loginHandler = () => {
    setIsLoggedIn(true);
  };

  let screen;
  if (isLoggedIn) screen = <MainScreen />;
  else {
    if (authScreen === "login") {
      screen = (
        <LoginScreen
          onLogin={loginHandler}
          onSwitchToSignUp={() => switchAuthScreenHandler("signup")}
        />
      );
    } else {
      screen = (
        <SignUpScreen
          onSwitchToLogin={() => switchAuthScreenHandler("login")}
        />
      );
    }
  }

  return <>{screen}</>;
}
