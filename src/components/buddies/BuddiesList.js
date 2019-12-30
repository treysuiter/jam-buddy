import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager';
import BuddiesCard from './BuddiesCard';
// import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

const styles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: '10px',
    width: 250
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  allCards: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    backgroundColor: 'lightblue',
  },
  dropdown: {
    marginLeft: '10px',
    width: 250,
    fontSize: 18
  },
  addSongButton: {
    marginLeft: '10px',
    width: 200,
  },
  pageText: {
    marginLeft: '15px',
  },
  sectionContent: {
    height: '100%',
    marginBottom: 56
  },
};

class BuddiesList extends Component {

  state = {
    buddies: [],
    noBuddyMessage: "",
    loadingStatus: true
  }

  componentDidMount() {

    ApiManager.getAll("buddies", `loggedInUser=${loggedInUserId()}&_expand=user`)
      .then(response => {
        this.setState({
          buddies: response,
          noBuddyMessage: response.length === 0 ? "You currently have no buddies" : ""
        })
      })

  }

  render() {

    const { classes, ...other } = this.props;

    return (
      <>
        <div className={classes.sectionContent}>
        <h3 className={classes.pageText}>Buddies</h3>
          <div className={classes.allCards}>
            {this.state.buddies.map(matchObj =>
              <BuddiesCard
                key={matchObj.id}
                matchObj={matchObj}
                buddyName={matchObj.user.name}
                {...other}
              />)}
          </div>
          <h3 className={classes.pageText}>{this.state.noBuddyMessage}</h3>
        </div>
      </>
    )
  }
}

export default withStyles(styles)(BuddiesList)