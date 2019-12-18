import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager'
import MatchesCard from '../matches/MatchesCard'
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';

// defines function to get current logged in user from local storage
function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

 export default class MatchesList extends Component {

  state = {
    songMatches: [],
    instruments: [],
    instrumentId: parseInt(localStorage.getItem("instrumentId")) !== null ? parseInt(localStorage.getItem("instrumentId")) : "",
    loadingStatus: true
  }

  handleFieldChange = evt => {
    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
  }

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
        orderedArray.sort((a, b) => (a.total < b.total) ? 1 : ((b.total < a.total) ? -1 : 0))
        this.setState({
          songMatches: orderedArray
        })
      })
  }

  render() {

    // console.log(this.state)

    // console.log(this.state.matches, "matches arrary ins state in render function")

    return (
      <>
        <section className="section-content">
          Please select instrument filter<br />
          <select
            id="instrumentId"
            name="instrumentId"
            disabled={this.state.loadingStatus}
            value={this.state.instrumentId}
            onChange={this.handleDropdownChange}>
            {this.state.instruments.map(instrument =>
              <option key={instrument.id} value={instrument.id}>{instrument.instrumentName}
              </option>
            )}
          </select><br />
          <button type="button" className="btn" onClick={() => this.findMatches(this.state.instrumentId)}>Filter Matches</button>
          <div className="container-cards">
            {this.state.songMatches.map(matchObj =>
              <MatchesCard
                key={matchObj.id}
                matchObj={matchObj}
                songMatchTotal={matchObj.total}
                matchName={matchObj.name}
                songMatchIds={matchObj.matchIds}
                setlist={matchObj.setlists}
                {...this.props}
              />)}
          </div>
        </section>
      </>
    )
  }
}