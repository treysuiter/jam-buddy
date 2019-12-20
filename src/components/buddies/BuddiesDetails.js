import React, { Component } from 'react';
import ApiManager from '../../modules/ApiManager';
import SongCard from '../matches/SongCard';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

const styles = {
  buddyCard: {
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
    backgroundColor: 'lightblue'
  },
  title: {
    fontSize: 18,
  },
  artist: {
    // marginBottom: 6,
  },
  sectionContent: {
    marginBottom: 60
  }
};

class BuddiesDetail extends Component {

  state = {
    name: "",
    email: "",
    instrument: "",
    detailsSetlist: [],
    buddyId: "",
    loadingStatus: true,
    isThisMyBuddy: false
  }

  componentDidMount() {

    Promise.all([
      ApiManager.get("users", this.props.matchId),
      ApiManager.get("users", this.props.matchId, "_embed=setlists&_expand=instrument"),
      ApiManager.getAll("setlists", `userId=${this.props.matchId}&_expand=song`),
      ApiManager.getAll("buddies", `userId=${this.props.matchId}&loggedInUser=${loggedInUserId()}`),
      ApiManager.getAll("buddies", `userId=${this.props.matchId}&loggedInUser=${loggedInUserId()}`)])
      .then(([email, user, currentSetlist, response, buddyResponse]) => {
        this.setState({
          name: user.name,
          email: email.email,
          detailsInstrument: user.instrument.instrumentName,
          setlist: user.setlist,
          buddyId: buddyResponse[0].id,
          loadingStatus: false,
          detailsSetlist: currentSetlist,
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
      .then(() => this.props.history.push("/buddies"))
  }

  handleDelete = () => {
  
    ApiManager.delete("buddies", `${this.state.buddyId}`)

      .then(() => this.props.history.push("/buddies"))
  }

  render() {

    const { classes } = this.props;

    return (
    <section className={classes.sectionContent}>
      <Card className={classes.buddyCard}>
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
        <CardActions className={classes.setlist}>

          <Button size="medium" disabled={this.state.loadingStatus} className="" color="primary" onClick={() => this.props.history.goBack()}>Back
          </Button>

          {this.state.isThisMyBuddy ? null :  <Button size="medium" disabled={this.state.loadingStatus} className="" color="primary" onClick={this.handleSave}>Add Buddy
          </Button>}

          {this.state.isThisMyBuddy ?<Button size="medium" disabled={this.state.loadingStatus} className="" color="secondary" onClick={this.handleDelete}>Delete Buddy
          </Button> : null}

        </CardActions>
      </Card>
      </section>
    );
  }
}


export default withStyles(styles)(BuddiesDetail)