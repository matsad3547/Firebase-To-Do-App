import React from 'react'
import { Link } from 'react-router'

export default React.createClass({
  render() {
    return (
      <div>
        <h3>Create a New To-Do List</h3>
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="New List Name"/> {' '}
          <button type="submit">Go</button>
        </form>
      </div>
    )
  }
})
