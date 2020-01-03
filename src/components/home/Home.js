import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom"
import ApiManager from '../../modules/ApiManager';
import { Typography } from '@material-ui/core';

const styles = {
  singleButton: {
    width: 375,
    height: 50
  },
  bothButtons: {
    height: '25%',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  logo: {
    height: '60%',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  topSong: {
    textAlign: 'center'
  }
}

class Home extends Component {

  state = {
    topSong: "",
    topSongArtist: ""
  }

  componentDidMount() {

    const allSongs = []
    let index = 0

    //loops through all known songs and sets state to the most popular song title and artist name

    ApiManager.getAll("songs")
      .then(allSongsResponse => {
        allSongsResponse.forEach(song => {
          ApiManager.getAll("setlists", `songId=${song.id}`)
            .then(setlistResponse => {
              let songObj = {
                id: song.id,
                name: song.songTitle,
                artist: song.artistName,
                total: setlistResponse.length
              }
              allSongs.push(songObj)
              allSongs.sort((a, b) => (a.total < b.total) ? 1 : ((b.total < a.total) ? -1 : 0))
              index++
              if (index === allSongsResponse.length - 1) {
                this.setState({
                  topSong: allSongs[0].name,
                  topSongArtist: allSongs[0].artist
                })
              }
            })
        })
      })
  }

  render() {

    const { classes } = this.props;

    return (
      <>
        <picture className={classes.logo}>
          <img src={require('../images/JamBuddyLogo.png')} alt="Jam Buddy Logo" />
        </picture>
        <Typography className={classes.topSong} color="textPrimary" gutterBottom>
          <br />Current Top JamBuddy Jam: <br /> <b>{this.state.topSong}</b><br />{this.state.topSongArtist}
        </Typography>
        <div className={classes.bothButtons}>

          <Button type="button" variant="contained" color="primary" className={classes.singleButton} onClick={() => { this.props.history.push("/registration") }}>Registration</Button><br />
          <Button type="button" variant="contained" color="secondary" className={classes.singleButton} onClick={() => { this.props.history.push("/login") }}>Login</Button>
        </div>
      </>
    )
  }
}

export default withRouter(withStyles(styles)(Home))