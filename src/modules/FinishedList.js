import React from 'react'
import { Link } from 'react-router'
import ToDoItems from './ToDoItems'
import * as firebase from "firebase";

export default class List extends React.Component {

    constructor() {
      super();
        this.state = {
          completed: ['none']
        }
      };

    componentDidMount() {
      const fbToDoRef = this.props.fbRef.child('completed');
      fbToDoRef.on('value', snapshot => {
        let completedObj = snapshot.val();
        let completed = Object.values(completedObj);
        this.setState({
          completed: completed
        });
      });
    };

  render() {

    var completed = this.state.completed;
    var fbRef = this.props.fbRef;
    const fbToDoRef = fbRef.child('todos');
    // var completed = ['completed']
    // console.log(fbToDoRef);

    return (
      <div className='list'>
        <h4>Completed Tasks</h4>
        {completed.map( (task, i) =>
        <li key={i} className="completed">{completed}</li>
      )}
      </div>
    )
  }
}
