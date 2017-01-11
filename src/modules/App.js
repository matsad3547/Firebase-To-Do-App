import React from 'react'
import { BrowserRouter, Match, Miss, Link } from 'react-router'

import fbRef from './fbRef'

const App = () => {

  const listTitles = ['things', 'stuff', 'poop']

  return (
    <BrowserRouter>
      <div >
        <h1>The Doozer</h1>
        <h3>Do Some Stuff!</h3>
        <ul>
          <li className="nav"><Link to="/lists">Lists</Link></li>
          <li className="nav menu"><Link to="/">Home</Link></li>
          <li className="nav menu"><Link to="/about">About</Link></li>
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
      <CompletedList />
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

    let toDoObj = this.state.toDoObj

    let listTitles = Object.keys(toDoObj).filter( title => title != 'completed')
    // console.log('list titles:', listTitles);

    let pathname = this.props.pathname

    const getToDoList = (listTitle) => toDoObj[listTitle]

    return(
      <div>

        <ul className="listlinks">
          {listTitles.map( (listTitle, i) => <li className="nav" key={i}><Link to={`${pathname}/${listTitle}`}>{listTitle}</Link></li>
          )}
        </ul>

        <Match pattern={pathname} exactly render={ () =>
            <h3>Please Select a List</h3>
          } />
        <Match pattern={`${pathname}/:listTitle`} component={(props) => <List {...props} toDoObj={toDoObj}/>}/>
      </div>
    )
  }
}
class CompletedList extends React.Component {

  	constructor () {
  		super()
  		this.state = {
  			toDoObj: {
          completed: 'none'
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

    let toDoObj = this.state.toDoObj

    let completed = Object.values(toDoObj.completed)
    // console.log('list titles:', listTitles);

    return(
      <div className='list'>
  			<h4>Completed Tasks</h4>
  			{completed.map( (task, i) =>
  				<li key={i} className="completed">{task}</li>
  			)}
  		</div>
    )
  }
}

class List extends React.Component{
  constructor(props) {
    super(props)
    this.handleToDoSubmit=this.handleToDoSubmit.bind(this)
  }

	 handleToDoSubmit (e, props) {
		e.preventDefault()
    const listTitle = this.props.params.listTitle
		let task = this.input.value
		let fbListRef = fbRef.child(listTitle);
		let taskId = fbListRef.push().key
		let updates = {}
		let updateListTitle = listTitle + '/'
		updates[updateListTitle + taskId] = task
		fbRef.update(updates)
		this.input.value = ''
	}

  render() {

    let { params, toDoObj } = this.props

    const listTitle = this.props.params.listTitle

    let toDos = Object.values(toDoObj[listTitle])
    console.log('todos at List:', toDos);
    return (
      <div className='list'>
        <h3>{listTitle}</h3>
        <form onSubmit={this.handleToDoSubmit}>
          <input type="text" placeholder="New Task" className="form" id="listInput" ref={ node => this.input = node}/> {' '}
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
