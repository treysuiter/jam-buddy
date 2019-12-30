import React, { Component } from 'react'
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ApiManager from '../../modules/ApiManager';

function loggedInUserId() { return parseInt(localStorage.getItem("userId")) }

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

  state = {
    isThisMyBuddy: false
  }

  componentDidMount() {
    ApiManager.getAll("buddies", `userId=${this.props.matchObj.id}&loggedInUser=${loggedInUserId()}`)
    .then(response => {
      this.setState({
        isThisMyBuddy: response.length > 0 ? true : false
      })
    })
  }

  render() {

    const { classes } = this.props;

    return (
      <Card className={classes.matchesCard}>
        <CardContent>
          <Typography className={classes.title} color="textPrimary" gutterBottom>
            {this.state.isThisMyBuddy ? <>{this.props.matchName} <i>(buddy)</i></> : this.props.matchName}
          </Typography>
          <Typography label="Match Total:" className={classes.artist} color="textSecondary">
            {`Match Total: ${this.props.songMatchTotal}`}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="medium" className="detailsButton" color="primary" onClick={() => this.props.history.push(`/userDetails/${this.props.matchObj.id}`)}>Details
        </Button>
        </CardActions>
      </Card>
    )
  }
}

export default withStyles(styles)(MatchesCard)
