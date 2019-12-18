import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager';
import { FormControl } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import { withRouter } from "react-router-dom"

const styles = {
  sectionContent: {
    marginLeft: '10px',
    display: 'flex',
    width: 300,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    // width: '100%',
    // height: '100%',
    position: 'fixed'
  },
  textField: {
    width: 300
  }
}

class Registration extends Component {

  state = {
    email: "",
    passwordA: "",
    passwordB: "",
    name: "",
    zipcode: "",
  }

  emailIsExisting = () => {
    return ApiManager.getAll("users", `email=${this.state.email}`)
      .then(response => {
        if (response.length > 0) {
          return true
        } else {
          return false
        }
      })
  }

  handleFieldChange = e => {
    const stateToChange = {}
    stateToChange[e.target.id] = e.target.value
    this.setState(stateToChange)
  };

  handleLogin = e => {
    e.preventDefault()
    // console.log(this.emailIsExisting())
    this.emailIsExisting()
      .then(bool => {
        if (!bool) {
          const { passwordA, passwordB } = this.state
          if (passwordA === passwordB && passwordA !== "") {
            const newUser = {
              email: this.state.email,
              password: this.state.passwordA,
              name: this.state.name,
              zipcode: this.state.zipcode,
              instrumentId: 1,
              image: ""
            }
            this.props.setUser({
              email: this.state.email,
              password: this.state.passwordA,
            })
            ApiManager.post("users", newUser)
              .then(() => {
                ApiManager.getLoggedInuser(this.state.email)
                  .then((user) => {
                    // console.log('user registration', user)
                    const userId = user[0].id
                    const userName = user[0].name
                    localStorage.setItem("userId", parseInt(userId))
                    localStorage.setItem("userName", userName)
                    this.props.history.push("/setlist")
                  })
              })
          }
          else {
            window.alert("Please make sure your passwords match")
          }
        } else {
          window.alert("Email already exists")
        }
      })
  }


  render() {

    const { classes } = this.props;
    const { email, passwordA, passwordB } = this.state;
    const isEnabled = email.length > 0 && passwordA.length > 0 && passwordB.length > 0 && passwordA === passwordB;

    return (
      <div>
        <div className={classes.sectionContent}>
          <h3>Please enter your information</h3>
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
                id="passwordA"
                margin="normal"
                variant="outlined"
                className={classes.textField}
                onChange={this.handleFieldChange}
                required />
            </FormControl>

            <FormControl>
              <TextField
                type="password"
                label="confirm password"
                id="passwordB"
                margin="normal"
                variant="outlined"
                className={classes.textField}
                onChange={this.handleFieldChange}
                required />
            </FormControl>

            <FormControl>
              <TextField
                type="text"
                label="name"
                id="name"
                margin="normal"
                variant="outlined"
                className={classes.textField}
                onChange={this.handleFieldChange}
                required />
            </FormControl>

            <FormControl>
              <TextField
                type="text"
                label="zipcode"
                id="zipcode"
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
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Registration))