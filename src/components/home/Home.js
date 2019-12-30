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
  }
}

class Home extends Component {

  state = {
    topSong: ""
  }

  componentDidMount() {

    ApiManager.getAll("songs")
      .then(allSongsResponse => {
        let allSongs = []
        let topSong = ""
        allSongsResponse.forEach(song => {

          ApiManager.getAll("setlists", `songId=${song.id}`)
            .then(setlistResponse => {
              let songObj = {
                id: song.id,
                name: song.songTitle,
                total: setlistResponse.length
              }
              allSongs.push(songObj)
              allSongs.sort((a, b) => (a.total < b.total) ? 1 : ((b.total < a.total) ? -1 : 0))
              topSong = allSongs[0].name
              this.setState({
                topSong: topSong
              })
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
        <Typography className={classes.title} color="textPrimary" gutterBottom>
          <br /><center>Current Most Known Song: <br /> <b>{this.state.topSong}</b></center>
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