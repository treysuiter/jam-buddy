import React, { Component } from "react"
import { Link } from "react-router-dom"
import ApiManager from '../../modules/ApiManager'

// defines function to get current logged in user from local storage
function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class NavBar extends Component {

  state = {
    userNameInNavBar: ""
  }

  componentDidMount() {
    ApiManager.get("users", loggedInUserId())
    .then(response => {
      this.setState({
        userNameInNavBar: response.name
      })
    })
  }

  render() {
    console.log(this.props)
    return (
      <>
        {this.props.user ?
          <nav className="nav-bar">
            <ul className="nav">
              <li className="nav-item">
                Hello, {this.state.userNameInNavBar}
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={this.props.clearUser}>Logout</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/setlist">Setlist</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/matches">Matches</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/buddies">Buddies</Link>
              </li>
            </ul>
          </nav>
          : null}
      </>
    )
  }
}