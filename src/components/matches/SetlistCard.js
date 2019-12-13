import React, { Component } from 'react';

export default class SetlistCard extends Component {

  render() {
 
    return (
      (
        <div className="card">
          <h3>{this.props.songName}</h3>
        </div>
      )
    )
  }
}