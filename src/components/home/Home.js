import React, { Component } from 'react'
import Button from '@material-ui/core/Button'

export default class Home extends Component {

  render () {

    return (
      <>
      Welcome to JamBuddy!<br />
      Find a buddy. And Jam!<br />
      <Button type="button" variant="contained" color="primary" href="#contained-buttons" className="btn" onClick={() => { this.props.history.push("/registration") }}>Registration</Button><br />
      <Button type="button" variant="contained" color="secondary" href="#contained-buttons" className="btn" onClick={() => { this.props.history.push("/login") }}>Login</Button>
      </>
    )
  }
}