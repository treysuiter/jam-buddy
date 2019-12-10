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
    instruments: []
  }

  componentDidMount() {

    ApiManager.getAll("setlists", `userId=${loggedInUserId()}&_expand=song`)
      .then(setlistArray => {
        this.setState({
          setlist: setlistArray
        })
      })
    ApiManager.getAll("instruments")
      .then(instrumentArray => {
        this.setState({
          instruments: instrumentArray
        })
        defaultOption = this.state.instruments[0].instrumentName
      })
  }


  render() {

    return (
      <>
        There should be a dropdown here.
      <Dropdown options={this.state.instruments.map(intName => intName.instrumentName)} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />
        <section className="section-content">
          <button type="button" className="btn">Add Song</button>
          <h1>Your Setlist</h1>
        </section>
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
      </>
    )
  }
}
