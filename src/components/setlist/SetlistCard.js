import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'rows',
    width: '90%',
    height: 'auto',
    border: '1px solid black',
    margin: '5px',
    borderRadius: '5px',
    justifyContent: 'space-between',
    boxShadow: '5px 5px 15px 5px #000000'
  },
  title: {
    fontSize: 14,
  },
  artist: {
    // marginBottom: 6,
  },
  deleteButton: {
  //  alignSelf: 'flex-end'
  }
};

class SetlistCard extends Component {


  render() {

    const { classes } = this.props;
  
    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title} color="textPrimarys" gutterBottom>
            {this.props.songTitle}
          </Typography>
          <Typography className={classes.artist} color="textSecondary">
          {this.props.artistName}
          </Typography>
        </CardContent>
        <CardActions>
        <Button size="medium" className="deleteButton" color="secondary" onClick={() => this.props.deleteSong(this.props.songInSet.id)}>Delete
        </Button>
        </CardActions>
        
      </Card>
    )
  }
}

export default withStyles(styles)(SetlistCard)