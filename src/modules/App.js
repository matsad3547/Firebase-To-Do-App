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

const listTitle = 'todos'

export default class App extends React.Component {

	render () {
		return (
      <div>
        <h1>The Doozer</h1>
        <h2>Do Some Stuff!</h2>
        <ul role="nav">

        </ul>
        <CreateList />
        <List
					fbRef={fbRef}
					listTitle={listTitle}
					/>
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

const listLength = (ref) => {
  let length = 0
  ref.on('value', snapshot => {
    let refObj = snapshot.val()
    length = Object.values(refObj).length
  })
  return length
}

class List extends React.Component {

	constructor () {
		super()
		this.state = {
			toDos: ['none'],
      task: ''
		}
	}

	componentDidMount () {
		const fbListRef = this.props.fbRef.child(listTitle)
		fbListRef.on('value', snapshot => {
			let taskObj = snapshot.val()
			let toDos = Object.values(taskObj)
			this.setState({
				toDos: toDos,
			})
		})
	}

	handleSubmit (e) {
    e.preventDefault()
    let task = this.state.task
    const fbListRef = this.props.fbRef.child(listTitle);
		const taskId = fbListRef.push().key
		let updates = {}
		updates['todos/' + taskId] = task
		this.props.fbRef.update(updates)
    this.setState({ task: ''})
	}

// Gets react to track input as it changes
  onInput (e) {
    const text = e.target.value
    this.setState({ task: text })
  }

	render () {
    let input
		let toDos = this.state.toDos
    // let length = toDos.length
    // var fbRef = this.props.fbRef;
    const fbListRef = fbRef.child(listTitle);
    // console.log(fbListRef);

		return (
      <div className='list'>
				<h3>{listTitle}</h3>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" placeholder="New Task" className="form" id="listInput" onInput={this.onInput.bind(this)} value={this.state.task}/> {' '}
          <button className="form" type="submit">Add</button>
        </form>
        <ul>
          <li className="label">Done?</li>
          <li className="label">To-Do Item</li>
        </ul>
        <ToDoItems
					toDos={toDos}
					fbRef={fbRef}
					fbListRef={fbListRef}
					/>
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
const getKeyByVal = (ref, val) => {
  let obj
  ref.on('value', snapshot => {
    obj = snapshot.val()
  })
  for (let key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === val) {
      return key
    }
  }
}

class ToDoItems extends React.Component {

	toggleTask (self) {
		self.preventDefault()
		
		const { fbRef, fbListRef } = this.props
		let completedTask = self.target.id
    let deleteKey = getKeyByVal(fbListRef, completedTask)
		const fbCompletedRef = fbRef.child('completed')
		const taskId = fbCompletedRef.push().key

		let updates = {}
		updates['completed/' + taskId] = completedTask
		fbRef.update(updates)

		let deleted = {}
		deleted['todos/' + deleteKey] = null
		fbRef.update(deleted)
	}

	render () {
		const { fbRef, toDos } = this.props

		return (
      <div>
        {toDos.map((toDo, i) =>
        <li key={i}>
          <input type="checkbox" key={i + 'B'} className="task" id={toDo} onChange={this.toggleTask.bind(this)}></input>
          <p key={i + 'A'} className="task">{toDo}</p>
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
      }

    componentDidMount() {
      const fbListRef = this.props.fbRef.child('completed');
      fbListRef.on('value', snapshot => {
        let completedObj = snapshot.val();
        let completed = Object.values(completedObj);
        this.setState({
          completed: completed
        })
      })
    }

  render() {

    var completed = this.state.completed;
    var fbRef = this.props.fbRef;
    const fbListRef = fbRef.child(listTitle);

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
