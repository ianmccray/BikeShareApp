import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter, Route, Redirect} from "react-router-dom"

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
