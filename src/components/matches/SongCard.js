import React, { Component } from 'react';
import ApiManager from '../../modules/ApiManager';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class SongCard extends Component {

  state = {
    isSongInMySet: false
  }

  componentDidMount() {

    ApiManager.getAll("setlists", `userId=${loggedInUserId()}&songId=${this.props.setlistSong.songId}`)
      .then(response => {
        if (response.length > 0) {
          this.setState({
            isSongInMySet: true
          })
        }
      })
  }

  render() {

    return (
      <div className="card">
        <h3> {this.state.isSongInMySet ? <i>{this.props.songName}</i> : this.props.songName}</h3>
      </div>
    )
  }
}