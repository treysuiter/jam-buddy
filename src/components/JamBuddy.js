import React, { Component } from "react";
import NavBar from "./nav/NavBar";
import ApplicationViews from "./ApplicationViews"
import { withRouter } from "react-router-dom"
// import SimpleMenu from "./nav/TopNav";
// import TopNav from "./nav/TopNav";




class JamBuddy extends Component {
  state = {
    user: false,
    userId: '',
    userName: ""
  }

  //check for logged in user in local storage
  isAuthenticated = () => localStorage.getItem("credentials") !== null

  //add entered or unentered user info into localStorage and calls isAuthenticated
  setUser = (authObj) => {

    localStorage.setItem(
      "credentials",
      JSON.stringify(authObj)
    )
    this.setState({
      user: this.isAuthenticated(),
      userId: authObj.id,
    })
  }

  //handle logout functionality
  clearUser = () => {
    localStorage.removeItem("credentials")
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    localStorage.removeItem("instrumentId")
    localStorage.removeItem("navId")
    this.setState({ user: this.isAuthenticated(), userName: "" })
    this.props.history.push("/")

  }

  //check for logged in user on rerender
  componentDidMount() {
    this.setState({
      user: this.isAuthenticated()
    })
  }

  render() {

    //TODO clean up this user name code

    const { user } = this.state

    return (
      <>
        {/* {user ? <TopNav user={user} userName={localStorage.getItem("userName")} clearUser={this.clearUser}/> : null } */}
        <ApplicationViews user={user} setUser={this.setUser} />

        {user ? <NavBar user={user} userName={localStorage.getItem("userName")} clearUser={this.clearUser} /> : null}

      </>
    );
  }
}

export default withRouter(JamBuddy);
