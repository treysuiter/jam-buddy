import React, { Component } from 'react';
import ApiManager from '../../modules/ApiManager';
import Typography from '@material-ui/core/Typography';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

export default class SongCard extends Component {

  state = {
    isSongInMySet: false
  }

  componentDidMount() {

    ApiManager.getAll("setlists", `userId=${loggedInUserId()}&songId=${this.props.setlistSong.songId}`)
      .then(response => {
        if (response.length > 0) {
          this.setState({
            isSongInMySet: true
          })
        }
      })
  }

  render() {

    return (

      <Typography className="" color="textSecondary">
        {this.state.isSongInMySet ? <i>{this.props.songName}</i> : this.props.songName}
      </Typography>

    )
  }
}