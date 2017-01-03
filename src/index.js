import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { App, Home, Lists, List, About, listTitles} from './modules/App'
// import About from './modules/About'
// import Repos from './modules/Repos'
// import Repo from './modules/Repo'
// import Home from './modules/Home'
// import Routes from './modules/Routes'

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/home" component={Home}/>
      <Route path="/about" component={About}/>
    </Route>
  </Router>
), document.getElementById('app'))

// <Route path="/lists" component={Lists}/>
// <Route path="/lists/:listName" component={List}/>
