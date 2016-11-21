// Initialize Firebase
var config = {
  apiKey: "AIzaSyAmJBXk8-6Ag5e-VTpHwqCa3zooEdd3KHM",
  authDomain: "wk-08-firebase-app.firebaseapp.com",
  databaseURL: "https://wk-08-firebase-app.firebaseio.com",
  storageBucket: "wk-08-firebase-app.appspot.com",
  messagingSenderId: "592761265728"
};

import React from 'react'
import NavLink from './NavLink'
import CreateList from './CreateList'
import List from './List'
import FinishedList from './FinishedList'
import * as firebase from "firebase"
firebase.initializeApp(config);

const fbRef = firebase.database().ref().child('test1')

export default class App extends React.Component{

  render() {

    return (
      <div>
        <h1>The Doozer</h1>
        <h2>Do Some Stuff!</h2>
        <ul role="nav">

        </ul>
        <CreateList />
        <List fbRef={fbRef}/>
        <FinishedList  fbRef={fbRef}/>
        {this.props.children}
      </div>
    )
  }
}

//
// <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
// <li><NavLink to="/about">About</NavLink></li>
// <li><NavLink to="/repos">Repos</NavLink></li>
//
