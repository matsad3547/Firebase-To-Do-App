import React from 'react'
import { Link } from 'react-router'
import * as firebase from "firebase";

export default React.createClass({

  handleSubmit: function(e) {
    e.preventDefault();
    if (this.state.text && this.state.text.trim().length !== 0) {
      this.firebaseRef.push({
        text: this.state.text
      });
      this.setState({
        text: ''
      });
    }
  },

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
