import React, { Component } from "react";
import NavBar from "./nav/NavBar";
import ApplicationViews from "./ApplicationViews";
// import "./Nutshell.css";

class JamBuddy extends Component {
  state = {
    user: false,
    userId: '',
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
    this.setState({ user: this.isAuthenticated(), userName: "" })

    // this.props.history.push("/login")
  }

  //check for logged in user on rerender
  componentDidMount() {
    this.setState({
      user: this.isAuthenticated()
    })
  }

  render() {
    const { user } = this.state
    return (
      <>
        { user ?
        <NavBar user={user} clearUser={this.clearUser} />
      : null}
        <ApplicationViews user={user} setUser={this.setUser} />
      </>
    );
  }
}

export default JamBuddy;
