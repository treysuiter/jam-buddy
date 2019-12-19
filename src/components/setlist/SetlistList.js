import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager'
import SetlistCard from './SetlistCard'
import { FormControl } from '@material-ui/core'
// import { Input } from '@material-ui/core'
import Button from '@material-ui/core/Button'
// import { NativeSelect } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select';

// defines function to get current logged in user from local storage
function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: '10px',
    width: 250
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  allCards: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    backgroundColor: 'lightblue',
  },
  dropdown: {
    marginLeft: '10px',
    width: 250,
    fontSize: 18
  },
  addSongButton: {
    marginLeft: '10px',
    width: 200,
  },
  pageText: {
    marginLeft: '15px',
  },
  sectionContent: {
    height: '100%',
    marginBottom: 56
  },
};

class SetlistList extends Component {

  state = {
    setlist: [],
    instruments: [],
    instrumentId: "",
    instrumentName: "",
    artistName: "",
    songTitle: "",
    deezerId: "",
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

    Promise.all([
      //Get all songs in setlist, create and array, and set array to value of state
      ApiManager.getAll("setlists", `userId=${loggedInUserId()}&_expand=song`),
      //Get all instruments, create and array, and set array to value of state
      ApiManager.getAll("instruments"),
      //Gets user object and assigns instrument id to state
      //TODO This fetch call is causing an error
      ApiManager.get("users", loggedInUserId())
    ])
      .then(([setlistArray, instrumentArray, userObject]) => {
        this.setState({
          setlist: setlistArray.reverse(),
          instruments: instrumentArray,
          instrumentId: userObject.instrumentId,
          loadingStatus: false
        })
      })
  }


  //Handles rerendering after data is added or deleted

  setlistRerender = () => {
    ApiManager.getAll("setlists", `userId=${loggedInUserId()}&_expand=song`)
      .then(setlistArray => {
        this.setState({
          setlist: setlistArray.reverse()
        })
      })
  }

  //Checks for existing song in database

  checkForSongInDatabase = (deezerId) => {
    return ApiManager.getAll("songs", `deezerId=${deezerId}`)
      .then(response => {
        if (response.length > 0) {
          return true
        } else {
          return false
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

  addSongToSetlist(deezerId) {
    ApiManager.getAll("songs", `deezerId=${deezerId}`)
      .then(response => {
        this.checkForSongInSetlist(response)
          .then(bool => {
            if (bool === false) {
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
    this.setState({ loadingStatus: true })

    if (this.state.artistName === "" || this.state.songTitle === "") {
      window.alert("Please input artist name and song title")

    } else {

      ApiManager.deezer(this.state.artistName, this.state.songTitle)
        .then(deezerResponse => {
          if (deezerResponse.data.length === 0) {
            window.alert("Song not found. Please try search again.")
          } else {
            this.setState({
              artistName: deezerResponse.data[0].artist.name,
              songTitle: deezerResponse.data[0].title,
              deezerId: deezerResponse.data[0].id
            })

            this.checkForSongInDatabase(this.state.deezerId)
              .then(bool => {
                if (!bool) {
                  const song = {
                    songTitle: this.state.songTitle,
                    artistName: this.state.artistName,
                    deezerId: this.state.deezerId
                  }
                  ApiManager.post("songs", song)
                    .then(response => {
                      const newSetlistSong = {
                        songId: response.id,
                        userId: loggedInUserId()
                      }
                      ApiManager.post("setlists", newSetlistSong)
                        .then(() => {
                          this.setlistRerender()
                        })
                    })
                } else {
                  this.addSongToSetlist(this.state.deezerId)
                }
              })
          }
        }
        )
    } evt.target.reset()
  }

  // evt.target.reset()

  render() {

    const { classes, ...other } = this.props;

    return (
      <>

        <section className={classes.sectionContent}>
          <h3 className={classes.pageText}>Current Instrument:</h3>
          <FormControl>
            <Select
              native
              variant="outlined"
              className={classes.dropdown}
              id="instrumentId"
              name="instrumentId"
              value={this.state.instrumentId}
              onChange={this.handleDropdownChange}>
              {this.state.instruments.map(instrument =>
                <option key={instrument.id} value={instrument.id}>{instrument.instrumentName}
                </option>
              )}
            </Select>

          </FormControl>
          <form onSubmit={this.constructNewSong}>
            <h3 className={classes.pageText}>Add a song you know how to play to your setlist.</h3>
            <FormControl>
              <TextField
                required
                className={classes.textField}
                onChange={this.handleFieldChange}
                id="artistName"
                label="Artist Name"
                margin="normal"
                variant="outlined"
              />
            </FormControl>
            <br />
            <FormControl>
              <TextField
                required
                className={classes.textField}
                onChange={this.handleFieldChange}
                id="songTitle"
                label="Song Title"
                margin="normal"
                variant="outlined"
              />
            </FormControl>
            <br />
            <Button type="submit" value="Submit" size="large" variant="contained" color="primary" className={classes.addSongButton}>Add Song</Button>
          </form>
          <h3 className={classes.pageText}>Your Setlist</h3>
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