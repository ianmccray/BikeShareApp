import React, { Component } from 'react';
import './App.css';
import SignUp from './SignUp.js'
import LoginForm from "./LoginForm.js";
import VendorPage from "./VendorPage.js"
import Routes from "./Routes"
//import {BrowserRouter, Route, Redirect} from "react-router-dom"



class App extends Component {
  render() {
    return (
      <div className="App">
        <Routes/>
      </div>
    );
  }
}

export default App;
