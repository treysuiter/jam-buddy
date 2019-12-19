import React, { Component } from 'react';

export default class SongCard extends Component {

  render() {

    console.log(this.props.isThisSongInMySetlist, "what is this bool?")
 
    return (
      (
        <div className="card">
          <h3>{this.props.songName}</h3>
        </div>
      )
    )
  }
}