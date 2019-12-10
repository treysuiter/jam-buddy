import React, { Component } from 'react';

export default class SetlistCard extends Component {

  render() {
    return (
      <div className="card">
        <h2>{this.props.songTitle}</h2>
        <button type="button" className="btn">Delete</button>
      </div>
    )
  }
}