import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager'
import SetlistCard from './SetlistCard'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

//initializes default option variable for instrument dropdown
let defaultOption = ""

// defines function to get current logged in user from local storage
function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class SetlistList extends Component {

  state = {
    setlist: [],
    instruments: [],
    artistName: "",
    songTitle: "",
    loadingStatus: true
  }

  handleFieldChange = evt => {
    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
  }

  componentDidMount() {

    ApiManager.getAll("setlists", `userId=${loggedInUserId()}&_expand=song`)
      .then(setlistArray => {
        this.setState({
          setlist: setlistArray,
          loadingStatus: false
        })
      })
    ApiManager.getAll("instruments")
      .then(instrumentArray => {
        this.setState({
          instruments: instrumentArray,
          loadingStatus: false
        })
        defaultOption = this.state.instruments[0].instrumentName
      })
  }

  //Checks for existing song in database

  checkForSongInDatabase = () => {
    return ApiManager.getAll("songs", `artistName=${this.state.artistName}&songTitle=${this.state.songTitle}`)
      .then(response => {
        if (response.length === 0) {
          return false
        } else {
          return true
        }
      }
      )
  }

  //Adds song to database

  addNewSongToDatabase(song) {

    ApiManager.post("songs", song)
      .then(response => {
        const newSetlistSong = {
          songId: response.id,
          userId: loggedInUserId()
        }
        ApiManager.post("setlists", newSetlistSong)
      })
  }

  //Adds song to setlist join table

  addSongToSetlist() {
    ApiManager.getAll("songs", `artistName=${this.state.artistName}&songTitle=${this.state.songTitle}`)
      .then(response => {
        const newSetlistSong = {
          songId: response[0].id,
          userId: loggedInUserId()
        }
        ApiManager.post("setlists", newSetlistSong)
      })
  }

  //Delete song from setlist

  deleteSongFromSetlist = id => {
    ApiManager.delete("setlists", id)
      .then(ApiManager.getAll("setlists", `userId=${loggedInUserId()}&_expand=song`)
        .then(setlistArray => {
          this.setState({
            setlist: setlistArray,
            loadingStatus: false
          })
        }))

  }

  // Handles action after Add Song button is clicked; checks for filled out song title and artist name fields; 
  // checks for songs already in database and adds song to database if not present; adds song to setlist

  constructNewSong = evt => {

    evt.preventDefault()

    if (this.state.artistName === "" || this.state.songTitle === "") {
      window.alert("Please input artist name and song title")

    } else {

      this.setState({ loadingStatus: true })
      this.checkForSongInDatabase()
        .then(bool => {
          if (!bool) {
            const song = {
              songTitle: this.state.songTitle,
              artistName: this.state.artistName,
              deezerId: ""
            }
            this.addNewSongToDatabase(song)
            // this.addSongToSetlist()

          } else {

            this.addSongToSetlist()
          }
        })
    }
  }

  render() {

    return (
      <>
        <section className="section-content">
          <form>
            <Dropdown options={this.state.instruments.map(intName => intName.instrumentName)} onChange={this._onSelect} value={defaultOption} placeholder="Select your instrument" />
            <input type="text"
              required
              className="form-control"
              onChange={this.handleFieldChange}
              id="artistName"
              placeholder="Artist Name"
            />
            <input type="text"
              required
              className="form-control"
              onChange={this.handleFieldChange}
              id="songTitle"
              placeholder="Song Title"
            />
            <br />
            <button type="button" className="btn" onClick={this.constructNewSong}>Add Song</button>
            <h1>Your Setlist</h1>
            <div className="container-cards">
              {this.state.setlist.map(songInSet =>
                <SetlistCard
                  key={songInSet.id}
                  songTitle={songInSet.song.songTitle}
                  artistName={songInSet.song.artistName}
                  songInSet={songInSet}
                  deleteSong={this.deleteSongFromSetlist}
                  {...this.props}
                />
              )}
            </div>
          </form>
        </section>
      </>
    )
  }
}
