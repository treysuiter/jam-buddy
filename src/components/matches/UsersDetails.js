import React, { Component } from 'react';
import ApiManager from '../../modules/ApiManager';
import SongCard from './SongCard';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class UsersDetail extends Component {

  state = {
    name: "",
    email: "",
    detailsInstrument: "",
    detailsSetlist: [],
    loadingStatus: true,
    isThisMyBuddy: false
  }

  componentDidMount() {

    Promise.all([
      ApiManager.get("users", this.props.matchId),
      ApiManager.get("users", this.props.matchId, "_embed=setlists&_expand=instrument"),
      ApiManager.getAll("setlists", `userId=${this.props.matchId}&_expand=song`),
      ApiManager.getAll("buddies", `userId=${this.props.matchId}&loggedInUser=${loggedInUserId()}`)])
        .then(([email, detailsUser, currentSetlist, response]) => {
          this.setState({
            name: detailsUser.name,
            email: email.email,
            detailsInstrument: detailsUser.instrument.instrumentName,
            loadingStatus: false,
            detailsSetlist: currentSetlist,
            isThisMyBuddy: response.length > 0 ? true : false
          })
        })
  }

  isThisSongInMySetlist = (songId) => {
    //ex fetch http://localhost:5002/setlists?userId=1&songId=3
    ApiManager.getAll("setlists", `userId=${loggedInUserId()}&songId=${songId}`)
    .then(response => {
      console.log(response, "wha is this reponse from styling api fetch?")
      if (response.length > 0) {
        return true
      } else {
        return false
      }
    })

  }

  handleSave = () => {
    const newBuddy = {
      loggedInUser: loggedInUserId(),
      userId: this.props.matchId
    }
    ApiManager.post("buddies", newBuddy)
      // .then(() => this.setState({
      //   isThisMyBuddy: true
      // }))
      .then(() => this.props.history.push("/matches"))
  }

//TODO refactor this like in buddies details

  handleDelete = () => {
    ApiManager.getAll("buddies", `userId=${this.props.matchId}&loggedInUser=${loggedInUserId()}`)
      .then(response => {
        ApiManager.delete("buddies", `${response[0].id}`)
      })
      // .then(() => this.setState({
      //   isThisMyBuddy: false
      // }))
      .then(() => this.props.history.push("/matches"))
  }

  render() {

    return (
      <div className="card">
        <div className="card-content">
          <picture>
            <img src={`https://robohash.org/${this.state.name}`} alt="Current User" />
          </picture>
          <h3>Name: {this.state.name}</h3>
          <h3>Email: {this.state.email}</h3>
          <p>Instrument: {this.state.detailsInstrument}</p>
          <h2>Setlist</h2>
          <div className="userSetlist">
            {this.state.detailsSetlist.map(setlistSong =>
              <SongCard
                key={setlistSong.id}
                isThisSongInMySetlist={this.isThisSongInMySetlist(setlistSong.id)}
                setlistSong={setlistSong}
                songName={setlistSong.song.songTitle}
                {...this.props}
              />)}
          </div>
          <button type="button" disabled={this.state.loadingStatus} onClick={() => this.props.history.goBack()}>Back</button>
          {this.state.isThisMyBuddy ? null : <button type="button" disabled={this.state.loadingStatus} onClick={this.handleSave}>Add Buddy</button>}
          {this.state.isThisMyBuddy ? <button type="button" disabled={this.state.loadingStatus} onClick={this.handleDelete}>Remove Buddy</button> : null}
        </div>
      </div>
    );
  }
}
