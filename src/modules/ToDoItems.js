import React from 'react'
import { Link } from 'react-router'
import * as firebase from "firebase";

export default class ToDoItems extends React.Component {

  toggleTask(self) {
  let taskId = self.target.id;
  // let isChecked = self.checked;
  // firebase.database().ref('todos/' + taskId + '/isDone').set(isChecked);
  const fbRef = this.props.fbRef
  const fbToDoRef = fbRef.child('todos')
  fbToDoRef.on('value', snapshot => {
    let taskObj = snapshot.val();
    console.log(taskObj.test2);
    for(let key in taskObj) {
      if (taskObj.key === taskId) {

        console.log(taskObj.key);
      }
    };
  // const taskId = fbToDoRef.push().key;
  // let updates = {};
  // updates['finished/' + taskId] = task;
  // fbRef.update(updates);
  })
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
