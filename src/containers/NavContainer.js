import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Link} from 'react-router-dom';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  appbarDeptHeader: {
    alignCenter:'center',
    marginLeft:'200px',
    marginRight:'200px',
  },

  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null,
  };

  handleChange = event => {
    // console.log(localStorage.getItem('token'));
    localStorage.removeItem('token');
    this.props.logoutHandler();
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  getDeptName =(deptId)=>{
    if(deptId===1){
      return 'Grocery Department'
    }else if(deptId===2){
      return 'Espresso Department'
    }else if (deptId===3){
      return 'Cheese'
    }
  }

  render() {
    console.log('nav render',this.props.currentUser);
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Link className="nav-mods" to='/home'>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                Home
              </Typography>
            </Link>

            <Link className="nav-mods" to='/schedule'>
                <Typography variant="h6" color="inherit" className={classes.grow}>
                  Schedule
                </Typography>
            </Link>

                <Typography variant="h3" color="inherit" className={classes.appbarDeptHeader}>
                {this.getDeptName(this.props.currentUser.user.dept_manager_id)}
                    
                </Typography>

            {auth && (
              <div>
              {this.props.currentUser.user.username}
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                  <MenuItem onClick={this.handleClose}>My account</MenuItem>
                </Menu>
              </div>
            )}
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch checked={auth} onChange={this.handleChange} aria-label="LoginSwitch" />
                      }
                      label={auth ? 'Logout' : 'Login'}
                      />
                  </FormGroup>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuAppBar);