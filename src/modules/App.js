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
import { Link } from 'react-router'
import { Router, Route, browserHistory, IndexRoute, Match } from 'react-router'
import NavLink from './NavLink'
import * as firebase from 'firebase'

// firebase.initializeApp(config);

const fbRef = firebase
  .initializeApp(config)
  .database()
  .ref()
  .child('test1')

export const App = (props) => {
  return (
    <div>
      <h1>The Doozer</h1>
      <h2>Do Some Stuff!</h2>
      <ul role="nav">
        <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
        <li><NavLink to="/lists">Lists</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
      </ul>
      {props.children || <Home />}
    </div>
  )
}

export class Home extends React.Component {

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
        <CreateList
          fbRef={fbRef}
          />
				<CompletedList
					fbRef={fbRef}
					completed={this.state.completed}
					/>
      </div>
		)
	}
}

// <Lists
//   fbRef={fbRef}
//   listTitles={listTitles}
//   />

// {listTitles.map( (listTitle, i) =>
//   <List
//     key={i}
//     fbRef={fbRef}
//     listTitle={listTitle}
//     toDoObj={this.state.toDoObj[listTitle]}
//     />
// )}

export class Lists extends React.Component {

  	constructor () {
  		super()
  		this.state = {
  			toDoObj: {},
        listTitles: [],
  		}
  	}

  	componentDidMount () {
  		fbRef.on('value', snapshot => {
  			let toDoObj = snapshot.val()
  			this.setState({
  				toDoObj: toDoObj,
          listTitles: ['things', 'stuff'],
  			})
  		})
  	}

  render () {

    // let listTitles = ['things', 'stuff']

    // let listTitles = Object.keys(this.state.toDoObj).filter( title => title != 'completed')
      const getPath = (listTitle) => {
        return '/lists/'+listTitle
      }


    // console.log('list titles:', listTitles);

    return(
      <div>
        <ul>
          {this.state.listTitles.map( (listTitle, i) => <li key={i}><NavLink to={getPath(listTitle)}>{listTitle}</NavLink></li>
          )}
        </ul>
      </div>
    )
  }
}

// export const Lists = (props) => {
//
//   // const { listTitles } = props
//   let listTitles = ['things', 'stuff']
//   const getPath = (listTitle) => '/lists/'+listTitle
//
//   return(
//     <div>
//       <ul>
//         {listTitles.map( (listTitle, i) => <li key={i}><NavLink to={getPath(listTitle)}>{listTitle}</NavLink></li>
//         )}
//       </ul>
//       {props.children}
//     </div>
//   )
// }

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

export const List = (props) => {

  console.log('props:', props);

  return (
    <div>
        <h2>{props.params.listTitle}</h2>
    </div>
  )
}

// export class List extends React.Component{
//   render() {
//     return (
//       <div>
//         <h2>{this.props.params.listTitle}</h2>
//       </div>
//     )
//   }
// }

// export const List = (props) => {
//
// 	const { fbRef, listTitle, toDoObj } = props
//
// 	let toDos = Object.values(toDoObj)
//
// 	let input
//
// 	const handleToDoSubmit = e => {
// 		e.preventDefault()
// 		let task = input.value
// 		let fbListRef = fbRef.child(listTitle);
// 		let taskId = fbListRef.push().key
// 		let updates = {}
// 		let updateListTitle = listTitle + '/'
// 		updates[updateListTitle + taskId] = task
// 		fbRef.update(updates)
// 		input.value = ''
// 	}
//
// 	return (
//
// 		<div className='list'>
// 			<h3>{listTitle}</h3>
// 			<form onSubmit={handleToDoSubmit}>
// 				<input type="text" placeholder="New Task" className="form" id="listInput" ref={ (node) => input = node}/> {' '}
// 				<button className="form" type="submit">Add</button>
// 			</form>
// 			<ul>
// 				<li className="label">Done?</li>
// 				<li className="label">To-Do Item</li>
// 			</ul>
// 			<ToDoItems
// 				toDos={toDos}
// 				fbRef={fbRef}
// 				listTitle={listTitle}
// 				/>
// 		</div>
// 	)
// }

export const About = () => (
  <div>
    <h2>About</h2>
    <p>This is a To-Do app with a terrible name that uses React + Router and stores data in Firebase.  You can create new lists, add items to each list once it is created, then check off items that are completed.  The completed items are then displayed on the Completed list.</p>
    <br/>
    <p>The app also uses stateless functional components as much as possible.  For more check out the code <a href="https://github.com/matsad3547-tiy/wk-08-firebase-app" target="blank">here.</a></p>
  </div>
)

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
