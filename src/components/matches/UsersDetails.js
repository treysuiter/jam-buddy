import React, { Component } from 'react';
import ApiManager from '../../modules/ApiManager';
import SongCard from './SongCard';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

const styles = {
  userCard: {
    display: 'flex',
    flexDirection: 'column',
    width: 375,
    height: 'auto',
    border: '1px solid black',
    marginLeft: '10px',
    marginTop: '10px',
    borderRadius: '5px',
    justifyContent: 'space-between',
    boxShadow: '9px 6px 3px -5px rgba(0,0,0,0.57)',
    alignSelf: 'center',
    bottomMargin: 56
  },
  title: {
    fontSize: 18,
  },
  artist: {
    // marginBottom: 6,
  },
};

class UsersDetail extends Component {

  state = {
    name: "",
    email: "",
    detailsInstrument: "",
    detailsSetlist: [],
    loadingStatus: true,
    isThisMyBuddy: false
  }

  componentDidMount() {

    Promise.all([
      ApiManager.get("users", this.props.matchId),
      ApiManager.get("users", this.props.matchId, "_embed=setlists&_expand=instrument"),
      ApiManager.getAll("setlists", `userId=${this.props.matchId}&_expand=song`),
      ApiManager.getAll("buddies", `userId=${this.props.matchId}&loggedInUser=${loggedInUserId()}`)])
      .then(([email, detailsUser, currentSetlist, response]) => {
        this.setState({
          name: detailsUser.name,
          email: email.email,
          detailsInstrument: detailsUser.instrument.instrumentName,
          loadingStatus: false,
          detailsSetlist: currentSetlist,
          isThisSongInMySetlist: false,
          isThisMyBuddy: response.length > 0 ? true : false
        })
      })
  }

  handleSave = () => {
    const newBuddy = {
      loggedInUser: loggedInUserId(),
      userId: this.props.matchId
    }
    ApiManager.post("buddies", newBuddy)
      // .then(() => this.setState({
      //   isThisMyBuddy: true
      // }))
      .then(() => this.props.history.push("/matches"))
  }

  //TODO refactor this like in buddies details

  handleDelete = () => {
    ApiManager.getAll("buddies", `userId=${this.props.matchId}&loggedInUser=${loggedInUserId()}`)
      .then(response => {
        ApiManager.delete("buddies", `${response[0].id}`)
      })
      .then(() => this.props.history.push("/matches"))
  }

  render() {

    const { classes } = this.props;

    return (
      <Card className={classes.userCard}>
        <CardContent>
          <picture>
            <img src={`https://robohash.org/${this.state.name}`} alt="Current User" />
          </picture>

          <Typography className={classes.title} color="textPrimary" gutterBottom>
            {this.state.name}
          </Typography>

          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {this.state.email}
          </Typography>

          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {this.state.detailsInstrument}
          </Typography>
          <hr />

          <Typography className={classes.title} color="textPrimary" gutterBottom>
            Setlist
          </Typography>

          {this.state.detailsSetlist.map(setlistSong =>
            <SongCard
              key={setlistSong.id}
              setlistSong={setlistSong}
              songName={setlistSong.song.songTitle}
              {...this.props}
            />
          )}
        </CardContent>
        <CardActions>

          <Button size="medium" disabled={this.state.loadingStatus} lassName="" color="primary" onClick={() => this.props.history.goBack()}>Back
          </Button>


            //TODO you are here
          {this.state.isThisMyBuddy ? null : <button type="button" disabled={this.state.loadingStatus} onClick={this.handleSave}>Add Buddy</button>}

          {this.state.isThisMyBuddy ? <button type="button" disabled={this.state.loadingStatus} onClick={this.handleDelete}>Remove Buddy</button> : null}
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(UsersDetail)