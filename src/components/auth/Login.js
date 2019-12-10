import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager';

export default class Login extends Component {

  state = {
		email: '',
		password: ''
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
			if (user.length > 0){
				this.props.setUser({
					email: email,
					password: password,
					userId: user[0].id
				});
				const userId = user[0].id
				localStorage.setItem("userId", parseInt(userId))
				this.props.history.push('/setlist');
			} else {
				window.alert("Email and/or password not valid. Please try again")
			}
		});
	};

  render () {
    return (
      <div className="">
						<h4>Please enter your information.</h4>
						<div className="card">
							<div className="card-content">
								<form onSubmit={this.handleLogin}>
									<input
										id="email"
										type="text"
										placeholder="Email"
										onChange={this.handleFieldChange}
										required
									/>{' '}
									<br />
									<input
										type="password"
										placeholder="Password"
										id="password"
										onChange={this.handleFieldChange}
										required
									/>
									<br />
									<button type="submit" value="Submit" className="btn btn-primary" >
										Submit
									</button>
								</form>
							</div>
						</div>
					</div>
    )
  }
}