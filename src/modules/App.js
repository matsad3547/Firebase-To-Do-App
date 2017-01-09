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
import { BrowserRouter, Match, Miss, Link } from 'react-router'
import NavLink from './NavLink'
import * as firebase from 'firebase'

// firebase.initializeApp(config);

const fbRef = firebase
  .initializeApp(config)
  .database()
  .ref()
  .child('test1')

const App = () => {

  const listTitles = ['things', 'stuff', 'poop']

  return (
    <BrowserRouter>
      <div >
        <h1>The Doozer</h1>
        <h3>Do Some Stuff!</h3>
        <ul className="nav">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/lists">Lists</Link></li>
        </ul>

        <hr/>

        <Match exactly pattern="/" component={Home} />
        <Match pattern="/about" component={About} />
        <Match pattern="/lists" component={Lists} />

        <Miss component={NoMatch} />

      </div>
    </BrowserRouter>
  )
}

export default App

const NoMatch = () => (
  <div>
    <h3>Sorry!</h3>
    <p>{location.pathname} does not match any pages</p>
  </div>
)

const Home = () => {

  return (
    <div>
      <CreateList
        fbRef={fbRef}
        />
    </div>
  )
}

const CreateList = ({ fbRef }) => {

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

const About = () => (
  <div>
    <h2>About</h2>
    <p>This is a To-Do app with a terrible name that uses React + Router and stores data in Firebase.  You can create new lists, add items to each list once it is created, then check off items that are completed.  The completed items are then displayed on the Completed list.</p>
    <br/>
    <p>The app also uses stateless functional components as much as possible.  For more check out the code <a href="https://github.com/matsad3547-tiy/wk-08-firebase-app" target="blank">here.</a></p>
  </div>
)

class Lists extends React.Component {

  	constructor () {
  		super()
  		this.state = {
  			toDoObj: {
          standInTitle: 'standinTitle'
        },
  		}
  	}

  	componentDidMount () {
  		fbRef.on('value', snapshot => {
  			let toDoObj = snapshot.val()
  			this.setState({
  				toDoObj,
  			})
  		})
  	}

  render () {

    let listTitles = Object.keys(this.state.toDoObj).filter( title => title != 'completed')
    // console.log('list titles:', listTitles);

    let pathname = this.props.pathname

    const getToDoList = (listTitle) => this.state.toDoObj[listTitle]

    return(
      <div>
        <Match pattern={pathname} exactly render={ () =>
            <h3>Please Select a List</h3>
          } />
          <Match pattern={`${pathname}/:listTitle`} component={List} />

        <ul className="listlinks">
          {listTitles.map( (listTitle, i) => <li key={i}><Link to={{
            pathname: `${pathname}/${listTitle}`,
            query: getToDoList(listTitle),
          }}>{listTitle}</Link></li>
          )}
        </ul>
      </div>
    )
  }
}

const List = ({ params, location }) => {

	let toDos = Object.values(location.query)
  console.log('todos at List:', toDos);

  let listTitle = params.listTitle

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

const ToDoItems = ({ toDos, listTitle }) => {

	let input

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


// <CompletedList
//   fbRef={fbRef}
//   completed={completed}
//   />

// class Routes extends React.Component {
//
//   constructor () {
// 		super()
// 		this.state = {
// 			toDoObj: {
// 				completed: {},
//         standInTitle: {},
// 			},
// 		}
// 	}
//
// 	componentWillMount () {
//     console.log('mounting!');
// 		fbRef.on('value', snapshot => {
// 			let toDoObj = snapshot.val()
// 			this.setState({
// 				toDoObj: toDoObj,
// 			})
// 		})
// 	}
//
//   render() {
//
//     let listTitles = Object.keys(this.state.toDoObj).filter( title => title != 'completed')
//
//     const completed = ['dummy completed 1', 'dummy completed 2']
//
// 		// let completed = Object.values(this.state.toDoObj.completed)
//     // console.log('completed at App:', completed);
//
//     // const homeComponent = (props) => <Home {...props} completed={completed} />
//
//     const homeComponent = (props) => {
//       console.log('Passing completed:', completed);
//       return <Home {...props} completed={completed} />
//     }
//
//     return (
//
//       <Route path="/" component={homeComponent}>
//         <Route path="/home" component={homeComponent} />
//         <Route path="/lists" component={
//             (props) => <Lists {...props} listTitles={listTitles} />
//         }>
//           <Route path="/lists/:listTitle" component={List}/></Route>
//         <Route path="/about" component={About}/>
//       </Route>
//
//     )
//   }
// }

// <Router history={browserHistory}>
//   <Route path="/" component={App}>
//     <IndexRoute component={Home}/>
//     <Route path="/home" component={Home}/>
//     <Route path="/lists" component={(props) => <Lists {...props} listTitles={listTitles} />
//     }>
//       <Route path="/lists/:listTitle" component={List}/></Route>
//     <Route path="/about" component={About}/>
//   </Route>
// </Router>


// export class Home extends React.Component {
//
// 	constructor () {
// 		super()
// 		this.state = {
// 			toDoObj: {
// 				completed: {},
//         standInTitle: {},
// 			},
// 		}
// 	}
//
// 	componentDidMount () {
// 		fbRef.on('value', snapshot => {
// 			let toDoObj = snapshot.val()
// 			this.setState({
// 				toDoObj: toDoObj,
// 			})
// 		})
// 	}
//
// 	render () {
//
// 		let listTitles = Object.keys(this.state.toDoObj).filter( title => title != 'completed')
//
// 		let completed = Object.values(this.state.toDoObj.completed)
//
// 		return (
//       <div>
//         <CreateList
//           fbRef={fbRef}
//           />
// 				<CompletedList
// 					fbRef={fbRef}
// 					completed={completed}
// 					/>
//       </div>
// 		)
// 	}
// }
// <ListsWrapper
//   fbRef={fbRef}
//   listTitles={listTitles}
//   />

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




//  class List extends React.Component{
//
//   	constructor () {
//   		super()
//       this.handleToDoSubmit = this.handleToDoSubmit.bind(this)
//       this.handleOnInput = this.handleOnInput.bind(this)
//       this.retrieveToDoObj = this.retrieveToDoObj.bind(this)
//
//   		this.state = {
//   			toDoObj: {
//   				completed: {},
//           standInTitle: {},
//   			},
//         value: null,
//         listTitle: null,
//   		}
//   	}
//
//     retrieveToDoObj (snapshot) {
//       let toDoObj = snapshot.val()
//       this.setState({
//         toDoObj: toDoObj,
//       })
//     }
//
//   	componentWillMount () {
//   		fbRef.on('value', this.retrieveToDoObj)
//       this.setState({
//         listTitle: this.props.params.listTitle,
//       })
//       console.log('mounting!');
//   	}
//
//     // componentWillUnmount () {
//     //   fbRef.off('value', this.retrieveToDoObj)
//     //   console.log('unmounting!')
//     // }
//
//     handleToDoSubmit (e) {
//     		e.preventDefault()
//     		let task = this.state.value
//     		let fbListRef = fbRef.child(this.state.listTitle);
//     		let taskId = fbListRef.push().key
//     		let updates = {}
//     		let updateListTitle = this.state.listTitle + '/'
//     		updates[updateListTitle + taskId] = task
//     		fbRef.update(updates)
//         console.log('setting state.value');
//     		this.setState({
//           value: '',
//         })
//     	}
//
//     handleOnInput (e) {
//       this.setState({
//         value: e.target.value,
//         })
//     }
//
//   render() {
//
//     let listTitle = this.state.listTitle
//     // console.log('list title:', listTitle);
//
//     // console.log('to do obj:', this.state.toDoObj);
//
//     let toDos = Object.values(this.state.toDoObj[listTitle])
//
//     // console.log('to dos:', toDos);
//
//     return (
//       <div className='list'>
//   			<h3>{this.props.params.listTitle}</h3>
//   			<form onSubmit={this.handleToDoSubmit}>
//   				<input type="text" placeholder="New Task" className="form" id="listInput" onInput={this.handleOnInput} value={this.state.value} /> {' '}
//   				<button className="form" type="submit">Add</button>
//   			</form>
//   			<ul>
//   				<li className="label">Done?</li>
//   				<li className="label">To-Do Item</li>
//   			</ul>
//   			<ToDoItems
//   				toDos={toDos}
//   				fbRef={fbRef}
//   				listTitle={listTitle}
//   				/>
//   		</div>
//     )
//   }
// }

// <div>
//   <h2>{this.props.params.listTitle}</h2>
// </div>








//

//
// const CompletedList = (props) => {
//
// 	const { completed } = props
//
//   console.log('props at Completed:', props);
//   // console.log('completed:', completed);
//
//
// 	return (
// 		<div className='list'>
// 			<h4>Completed Tasks</h4>
// 			{completed.map( (task, i) =>
// 				<li key={i} className="completed">{task}</li>
// 			)}
// 		</div>
// 	)
// }
