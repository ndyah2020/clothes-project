import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
import Home from "./pages/Home";
import User from "./pages/Users";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Products from "./pages/Products";

function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }

  try {
    // Decode the token without verifying the signature (client-side only)
    const decoded = jwt.decode(token);

    // Check if the token has expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      localStorage.removeItem("token"); // Remove expired token
      return false;
    }

    return true;
  } catch (error) {
    // If decoding fails, consider the token invalid
    localStorage.removeItem("token");
    return false;
  }
}

function App() {
  const isAuthenticated = isTokenValid();

  return (
    <div className="App">
      <Switch>
        {/* Public Routes */}
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignIn} />

        {/* Private Routes */}
        {isAuthenticated ? (
          <Main>
            <Route exact path="/dashboard" component={Home} />
            <Route exact path="/users" component={User} />
            <Route exact path="/products" component={Products} />
            <Route exact path="/rtl" component={Rtl} />
            <Route exact path="/profile" component={Profile} />
            <Redirect from="*" to="/dashboard" />
          </Main>
        ) : (
          <Redirect to="/sign-in" />
        )}
      </Switch>
    </div>
  );
}

export default App;
