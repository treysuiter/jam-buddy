import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter } from "react-router-dom"
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    width: '100%',
    position: 'fixed',
    overflow: 'hidden',
    top: 0,
  },
};

class TopNav extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {

    const { classes } = this.props;

    const { anchorEl } = this.state;

    return (

      <div className={classes.root}>
        <Button
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          {<MenuIcon />}Hello, {this.props.userName}
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={() => this.props.history.push("/setlist")}>Setlist</MenuItem>
          <MenuItem onClick={() => this.props.history.push("/matches")}>Matches</MenuItem>
          <MenuItem onClick={() => this.props.history.push("/buddies")}>Buddies</MenuItem>
          <MenuItem onClick={this.props.clearUser}>Logout</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(TopNav))
