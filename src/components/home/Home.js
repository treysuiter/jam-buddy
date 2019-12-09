import React, { Component } from 'react'

export default class Home extends Component {

  render () {

    return (
      <>
      Welcome to JamBuddy!<br />
      Find a buddy. And Jam!<br />
      <button type="button" className="btn" onClick={() => { this.props.history.push("/registration") }}>Registration</button><br />
      <button type="button" className="btn" onClick={() => { this.props.history.push("/login") }}>Login</button>
      </>
    )
  }
}