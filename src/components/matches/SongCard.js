import React, { Component } from 'react';
import ApiManager from '../../modules/ApiManager';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }




export default class SongCard extends Component {

  state = {
    isSongInMySet: false
  }

  componentDidMount() {

    ApiManager.getAll("setlists", `userId=${loggedInUserId()}&songId=${this.props.setlistSong.id}`)
      .then(response => {
        console.log(response, response.length > 0, "wha is this reponse")
        if (response.length > 0) {
          this.setState({
            isSongInMySet: true
          })
        }
      })
  }

  render() {

    console.log(this.state.isSongInMySet, "what is this bool?")

    return (
      <div className="card">
        <h3> {this.state.isSongInMySet ?  <h1>{this.props.songName} </h1> : this.props.songName}</h3>
      </div>
    )
  }
}