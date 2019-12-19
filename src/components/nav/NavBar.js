import React, { Component } from "react"
import { withRouter } from "react-router-dom"
// import { Link } from "react-router-dom"
import { BottomNavigation } from '@material-ui/core'
import { BottomNavigationAction } from '@material-ui/core/'
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import SearchIcon from '@material-ui/icons/Search';
import PeopleIcon from '@material-ui/icons/People';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    width: '100%',
    position: 'fixed',
    overflow: 'hidden',
    bottom: 0,
    color: 'black'
  },
};

// import { withStyles } from '@material-ui/core/styles';

//TODO Get name displaying on first render

class NavBar extends Component {

  state = {
    value: parseInt(localStorage.getItem("navId")) !== null ? parseInt(localStorage.getItem("navId")) : 0
  }

  handleChange = (event, value) => {
    this.setState({ value })
    localStorage.setItem("navId", value)
  };

  componentDidMount() {
    this.setState({
      value: parseInt(localStorage.getItem("navId")) !== null ? parseInt(localStorage.getItem("navId")) : 0
    })
  }

  render() {

    const { classes } = this.props;
    const { value } = this.state;
    

    return (
      <>
        <BottomNavigation
          value={value}
          className={classes.root}
          onChange={this.handleChange}
          showLabels>


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

          <BottomNavigationAction
            onClick={this.props.clearUser}
            label={`Logout ${this.props.userName}`}
            icon={<AccountCircleIcon />}
          />

        </BottomNavigation>
      </>
    )
  }
}

export default withRouter(withStyles(styles)(NavBar))
