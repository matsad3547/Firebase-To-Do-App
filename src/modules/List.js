// Initialize Firebase
var config = {
  apiKey: "AIzaSyAmJBXk8-6Ag5e-VTpHwqCa3zooEdd3KHM",
  authDomain: "wk-08-firebase-app.firebaseapp.com",
  databaseURL: "https://wk-08-firebase-app.firebaseio.com",
  storageBucket: "wk-08-firebase-app.appspot.com",
  messagingSenderId: "592761265728"
};

import React from 'react'
import { Link } from 'react-router'
import ToDoItems from './ToDoItems'
import * as firebase from "firebase";
firebase.initializeApp(config);


export default class List extends React.Component {

    constructor() {
      super();
        this.state = {
          toDos: ['none']
        }
      };

    componentDidMount() {
      const fbRef = firebase.database().ref().child('test1');
      const fbToDoRef = fbRef.child('todos');
      fbToDoRef.on('value', snapshot => {
        let taskObj = snapshot.val();
        let toDos = Object.values(taskObj);
        this.setState({
          toDos: toDos,
          text: ''
        });
      });
    };

  onChange(e) {
  this.setState({text: e.target.value});
  console.log(this.state.text);
};

  handleSubmit(e) {
    let task =   document.getElementById('listInput').value;
    const fbRef = firebase.database().ref().child('test1');
    const fbToDoRef = fbRef.child('todos');
    const taskId = fbToDoRef.push().key;
    let updates = {};
    updates['todos/' + taskId] = task;
    fbRef.update(updates);
  }

  render() {

    var toDos = this.state.toDos

    return (
      <div className='list'>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="New Task" className="form" id="listInput"/> {' '}
          <button className="form" type="submit">Add</button>
        </form>
        <ul>
          <li>Done? </li>
          <li>To-Do Item</li>
        </ul>
        <ToDoItems toDos={toDos}/>
      </div>
    )
  }
}

// handleSubmit(e) {
//   e.preventDefault();
//   if (this.state.text && this.state.text.trim().length !== 0) {
//     console.log(this.state.text);
//     this.fbToDoRef.push({
//       text: this.state.text
//     });
//     this.setState({
//       text: ''
//     });
//   }
// }
