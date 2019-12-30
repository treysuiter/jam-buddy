import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom"
import './index.css';
// import App from './App';
import JamBuddy from './components/JamBuddy';
import 'typeface-roboto';
import CssBaseline from '@material-ui/core/CssBaseline'
// import * as serviceWorker from './serviceWorker';

//! not real sure if cssbaseline is working or needed

ReactDOM.render(
  <Router>
    <CssBaseline />
    <JamBuddy />
  </Router>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
