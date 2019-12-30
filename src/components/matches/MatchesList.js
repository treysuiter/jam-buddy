import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager'
import MatchesCard from '../matches/MatchesCard'
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import { FormControl, Button } from '@material-ui/core';

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
  filterButton: {
    marginLeft: '10px',
    marginBottom: '10px',
    marginTop: '10px',
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

class MatchesList extends Component {

  state = {
    songMatches: [],
    instruments: [],
    instrumentId: parseInt(localStorage.getItem("instrumentId")) !== null ? parseInt(localStorage.getItem("instrumentId")) : 1,
    loadingStatus: true
  }

  handleFieldChange = evt => {
    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
  }

  //Handles when instrument filter drop down is changed

  handleDropdownChange = evt => {
    this.setState({
      instrumentId: parseInt(evt.target.value),
    })
    localStorage.setItem("instrumentId", parseInt(evt.target.value))
  }

  componentDidMount() {

    //Finds all matches and sets the returned array to the matches value of state
    ApiManager.getAll("instruments")
      .then(instrumentArray => {
        this.setState({
          instruments: instrumentArray,
          loadingStatus: false
        })
      })
      .then(() => this.findMatches(this.state.instrumentId))
  }

  /* 
 
 This is the magic matching function! 
  
 It initializes three arrays: 
 One for logged in user's setlist, one for all other user's setlists, and one for matched users;
 It will loop through each user in the otherUsersSetlistArray, create a match object containing the current user's information to be pushed 
 to the matchesArray, loop through each song in the current otherUser's setlist, and test to see if each song is match in the 
 currently logged in user's setlist; If a match is found, the current match object us updated by incrementing the total 
 matches by one and the matched song id is pushed to an array property on the match object (note: no functionality is currently
 implemented with the matchIds property on the match object); After matching is complete, the matchesArray is returned with only objects that have
 a total value of greater than one and instrumentId of the same value as the filter by instrument drop down currently selected
 which is passed as an argument. The returned matches Array is also ordered to by the total property on each match obj from greatest 
 to least so that the returned matchesArray displays users with  the most matches first. Finally, songMatches in state is set to the value of the 
 matchesArray
 
 */

  findMatches(instrumentFilter) {

    //Creates an array of matches users with each entry containing an object that contains their name,
    //number of matches, all matching song ids and instrument name.
    const matchesArray = []
    let mySetlistArray = []
    let otherUsersSetlistArray = []

    ApiManager.getAll("users", "_embed=setlists")
      .then(response => {
        response.forEach(usersWithSetlist => {

          //Creates logged in user and others users setlist arrays
          if (usersWithSetlist.id === loggedInUserId()) {
            mySetlistArray.push(usersWithSetlist)
          } else {
            otherUsersSetlistArray.push(usersWithSetlist)
          }
        })
      })
      .then(() => {

        //initialize array of match objects index
        let index = 0

        //Loop thru users
        otherUsersSetlistArray.forEach(setlistByUser => {

          let matchObj = {
            id: setlistByUser.id,
            name: setlistByUser.name,
            instrumentId: setlistByUser.instrumentId,
            setlists: setlistByUser.setlists,
            matchIds: [],
            total: 0
          }

          matchesArray.push(matchObj)
          index++

          //Loop thru current user's songs in setlist
          setlistByUser.setlists.forEach(individualSetlist => {

            //Loop thru logged in user's songs in setlist and update object if match is found
            mySetlistArray[0].setlists.forEach(mySong => {

              if (individualSetlist.songId === mySong.songId) {

                matchesArray[index - 1].total++
                matchesArray[index - 1].matchIds.push(mySong.songId)

              }
            })
          })
        })
      })
      .then(() => {

        //Filters array by removing objects with no matches songs, orders by descending matches, and 
        let orderedArray = matchesArray.filter(matchesArrayEntry => {

          let moreThanZeroMatches = false
          if (matchesArrayEntry.total > 0 && (instrumentFilter > 1 ? matchesArrayEntry.instrumentId === instrumentFilter : true)) {
            moreThanZeroMatches = true
          }
          return moreThanZeroMatches
        })

        // sorts matchesArray by total property value of each object descending
        orderedArray.sort((a, b) => (a.total < b.total) ? 1 : ((b.total < a.total) ? -1 : 0))
        this.setState({
          songMatches: orderedArray
        })
      })
  }

  render() {

    const { classes, ...other } = this.props;

    return (

      <>
        <section className={classes.sectionContent}>
          <form>
            <h3 className={classes.pageText}>Select instrument filter:</h3>
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

            <Button type="button" value="Filter Matches" size="large" variant="contained" color="primary" className={classes.filterButton} onClick={() => this.findMatches(this.state.instrumentId)}>Filter Matches</Button>
          </form>
          <div className={classes.allCards}>
            {this.state.songMatches.map(matchObj =>
              <MatchesCard
                key={matchObj.id}
                matchObj={matchObj}
                songMatchTotal={matchObj.total}
                matchName={matchObj.name}
                songMatchIds={matchObj.matchIds}
                setlist={matchObj.setlists}
                {...other}
              />)}
          </div>
        </section>
      </>
    )
  }
}

export default withStyles(styles)(MatchesList)