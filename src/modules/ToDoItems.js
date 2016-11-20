import React from 'react'
import { Link } from 'react-router'
import * as firebase from "firebase";

export default class ToDoItems extends React.Component {

  render() {

    let tasks = this.props.toDos;
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
