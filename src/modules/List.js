import React from 'react'
import { Link } from 'react-router'
import ToDoItems from './ToDoItems'

export default React.createClass({
  render() {
    return (
      <div className='list'>
        <ul>
          <li>Done?</li>
          <li>To-Do Item</li>
        </ul>
        <ToDoItems />
      </div>
    )
  }
})
