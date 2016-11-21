import React from 'react'
import { Link } from 'react-router'
import ToDoItems from './ToDoItems'
import * as firebase from "firebase";

export default class List extends React.Component {

    constructor() {
      super();
        this.state = {
          toDos: ['none']
        }
      };

    componentDidMount() {
      const fbToDoRef = this.props.fbRef.child('todos');
      fbToDoRef.on('value', snapshot => {
        let taskObj = snapshot.val();
        let toDos = Object.values(taskObj);
        this.setState({
          toDos: toDos
        });
      });
    };

    onChange(e) {
      this.setState({text: e.target.value});
      console.log(this.state.text);
    };

    handleSubmit(e) {
      let task =   document.getElementById('listInput').value;
      const taskId = fbToDoRef.push().key;
      let updates = {};
      updates['todos/' + taskId] = task;
      this.props.fbRef.update(updates);
    }

  render() {

    var toDos = this.state.toDos;
    var fbRef = this.props.fbRef;
    const fbToDoRef = fbRef.child('todos');
    // console.log(fbToDoRef);

    return (
      <div className='list'>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="New Task" className="form" id="listInput" /> {' '}
          <button className="form" type="submit">Add</button>
        </form>
        <ul>
          <li className="label">Done? </li>
          <li className="label">To-Do Item</li>
        </ul>
        <ToDoItems toDos={toDos} fbRef={fbRef}/>
      </div>
    )
  }
}
