import React, { Component } from 'react';
import ApiManager from '../../modules/ApiManager';
import SetlistCard from '../matches/SetlistCard';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class BuddiesDetail extends Component {

  state = {
    name: "",
    instrument: "",
    detailsSetlist: [],
    loadingStatus: true,
    isThisMyBuddy: false
  }

  componentDidMount() {
  
    Promise.all([
      ApiManager.get("users", this.props.matchId, "_embed=setlists&_expand=instrument"),
      ApiManager.getAll("setlists", `userId=${this.props.matchId}&_expand=song`),
      ApiManager.getAll("buddies", `userId=${this.props.matchId}&loggedInUser=${loggedInUserId()}`)])
      .then(([user, currentSetlist, response]) => {
        this.setState({
          name: user.name,
          detailsInstrument: user.instrument.instrumentName,
          setlist: user.setlist,
          loadingStatus: false,
          detailsSetlist: currentSetlist,
          isThisMyBuddy: response.length > 0 ? true : false
        })
      })
    }

  handleSave = () => {
          const newBuddy = {
            loggedInUser: loggedInUserId(),
            userId: this.props.matchId
          }
          ApiManager.post("buddies", newBuddy)
            .then(() => this.setState({
              isThisMyBuddy: true
            }))
            .then(() => this.props.history.push("/buddies"))
        }

  handleDelete = () => {
          ApiManager.getAll("buddies", `userId=${this.props.matchId}&loggedInUser=${loggedInUserId()}`)
            .then(response => {
              ApiManager.delete("buddies", `${response[0].id}`)
            })
            .then(() => this.setState({
              isThisMyBuddy: false
            }))
            .then(() => this.props.history.push("/buddies"))
        }

  //TODO Create add friend function

  render() {

        return(
      <div className = "card" >
            <div className="card-content">
              <picture>
                <img src={`https://robohash.org/${this.state.name}`} alt="Current User" />
              </picture>
              <h3>Name: {this.state.name}</h3>
              <p>Instrument: {this.state.instrument}</p>
              <h2>Setlist</h2>
              <div className="userSetlist">
                {this.state.detailsSetlist.map(setlistSong =>
                  <SetlistCard
                    key={setlistSong.id}
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
