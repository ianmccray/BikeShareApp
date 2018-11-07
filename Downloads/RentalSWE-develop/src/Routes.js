import React, { Component } from 'react';
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom"
import SignUp from './SignUp.js'
import LoginForm from "./LoginForm.js";
import VendorPage from "./VendorPage.js"
import Marketplace from "./marketplace.js"
import VendorProfile from "./VendorProfile.js"
import VendorProfileItems from "./VendorProfileItems.js"
import InsuranceForm from "./InsuranceForm.js"
import ItemPage from "./ItemPage.js"
import Offers from "./Offers.js"


class Routes extends Component {
  render() {
    return (
        <BrowserRouter>
          <div>
            <Route path="/SignUp" component={SignUp} />
            <Route path="/Login"  component={LoginForm} />
            <Route path="/VendorPage" component={VendorPage} />
            <Route path="/Marketplace" component={Marketplace} />
            <Route path="/Profile" component={VendorProfile} />
            <Route path="/MyItems" component={VendorProfileItems} />
            <Route path="/Insurance" component={InsuranceForm} />
            <Route path="/Item/:itemID" component={ItemPage} />
            <Route path="/Offers" component={Offers} />
          </div>
        </BrowserRouter>
    );
  }
}
export default Routes;
