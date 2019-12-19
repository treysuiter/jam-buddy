import React, { Component } from 'react';
import ApiManager from '../../modules/ApiManager';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class SongCard extends Component {

  state = {
    isSongInMySet: false
  }

  componentDidMount() {
    console.log(this.props.songName, 'song name')
    console.log(this.props.setlistSong.id, "song id")

    ApiManager.getAll("setlists", `userId=${loggedInUserId()}&songId=${this.props.setlistSong.songId}`)
      .then(response => {
        console.log(response, "this si the response from match style fetch")
        if (response.length > 0) {
          this.setState({
            isSongInMySet: true
          })
        }
      })
  }

  render() {

    console.log(this.state.isSongInMySet, "match bool")

    return (
      <div className="card">
        <h3> {this.state.isSongInMySet ? <h1>{this.props.songName}</h1> : this.props.songName}</h3>
      </div>
    )
  }
}