import React, { Component } from 'react'
// import { Link } from "react-router-dom";
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
  buddiesCard: {
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
  deleteButton: {
    //  alignSelf: 'flex-end'
  }
};

class BuddiesCard extends Component {

  render() {

    const { classes } = this.props;

    return (
      <>
        <Card className={classes.buddiesCard}>
          <CardContent>
            <Typography className={classes.title} color="textPrimary" gutterBottom>
              {this.props.buddyName}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="medium" className="deleteButton" color="secondary" onClick={() => this.props.history.push(`/buddiesDetails/${this.props.matchObj.userId}`)}>Details
        </Button>
          </CardActions>
        </Card>
      </>
    )
  }

}
export default withStyles(styles)(BuddiesCard)