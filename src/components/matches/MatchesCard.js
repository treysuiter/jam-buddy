import React, { Component } from 'react'

export default class MatchesCard extends Component {

  render() {

    return (
      (
        <div className="card">
          <h3>{this.props.matchName}</h3>
          <h4>{this.props.songMatchTotal}</h4>
          <button type="button" className="btn" onClick={() => this.props.seeDetails(this.props.match.id)}>Details</button>
        </div>
      )
    )
  }
}