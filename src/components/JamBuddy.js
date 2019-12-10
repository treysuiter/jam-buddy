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
    this.setState({ user: this.isAuthenticated() })
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
      <React.Fragment>
        <NavBar user={user} clearUser={this.clearUser} />
        <ApplicationViews user={user} setUser={this.setUser} />
      </React.Fragment>
    );
  }
}

export default JamBuddy;
