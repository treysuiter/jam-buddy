import React, { Component } from 'react'
import ApiManager from '../../modules/ApiManager';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
// import Modal from '@material-ui/core/Modal';
// import Button from '@material-ui/core/Button';

//! There's a bunch of stuff in here when I was messing around with modals

// function rand() {
//   return Math.round(Math.random() * 20) - 10;
// }

// function getModalStyle() {
//   const top = 50
//   const left = 50

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`,
//   };
// }

// const styles = theme => ({
//   paper: {
//     position: 'absolute',
//     width: theme.spacing.unit * 50,
//     backgroundColor: theme.palette.background.paper,
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing.unit * 4,
//     outline: 'none',
//   },
// });


export default class Login extends Component {

  state = {
		email: '',
    password: '',
    // open: false
  };

  // handleOpen = () => {
  //   this.setState({ open: true });
  // };

  // handleClose = () => {
  //   this.setState({ open: false });
  // };

  
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
        const userName = user[0].name
        localStorage.setItem("userId", parseInt(userId))
        localStorage.setItem("userName", userName)
				this.props.history.push('/setlist');
			} else {
				window.alert("Email and/or password not valid. Please try again")
			}
		});
	};

  render () {

    // const { classes } = this.props;

    return (
      // <div>
      //   <Typography gutterBottom>Click to get the full Modal experience!</Typography>
      //   <Button onClick={this.handleOpen}>Open Modal</Button>
      //   <Modal
      //     aria-labelledby="simple-modal-title"
      //     aria-describedby="simple-modal-description"
      //     open={this.state.open}
      //     onClose={this.handleClose}
      //   >
      //     <div style={getModalStyle()} className={classes.paper}>
      //       <Typography variant="h6" id="modal-title">
      //         Text in a modal
      //       </Typography>
      //       <Typography variant="subtitle1" id="simple-modal-description">
      //         Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
      //       </Typography>
      //       <LoginModal />
      //     </div>
      //   </Modal>
      // </div>
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