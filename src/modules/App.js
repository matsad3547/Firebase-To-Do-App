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
import * as firebase from 'firebase'

// firebase.initializeApp(config);

const fbRef = firebase
  .initializeApp(config)
  .database()
  .ref()
  .child('test1')

export default class App extends React.Component {

	constructor () {
		super()
		this.state = {
			toDoObj: {},
      completed: ['none'],
		}
	}

	componentDidMount () {
		fbRef.on('value', snapshot => {
			let toDoObj = snapshot.val()
      let completed = Object.values(toDoObj.completed)
			this.setState({
				toDoObj: toDoObj,
        completed: completed
			})
		})
	}

	render () {

		let listTitles = Object.keys(this.state.toDoObj).filter( title => title != 'completed')

		return (
      <div>
        <h1>The Doozer</h1>
        <h2>Do Some Stuff!</h2>
        <CreateList
          fbRef={fbRef}
          />
        <ul role="nav">
          <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
          {listTitles.map( (listTitle, i) => <li key={i}><NavLink to="/{listTitle}">{listTitle}</NavLink></li>
          )}
        </ul>
				{listTitles.map( (listTitle, i) =>
					<List
						key={i}
						fbRef={fbRef}
						listTitle={listTitle}
						toDoObj={this.state.toDoObj[listTitle]}
						/>
				)}
				<CompletedList
					fbRef={fbRef}
					completed={this.state.completed}
					/>
      </div>
		)
	}
}

const CreateList = (props) => {

	const { fbRef } = props

	let input

	const handleListSubmit = e => {
		e.preventDefault()
		let newList = input.value
		fbRef.child(newList).push('there\'s stuff to do!')
		input.value = ''
	}

	return (
		<div>
			<h3>Create a New To-Do List</h3>
			<form onSubmit={handleListSubmit}>
				<input type="text" placeholder="New List Name" ref={ node => input = node} /> {' '}
				<button className="form" type="submit">Go</button>
			</form>
		</div>
	)
}

const List = (props) => {

	const { fbRef, listTitle, toDoObj } = props

	let toDos = Object.values(toDoObj)

	let input

	const handleToDoSubmit = e => {
		e.preventDefault()
		let task = input.value
		let fbListRef = fbRef.child(listTitle);
		let taskId = fbListRef.push().key
		let updates = {}
		let updateListTitle = listTitle + '/'
		updates[updateListTitle + taskId] = task
		fbRef.update(updates)
		input.value = ''
	}

	return (

		<div className='list'>
			<h3>{listTitle}</h3>
			<form onSubmit={handleToDoSubmit}>
				<input type="text" placeholder="New Task" className="form" id="listInput" ref={ (node) => input = node}/> {' '}
				<button className="form" type="submit">Add</button>
			</form>
			<ul>
				<li className="label">Done?</li>
				<li className="label">To-Do Item</li>
			</ul>
			<ToDoItems
				toDos={toDos}
				fbRef={fbRef}
				listTitle={listTitle}
				/>
		</div>
	)
}

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

const ToDoItems = (props) => {

	let input

	const { fbRef, toDos, listTitle } = props

	const toggleTask = self => {

		self.preventDefault()

		let completedTask = self.target.id

		const fbCompletedRef = fbRef.child('completed')
		const taskId = fbCompletedRef.push().key

		let updates = {}
		updates['completed/' + taskId] = completedTask
		fbRef.update(updates)

		let deleted = {}
		let deleteKey = getKeyByVal(fbRef.child(listTitle), completedTask)
		let deletedItemList = listTitle + '/'
		deleted[deletedItemList + deleteKey] = null
		fbRef.update(deleted)
	}

	return (
		<div>
			{toDos.map((toDo, i) =>
			<li key={i}>
				<input type="checkbox" key={i + 'A'} className="task" id={toDo} onChange={toggleTask} ></input>
				<p key={i + 'B'} className="task">{toDo}</p>
			</li>
		)}
		</div>
	)
}

const CompletedList = (props) => {

	const { completed } = props

	return (
		<div className='list'>
			<h4>Completed Tasks</h4>
			{completed.map( (task, i) =>
				<li key={i} className="completed">{task}</li>
			)}
		</div>
	)
}
