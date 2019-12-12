import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager'
import MatchesCard from '../matches/MatchesCard'

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
                instrument={match.instrument}
                seeDetails={this.addMatchToBuddiesList}
                {...this.props}
              />)}
          </div>
        </section>
      </>
    )
  }
}