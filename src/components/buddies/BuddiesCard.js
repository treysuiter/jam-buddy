import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class BuddiesCard extends Component

{

render () {
  return (
    <>
    <div className="card">
          <h3>{this.props.buddyName}</h3>
          <Link to={`/buddiesDetails/${this.props.matchObj.id}` }><button>Details</button></Link>
        </div>
    </>
  )
}

}