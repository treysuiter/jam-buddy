import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager';
import { FormControl } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import { withRouter } from "react-router-dom"
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
// import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button';

const styles = {
  sectionContent: {
    marginLeft: '10px',
    display: 'flex',
    width: 300,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    position: 'fixed'
  },
  textField: {
    width: 300
  }
}

//! There's a bunch of stuff in here when I was messing around with modals

class Login extends Component {

  state = {
    email: '',
    password: '',
  };

  handleFieldChange = (e) => {
    const stateToChange = {};
    stateToChange[e.target.id] = e.target.value;
    this.setState(stateToChange);
  };

  handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = this.state
    ApiManager.getAll("users", `email=${email}&password=${password}`)
      .then((user) => {
        // console.log('user login test', user)
        if (user.length > 0) {
          this.props.setUser({
            email: email,
            password: password,
            userId: user[0].id
          });
          const userId = user[0].id
          const userName = user[0].name
          localStorage.setItem("userId", parseInt(userId))
          localStorage.setItem("userName", userName)
          this.props.history.push('/setlist');
        } else {
          window.alert("Email and/or password not valid. Please try again")
        }
      });
  };

  render() {

    const { classes } = this.props;
    const { email, password } = this.state;

    const isEnabled = email.length > 0 && password.length > 0

    return (

      <div className={classes.sectionContent}>
        <h3>Please enter your information.</h3>

        <form onSubmit={this.handleLogin}>
        <FormControl>
              <TextField
                type="text"
                label="email"
                id="email"
                margin="normal"
                variant="outlined"
                className={classes.textField}
                onChange={this.handleFieldChange}
                required />
            </FormControl>
            <FormControl>
              <TextField
                type="password"
                label="password"
                id="password"
                margin="normal"
                variant="outlined"
                className={classes.textField}
                onChange={this.handleFieldChange}
                required />
            </FormControl>

            <Button
              variant="contained"
              type="submit"
              value="Submit"
              color="primary"
              size="large"
              className="btn"
              disabled={!isEnabled}>Submit</Button>

            <Button
              variant="contained"

              value="Cancel"
              color="secondary"
              size="large"
              className="btn"
              onClick={() => this.props.history.push('/')}
            >Cancel</Button>
        </form>
      </div>

    )
  }
}

export default withRouter(withStyles(styles)(Login))