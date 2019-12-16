import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager';
import BuddiesCard from './BuddiesCard';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class BuddiesList extends Component {

  state = {
    buddies: [],
    loadingStatus: true
  }

  componentDidMount () {

    console.log("cdm in buddies list ran")

    ApiManager.getAll("buddies", `loggedInUser=${loggedInUserId()}&_expand=user`)
    .then(response => {
      console.log(response, "api response")
      this.setState({
        buddies: response
      })
    })
   
  }

  myConsoleLogTest () {
    console.group(this.state)
  }

  render () {
    console.log("render in buddies list ran")
    return (
      <>
      <div className="container-cards">
            {this.state.buddies.map(matchObj =>
              <BuddiesCard
                key={matchObj.id}
                matchObj={matchObj}
                buddyName={matchObj.user.name}
                {...this.props}
              />)}
          </div>
      </>
    )
  }
}