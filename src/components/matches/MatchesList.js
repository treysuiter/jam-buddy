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
  }

  findMatches() {

    const matches = []
    let mySetlistArray = []
    let otherUsersSetlistArray = []


    //Get all users setlists
    ApiManager.getAll("users", "_embed=setlists")
      .then(response => {
        response.map(usersWithSetlist => {

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
          name: "",
          total: 0
        }

        otherUsersSetlistArray.map(setlistByUser => {

          matchObj = {
            name: setlistByUser.name,
            total: 0
          }

          matches.push(matchObj)
          index++

          // console.log(matches, "FIND THEEEEEEEEESEEEEEEE AMTCHESHEHSHESHES")

          // console.log(index, "yo index")

          // console.log(setlistByUser, "setlistByUser")
      
          setlistByUser.setlists.map(individualSetlist => {

            

            console.log(individualSetlist, "individualSetlist")

            // console.log(individualSetlist.songId, "individualSetlist.songId")

            mySetlistArray[0].setlists.map(mySong => {

              // console.log(mySong, "mySong")

              // console.log(mySong.songId, "my song ids")

              if (individualSetlist.songId === mySong.songId) {

                console.log("match found!")
                
                console.log(matches, "WHAT S THIS INDEX AHAHAHAHHAA")

                console.log("whT IA THI INDEX", index-1)
                // matches[index-1].total = 
                // matches[index-1].totals: ++
              }

            })

          })

          // console.log("your setlists", setlist.setlists)
          // console.log("matches", mySetlistArray[0].setlists.filter(value => setlist.setlists.includes(value)))

        })
      })
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
          <button type="button" className="btn" onClick={this.findMatches}>Find Matches</button>
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