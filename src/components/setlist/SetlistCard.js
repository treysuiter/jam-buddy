import React, { Component } from 'react';

export default class SetlistCard extends Component {

  render() {
    return (
      <div className="card">
        <h3>{this.props.songTitle}</h3>
        <h4>by: {this.props.artistName}</h4>
        <button type="button" className="btn">Delete</button>
      </div>
    )
  }
}