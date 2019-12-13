import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class MatchesCard extends Component {

  render() {
 
    return (
      (
        <div className="card">
          <h3>{this.props.matchName}</h3>
          <h4>Setlist Matches: {this.props.songMatchTotal}</h4>
          <Link to={`/userDetails/${this.props.matchObj.id}`}><button>Details</button></Link>
        </div>
      )
    )
  }
}