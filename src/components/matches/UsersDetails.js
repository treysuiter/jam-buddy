import React, { Component } from 'react';
import ApiManager from '../../modules/ApiManager';
import SetlistCard from './SetlistCard';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class UsersDetail extends Component {

  state = {
    name: "",
    instrument: "",
    detailsSetlist: [],
    loadingStatus: true
  }

  componentDidMount() {

    //Ex. fetch http://localhost:5002/users/1?_embed=setlists&_expand=instruments
    ApiManager.get("users", this.props.matchId, "_embed=setlists&_expand=instrument")
      .then((user) => {
        this.setState({
          name: user.name,
          instrument: user.instrument.instrumentName,
          setlist: user.setlist,
          loadingStatus: false
        });
      });
    //Ex. fetch http://localhost:5002/setlists?userId=1&_expand=song
    ApiManager.getAll("setlists", `userId=${this.props.matchId}&_expand=song`)
      .then((currentSetlist) => {
        this.setState({
          detailsSetlist: currentSetlist
        });
      })
  }
  //   handleDelete = () => {
  //     //invoke the delete function in AnimalManger and re-direct to the animal list.
  //     this.setState({loadingStatus: true})
  //     ApiManager.delete("buddies", this.props.matchId)
  //     .then(() => this.props.history.push("/matches"))
  // }

  handleSave = () => {
    const newBuddy = {
      loggedInUser: loggedInUserId(),
      userId: this.props.matchId
    }
    ApiManager.post("buddies", newBuddy)
  }

  //TODO Create add friend function

  render() {

    return (
      <div className="card">
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
          <button type="button" disabled={this.state.loadingStatus} onClick={() => this.props.history.push("/matches")}>Back</button>
          <button type="button" disabled={this.state.loadingStatus} onClick={this.handleSave}>Add Buddy</button>
          <button type="button" disabled={this.state.loadingStatus}>Remove Buddy</button>
        </div>
      </div>
    );
  }
}
