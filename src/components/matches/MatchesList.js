import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager'
import MatchesCard from '../matches/MatchesCard'

// defines function to get current logged in user from local storage
function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class MatchesList extends Component {

  state = {
    songMatches: [],
    instruments: [],
    loadingStatus: true
  }

  handleFieldChange = evt => {
    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
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
  }

  findMatches() {

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
        console.log(matchesArray, "set state matches array")
        this.setState({
          songMatches: matchesArray
        })
      })
    console.log("findMatches ran")
    //TODO sort the array by total and discard objects with 0 matches
    // return matchesArray
  }

  render() {

    // console.log(this.state.matches, "matches arrary ins state in render function")

    return (
      <>
        <section className="section-content">
          Filter by instrument<br />
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
          </select>
          <button type="button" className="btn" onClick={() =>this.findMatches()}>Find Matches</button>
          <div className="container-cards">
            {this.state.songMatches.map(match =>
              <MatchesCard
                key={match.id}
                songMatchTotal={match.total}
                matchName={match.name}
                seeDetails={this.addMatchToBuddiesList}
                {...this.props}
              />)}
          </div>
        </section>
      </>
    )
  }
}