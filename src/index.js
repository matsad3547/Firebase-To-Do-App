import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Routes from './modules/App'


render(
  <Router history={browserHistory}>
    <Routes />
  </Router>
  , document.getElementById('app'))
