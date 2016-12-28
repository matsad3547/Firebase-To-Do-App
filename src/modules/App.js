/* eslint-disable */

// Initialize Firebase
var config = {
	apiKey: 'AIzaSyAmJBXk8-6Ag5e-VTpHwqCa3zooEdd3KHM',
	authDomain: 'wk-08-firebase-app.firebaseapp.com',
	databaseURL: 'https://wk-08-firebase-app.firebaseio.com',
	storageBucket: 'wk-08-firebase-app.appspot.com',
	messagingSenderId: '592761265728',
}

import React from 'react'
import NavLink from './NavLink'
// import CreateList from './CreateList'
// import List from './List'
// import FinishedList from './FinishedList'
import * as firebase from 'firebase'

// firebase.initializeApp(config);

const fbRef = firebase
  .initializeApp(config)
  .database()
  .ref()
  .child('test1')

export default class App extends React.Component {

	render () {
		return (
      <div>
        <h1>The Doozer</h1>
        <h2>Do Some Stuff!</h2>
        <ul role="nav">

        </ul>
        <CreateList />
        <List fbRef={fbRef}/>
        <FinishedList fbRef={fbRef}/>
        {this.props.children}
      </div>
		)
	}
}

const CreateList = () => {

  let input

	const handleSubmit = e => {
		e.preventDefault()
		if (this.state.text && this.state.text.trim().length !== 0) {
			this.firebaseRef.push({
				text: this.state.text,
			})
			this.setState({
				text: '',
			})
		}
	}

	return (
    <div>
      <h3>Create a New To-Do List</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="New List Name" ref={node => input = node} /> {' '}
        <button type="submit">Go</button>
      </form>
    </div>
	)
}

class List extends React.Component {

	constructor () {
		super()
		this.state = {
			toDos: ['none'],
      task: ''
		}
	};

	componentDidMount () {
		const fbToDoRef = this.props.fbRef.child('todos')
		fbToDoRef.on('value', snapshot => {
			let taskObj = snapshot.val()
			let toDos = Object.values(taskObj)
			this.setState({
				toDos: toDos,
			})
		})
	};

	handleSubmit (e) {
    e.preventDefault()
    let task = this.state.task
    const fbToDoRef = this.props.fbRef.child('todos');
		const taskId = fbToDoRef.push().key
		let updates = {}
		updates['todos/' + taskId] = task
		this.props.fbRef.update(updates)
	}

// Gets react to track input as it changes
  onInput (e) {
    const text = e.target.value
    this.setState({ task: text })
  }

	render () {
    let input
		var toDos = this.state.toDos
    // var fbRef = this.props.fbRef;
    const fbToDoRef = fbRef.child('todos');
    // console.log(fbToDoRef);

		return (
      <div className='list'>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" placeholder="New Task" className="form" id="listInput" onInput={this.onInput.bind(this)} value={this.state.task}/> {' '}
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

// //
// // <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
// // <li><NavLink to="/about">About</NavLink></li>
// // <li><NavLink to="/repos">Repos</NavLink></li>
// //
//
class ToDoItems extends React.Component {

	toggleTask (self) {
      // pull in task
		let completedTask = self.target.id
    // push task to finished list
		const fbCompletedRef = this.props.fbRef.child('completed')
		const taskId = fbCompletedRef.push().key
		let updates = {}
		updates['completed/' + taskId] = completedTask
		this.props.fbRef.update(updates)
    // delete task from todo list
	}

	render () {
		const fbRef = this.props.fbRef
		let tasks = this.props.toDos

		return (
      <div>
        {tasks.map((task, i) =>
        <li key={i}>
          <input type="checkbox" key={i + 'B'} className="task" id={task} onChange={this.toggleTask.bind(this)}></input>
          <p key={i + 'A'} className="task">{task}</p>
        </li>
      )}
      </div>
		)
	}
}

class FinishedList extends React.Component {

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

    return (
      <div className='list'>
        <h4>Completed Tasks</h4>
        {completed.map( (task, i) =>
        <li key={i} className="completed">{task}</li>
      )}
      </div>
    )
  }
}
