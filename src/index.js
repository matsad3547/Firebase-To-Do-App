import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './modules/App'
// { Home, Lists, List, About }
// import About from './modules/About'
// import Repos from './modules/Repos'
// import Repo from './modules/Repo'
// import Home from './modules/Home'
// import Routes from './modules/Routes'

// const listTitles = ['test', 'stuff']

render(<App />, document.getElementById('app'))

// render((
  // <Router history={browserHistory}>
  //   <Route path="/" component={App}>
  //     <IndexRoute component={Home}/>
  //     <Route path="/home" component={Home}/>
  //     <Route path="/lists" component={
  //         (props) => <Lists {...props} listTitles={listTitles} />
  //     }>
  //       <Route path="/lists/:listTitle" component={List}/>
  //     </Route>
  //     <Route path="/about" component={About}/>
  //   </Route>
  // </Router>
// ), document.getElementById('app'))
