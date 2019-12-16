import React, { Component } from "react"
import { withRouter } from "react-router-dom"
// import { Link } from "react-router-dom"
import { BottomNavigation } from '@material-ui/core'
import { BottomNavigationAction } from '@material-ui/core/'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import SearchIcon from '@material-ui/icons/Search';
import PeopleIcon from '@material-ui/icons/People';

// import { withStyles } from '@material-ui/core/styles';

//TODO Get name displaying on first render

export class NavBar extends Component {

  render() {

    return (
      <>
        <BottomNavigation
          className="position-fixed"
          showLabels
          position="fixed"

        >
          {/* <ul className="nav"> */}
          <BottomNavigationAction
            onClick={this.props.clearUser}
            label="Logout"
            icon={<AccountCircleIcon />}
          />
          <BottomNavigationAction
            label="Setlist"
            onClick={() => this.props.history.push("/setlist")}
            icon={<MusicNoteIcon />}
          />

          <BottomNavigationAction
            label="Matches"
            onClick={() => this.props.history.push("/matches")}
            icon={<SearchIcon />}
          />

          <BottomNavigationAction
            label="Buddies"
            onClick={() => this.props.history.push("/buddies")}
            icon={<PeopleIcon />}
          />
          {/* <li className="nav-item">
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
            </li> */}
          {/* </ul> */}
        </BottomNavigation>
      </>
    )
  }
}

export default withRouter(NavBar)