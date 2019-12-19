import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
  matchesCard: {
    display: 'flex',
    flexDirection: 'rows',
    width: 375,
    height: 'auto',
    border: '1px solid black',
    margin: '10px',
    borderRadius: '5px',
    justifyContent: 'space-between',
    boxShadow: '9px 6px 3px -5px rgba(0,0,0,0.57)',
    alignSelf: 'center'
  },
  title: {
    fontSize: 18,
  },
  artist: {
    // marginBottom: 6,
  },
  detailsButton: {
    //  alignSelf: 'flex-end'
  }
};


class MatchesCard extends Component {

  render() {

    const { classes } = this.props;

    return (
      <Card className={classes.matchesCard}>
        <CardContent>
          <h3>{this.props.matchName}</h3>
        </CardContent>
        <CardContent>
          <h4>Setlist Matches: {this.props.songMatchTotal}</h4>
        </CardContent>
        <CardActions>

          {/* <Link to={`/userDetails/${this.props.matchObj.id}`}><button>Details</button></Link> */}

          <Button size="medium" className="detailsButton" color="primary" onClick={() => this.props.history.push(`/userDetails/${this.props.matchObj.id}`)}>Details
        </Button>

        </CardActions>

      </Card>
    )
  }
}

export default withStyles(styles)(MatchesCard)
