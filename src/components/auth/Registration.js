import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager';

export default class Registration extends Component {

  state = {
    email: "",
    passwordA: "",
    passwordB: "",
    name: "",
    zipcode: "",
  }

  emailIsExisting = () => {
    return ApiManager.getAll("users", `email_like=${this.state.email}`)
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
              instrumentId: 0
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
                    localStorage.setItem("userId", parseInt(userId))
                  })
              })
              .then(() => {
                this.props.history.push("/setlist")
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

    const { email, passwordA, passwordB } = this.state;
    const isEnabled = email.length > 0 && passwordA.length > 0 && passwordB.length > 0 && passwordA === passwordB;

    return (
      <div>
        <div className="">
          <h4>Please enter your information</h4>
          <div className="card">
            <div className="card-content">
              <form onSubmit={this.handleLogin}>

                <input type="text" placeholder="Email" id="email" onChange={this.handleFieldChange} required></input> <br />

                <input type="password" placeholder="Password" id="passwordA" onChange={this.handleFieldChange} required></input><br />

                <input type="password" placeholder="Confirm Password" id="passwordB" onChange={this.handleFieldChange} required></input><br />

                <input type="text" placeholder="Name" id="name" onChange={this.handleFieldChange} required></input> <br />

                <input type="text" placeholder="Zipcode" id="zipcode" onChange={this.handleFieldChange} required></input> <br />

                <button type="submit" value="Submit" className="btn btn-primary" disabled={!isEnabled}>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div >
    )
  }
}