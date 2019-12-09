import { Route, Redirect } from "react-router-dom";
import React, { Component } from "react";
import Home from "./home/Home"
import Login from "./auth/Login"
import Registration from "./auth/Registration"
import SetlistList from "./setlist/SetlistList";
import MatchesList from "./matches/MatchesList";
import MatchesDetails from "./matches/MatchesDetails"
import BuddiesList from "./buddies/BuddiesList"
import BuddiesDetails from "./buddies/BuddiesDetails"

export default class ApplicationViews extends Component {

  render() {

    return (
      <>
        <Route
          exact path="/" render={props => {
            return <Home {...props} />
          }}
        />

        <Route exact path="/login" render={props => {
          return <Login setUser={this.props.setUser} {...props} />
        }}
        />

        <Route exact path="/Registration" render={props => {
          return <Registration setUser={this.props.setUser} {...props} />
        }}
        />

        <Route exact path="/setlist" render={props => {
          return <SetlistList {...props} />
        }}
        />

        <Route exact path="/matches" render={props => {
          return <MatchesList {...props} />
        }}
        />
        <Route exact path="/matches/:userId(\d+)" render={props => {
          return <MatchesDetails userId={parseInt(props.match.params.userId)} {...props} />
        }}
        />

        <Route exact path="/buddies" render={props => {
          return <BuddiesList {...props} />
        }}
        />
        <Route exact path="/buddies/:userId(\d+)" render={props => {
          return <BuddiesDetails userId={parseInt(props.match.params.userId)} {...props} />
        }}
        />
      </>
    )
  }
}