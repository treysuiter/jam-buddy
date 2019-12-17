import React, { Component } from 'react';
import { Button } from '@material-ui/core';



export default class SetlistCard extends Component {

  render() {
    return (
      <div className="card">
        <h3>{this.props.songTitle}</h3>
        <h4>by: {this.props.artistName}</h4>
        <Button type="button" variant="contained" color="secondary" href="#contained-buttons"className="btn" onClick={() => this.props.deleteSong(this.props.songInSet.id)}>Delete
        </Button>
      </div>
    )
  }
}