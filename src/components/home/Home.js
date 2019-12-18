import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom"
// import LoginModal from '../auth/Login';

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

  render() {

    const { classes } = this.props;

    return (
      <>
        <picture className={classes.logo}>
          <img src={require('../images/JamBuddyLogo.png')} alt="Jam Buddy Logo" />
        </picture>
        <div className={classes.bothButtons}>
          <Button type="button" variant="contained" color="primary" className={classes.singleButton} onClick={() => { this.props.history.push("/registration") }}>Registration</Button><br />


          <Button type="button" variant="contained" color="secondary" className={classes.singleButton} onClick={() => { this.props.history.push("/login") }}>Login</Button>
        </div>
      </>
    )
  }
}

export default withRouter(withStyles(styles)(Home))