// Initialize Firebase
var config = {
  apiKey: "AIzaSyAmJBXk8-6Ag5e-VTpHwqCa3zooEdd3KHM",
  authDomain: "wk-08-firebase-app.firebaseapp.com",
  databaseURL: "https://wk-08-firebase-app.firebaseio.com",
  storageBucket: "wk-08-firebase-app.appspot.com",
  messagingSenderId: "592761265728"
};

import * as firebase from "firebase";

firebase.initializeApp(config);

import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
// import App from './modules/App'
// import About from './modules/About'
// import Repos from './modules/Repos'
// import Repo from './modules/Repo'
// import Home from './modules/Home'
import Routes from './modules/Routes'

render(<Router routes={Routes} history={browserHistory}/>, document.getElementById('app'));
//
