import React from 'react'
import NavLink from './NavLink'
import CreateList from './CreateList'
import List from './List'
import FinishedList from './FinishedList'

export default React.createClass({
  render() {
    return (
      <div>
        <h1>The Doozer</h1>
        <h2>Do Some Stuff!</h2>
        <ul role="nav">

        </ul>
        <CreateList />
        <List />
        <FinishedList />
        {this.props.children}
      </div>
    )
  }
})
//
// <li><NavLink to="/" onlyActiveOnIndex>Home</NavLink></li>
// <li><NavLink to="/about">About</NavLink></li>
// <li><NavLink to="/repos">Repos</NavLink></li>
//
