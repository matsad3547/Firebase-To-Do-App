import React from 'react'
import { Link } from 'react-router'
import * as firebase from "firebase";

export default class ToDoItems extends React.Component {

  toggleTask(self) {
      //pull in task
    let completedTask = self.target.id;
    //push task to finished list
    const fbCompletedRef = this.props.fbRef.child('completed');
    const taskId = fbCompletedRef.push().key;
    let updates = {};
    updates['completed/' + taskId] = completedTask;
    this.props.fbRef.update(updates);
    //delete task from todo list
    
  }

  render() {

    const fbRef = this.props.fbRef;
    let tasks = this.props.toDos;

    return (
      <div>
        {tasks.map( (task, i) =>
        <li key={i}>
          <input type="checkbox" key={i + 'B'} className="task" id={task} onChange={this.toggleTask.bind(this)}></input>
          <p key={i + 'A'} className="task">{task}</p>
        </li>
      )}
      </div>
    )
  }
}
