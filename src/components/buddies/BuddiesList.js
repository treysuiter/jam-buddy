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

    ApiManager.getAll("buddies", `loggedInUser=${loggedInUserId()}&_expand=user`)
    .then(response => {
      this.setState({
        buddies: response
      })
    })
   
  }

  render () {

    console.log(this.state.buddies)

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