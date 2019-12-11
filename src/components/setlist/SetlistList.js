import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager'
import SetlistCard from './SetlistCard'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

let defaultOption = ""

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

  addNewSongToDatbase() {
    const song = {
      songTitle: this.state.songTitle,
      artistName: this.state.artistName,
      deezerId: ""
    }
    ApiManager.post("songs", song)
  }

  getSongId() {
    return ApiManager.getAll("songs", `artistName=${this.state.artistName}&songTitle=${this.state.songTitle}`)
  }


  constructNewSong = evt => {

    evt.preventDefault()

    if (this.state.artistName === "" || this.state.songTitle === "") {
      window.alert("Please input artist name and song title")

    } else {

      this.setState({ loadingStatus: true })

      this.checkForSongInDatabase()
        .then(bool => {
          if (!bool) {
            console.log("the song was NOT found")
            this.addNewSongToDatbase()
            this.getSongId()
              .then(response => {
                console.log("response if song was NOT found", response[0])
                const newSetlistSong = {
                  songId: response[0].id,
                  userId: loggedInUserId()
                }

                ApiManager.post("setlists", newSetlistSong)
              })

          } else {

            console.log("the song was found")
            this.getSongId()
              .then(response => {
                console.log("response if song was found", response[0])
                const newSetlistSong = {
                  songId: response[0].id,
                  userId: loggedInUserId()
                }
                ApiManager.post("setlists", newSetlistSong)
              })
          }
        })
    }
  }

  //post, getAll, setState


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
                  songInSet={songInSet}
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
