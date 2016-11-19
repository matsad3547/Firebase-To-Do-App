// Initialize Firebase
var config = {
  apiKey: "AIzaSyAmJBXk8-6Ag5e-VTpHwqCa3zooEdd3KHM",
  authDomain: "wk-08-firebase-app.firebaseapp.com",
  databaseURL: "https://wk-08-firebase-app.firebaseio.com",
  storageBucket: "wk-08-firebase-app.appspot.com",
  messagingSenderId: "592761265728"
};

firebase.initializeApp(config);

import React from 'react'
import { Link } from 'react-router'
import * as firebase from "firebase";
import FbApp from '../index.js'


export default class ToDoItems extends React.Component {

  constructor() {
    super();
      this.state = {
        toDos: ['none', 'none']
      }
    };

  componentDidMount() {
    const fbRef = firebase.database().ref().child('test1');
    const fbToDoRef = fbRef.child('todos');
    fbToDoRef.on('value', snapshot => {
      let taskObj = snapshot.val();
      let toDos = Object.values(taskObj);
      this.setState({
        toDos: toDos
      });
    });
  };

  render() {

    let tasks = this.state.toDos;
    console.log(tasks);

    return (
      <div className='list'>
        {tasks.map( (task, i) =>
        <li key={i}>
          <input type="checkbox" key={i + 'B'} className="task"></input>
          <p key={i + 'A'} className="task">{task}</p>
        </li>
      )}
      </div>
    )
  }
}
