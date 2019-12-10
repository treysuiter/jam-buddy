import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager'
import SetlistCard from './SetlistCard'

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class SetlistList extends Component {

  state = {
    setlist: []
  }

  componentDidMount() {

    ApiManager.getAll("setlists", `userId=${loggedInUserId()}&_expand=song`)
      .then(setlistArray => {
        this.setState({
          setlist: setlistArray
        })
      })
  }


render() {

  return (
    <>
      <section className="section-content">
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
