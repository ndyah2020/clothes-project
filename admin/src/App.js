import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";
import Home from "./pages/Home";
import User from "./pages/Users";
import Rtl from "./pages/Rtl";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";

import Customer from "./pages/Customer";
import Products from "./pages/Products";
import Supplier from "./pages/Supplier";
import Employee from "./pages/Employee";
import LoyaltyDiscount from "./pages/LoyaltyDiscount.js";
import Promotion from "./pages/Promotion.js";
import Sales from "./pages/Sales.js";
import ImportForm from "./pages/ImportForm.js";
import InvoiceList from "./pages/InvoiceList.js";
import ForgotPassword from "./pages/ForgotPassword.js";
import ResetPassword from "./pages/ResetPassword.js";
import ImportNoteList from "./pages/ImportNoteList.js"
import ImportNoteListCheck from "./pages/ImportNoteListCheck.js";
const isTokenValid = () => {
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
};

function App() {
  const isAuthenticated = isTokenValid();

  return (
    <div className="App">
      <Switch>
        {/* Public Routes */}
        <Route path="/sign-in" exact component={SignIn} />
        <Route path="/forgot-password" exact component={ForgotPassword} />
        <Route path="/reset-password" exact component={ResetPassword} />

        {/* Private Routes */}
        {isAuthenticated ? (
          <Main>
            <Route exact path="/dashboard" component={Home} />
            <Route exact path="/sales" component={Sales} />
            <Route exact path="/invoice-list" component={InvoiceList} />
            <Route exact path="/users" component={User} />
            <Route exact path="/employee" component={Employee} />
            <Route exact path="/customer" component={Customer} />
            <Route exact path="/products" component={Products} />
            <Route exact path="/loyalty-discount" component={LoyaltyDiscount} />
            <Route exact path="/promotion" component={Promotion} />
            <Route exact path="/supplier" component={Supplier} />
            <Route exact path="/rtl" component={Rtl} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/import-form" component={ImportForm} />
            <Route exact path="/import-note-list" component={ImportNoteList} />
            <Route exace path='/import-note-check/:id' component={ImportNoteListCheck} />
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
