import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager'
import SetlistCard from './SetlistCard'
import { FormControl } from '@material-ui/core'
import { Input } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { NativeSelect } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

// defines function to get current logged in user from local storage
function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

const emptyString = ""

const styles = {
  allCards: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent:'space-evenly',
    backgroundColor: 'lightblue',
    marginBottom: '66px'
  },
  // sectionContent: {
  //   display: 'flex',
  //   justifyContent:'center'
  // }
}

class SetlistList extends Component {

  state = {
    setlist: [],
    instruments: [],
    instrumentId: "",
    instrumentName: "",
    artistName: "",
    songTitle: "",
    loadingStatus: true
  }

  handleFieldChange = evt => {
    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
  }

  //Handles when instrument is changed in dropdown

  handleDropdownChange = evt => {
    this.setState({ loadingStatus: true })
    const newInstrument = {
      instrumentId: parseInt(evt.target.value)
    }
    ApiManager.patch("users", loggedInUserId(), newInstrument)
      .then(response => {
        this.setState({
          instrumentId: response.instrumentId
        })
      }
      )
      .then(() => ApiManager.get("users", loggedInUserId(), "_expand=instrument")
        .then(userObject => {
          this.setState({
            instrumentName: userObject.instrument.instrumentName
          })
        }))
  }

  //Handles all that dang ole rascally, rootin tootin mountin

  componentDidMount() {

    console.log('CDM ran')

    Promise.all([
      //Get all songs in setlist, create and array, and set array to value of state
      ApiManager.getAll("setlists", `userId=${loggedInUserId()}&_expand=song`),
      //Get all instruments, create and array, and set array to value of state
      ApiManager.getAll("instruments"),
      //Gets user object and assigns instrument id to state
      //TODO This fetch call is causing an error
      ApiManager.get("users", loggedInUserId())])
      .then(([setlistArray, instrumentArray, userObject]) => {
        this.setState({
          setlist: setlistArray,
          instruments: instrumentArray,
          instrumentId: userObject.instrumentId,
          loadingStatus: false
        })
      })
  }


  //Handles rerendering after data is added or deleted

  clearInputField = () => {
    console.log('please clear the fields')
    this.setState({
      artistName: emptyString,
      songTitle: emptyString
    })
  }

  setlistRerender = () => {
    ApiManager.getAll("setlists", `userId=${loggedInUserId()}&_expand=song`)
      .then(setlistArray => {
        this.setState({
          setlist: setlistArray,
        })
      })
      .then(()=> this.clearInputField())
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

  checkForSongInSetlist = (songObj) => {
    //ex fetch ttp://localhost:5002/setlists/?songId=1&userId=1
    return ApiManager.getAll("setlists", `songId=${songObj[0].id}&userId=${loggedInUserId()}`)
      .then(response => {
        if (response.length > 0) {
          return true
        } else {
          return false
        }
      }
      )
  }

  addSongToSetlist() {
    ApiManager.getAll("songs", `artistName=${this.state.artistName}&songTitle=${this.state.songTitle}`)
      .then(response => {
        this.checkForSongInSetlist(response)
          .then(bool => {
            if (!bool) {
              const newSetlistSong = {
                songId: response[0].id,
                userId: loggedInUserId()
              }
              ApiManager.post("setlists", newSetlistSong)
                .then(() => this.setlistRerender())
            } else {
              window.alert("This song is already in your setlist")
            }
          })
      })
  }
  //Delete song from setlist

  deleteSongFromSetlist = id => {
    ApiManager.delete("setlists", id)
      .then(() => this.setlistRerender())

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
            ApiManager.deezer(this.state.artistName, this.state.songTitle)
              .then(deezerResponse => {
                if (deezerResponse.data.length > 0) {
                  const song = {
                    songTitle: deezerResponse.data[0].title,
                    artistName: deezerResponse.data[0].artist.name,
                    deezerId: deezerResponse.data[0].id
                  }
                  ApiManager.post("songs", song)
                    .then(response => {
                      const newSetlistSong = {
                        songId: response.id,
                        userId: loggedInUserId()
                      }
                      ApiManager.post("setlists", newSetlistSong)
                        .then(() => this.setlistRerender())
                    })
                } else {
                  window.alert("Song not found. Please try search again.")
                }
              })

          } else {

            this.addSongToSetlist()
          }
        })
    }
  }

  render() {

    const { classes, ...other } = this.props;

    return (
      <>
        <section className="sectionContent">
          <FormControl className="form-top">
            <h3>Current Instrument:</h3>
            <NativeSelect
              id="instrumentId"
              name="instrumentId"
              value={this.state.instrumentId}
              onChange={this.handleDropdownChange}>
              {this.state.instruments.map(instrument =>
                <option key={instrument.id} value={instrument.id}>{instrument.instrumentName}
                </option>
              )}
            </NativeSelect>
            
            <h3>Add a song you know how to play to your setlist.</h3>
            <Input type="text"
              required
              className="form-control"
              onChange={this.handleFieldChange}
              id="artistName"
              placeholder="Artist Name"
            /><br />
            <Input type="text"
              required
              className="form-control"
              onChange={this.handleFieldChange}
              id="songTitle"
              placeholder="Song Title"
            />
            </FormControl>
            <br />
            <Button type="button" variant="contained" color="primary"  className="btn" onClick={this.constructNewSong}>Add Song</Button>
            <h3>Your Setlist</h3>
            <div className={classes.allCards}>
              {this.state.setlist.map(songInSet =>
                <SetlistCard
                  key={songInSet.id}
                  songTitle={songInSet.song.songTitle}
                  artistName={songInSet.song.artistName}
                  songInSet={songInSet}
                  deleteSong={this.deleteSongFromSetlist}
                  {...other}
                />
              )}
            </div>
          
        </section>
      </>
    )
  }
}

export default withStyles(styles)(SetlistList)