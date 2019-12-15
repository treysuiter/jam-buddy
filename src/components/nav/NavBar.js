import React, { Component } from "react"
import { Link } from "react-router-dom"

//TODO Get name displaying on first render

export default class NavBar extends Component {

  render() {

    return (
      <>
          <nav className="nav-bar">
            <ul className="nav">
              <li className="nav-item">
                Hello, {this.props.userName}
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
      </>
    )
  }
}