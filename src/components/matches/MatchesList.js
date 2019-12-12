import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager'
import MatchesCard from '../matches/MatchesCard'

// defines function to get current logged in user from local storage
function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class MatchesList extends Component {

  state = {
    matches: [],
    instruments: [],
    loadingStatus: true
  }

  handleFieldChange = evt => {
    const stateToChange = {}
    stateToChange[evt.target.id] = evt.target.value
    this.setState(stateToChange)
  }

  componentDidMount() {

    //Get all instruments, create and array, and set array to value of state

    ApiManager.getAll("instruments")
      .then(instrumentArray => {
        this.setState({
          instruments: instrumentArray,
          loadingStatus: false
        })
      })

      this.setState({
        matches: this.findMatches()
      })
  }

  findMatches() {

    const matchesArray = []
    let mySetlistArray = []
    let otherUsersSetlistArray = []

    //Get all users setlists
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

        let index = 0
        let matchObj = {
          id: "",
          name: "",
          instrumentId: "",
          total: 0
        }

        otherUsersSetlistArray.forEach(setlistByUser => {

          matchObj = {
            id: setlistByUser.id,
            name: setlistByUser.name,
            instrumentId: setlistByUser.instrumentId,
            total: 0
          }

          matchesArray.push(matchObj)
          index++
      
          setlistByUser.setlists.forEach(individualSetlist => {

            mySetlistArray[0].setlists.forEach(mySong => {

              if (individualSetlist.songId === mySong.songId) {

                matchesArray[index-1].total++

              }
            })
          })
        })
      })
      return matchesArray
  }



  render() {

    return (
      <>
        <section className="section-content">
          <select
            id="instrumentId"
            name="instrumentId"
            value={this.state.instrumentId}
            onChange={this.handleDropdownChange}>
            {this.state.instruments.map(instrument =>
              <option key={instrument.id} value={instrument.id}>{instrument.instrumentName}
              </option>
            )}
          </select>
          {/* <button type="button" className="btn" onClick={this.findMatches}>Find Matches</button> */}
          <div className="container-cards">
            {this.state.matches.map(match =>
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