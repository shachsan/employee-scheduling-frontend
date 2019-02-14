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
  logout:{
    color:'white',
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
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar style={{ background: '#2E3B55' }} position="static">
          <Toolbar>
            {/* <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton> */}
            {this.props.currentUser.user ? 
            <React.Fragment>
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
                {this.props.currentUser.user.username}

            {auth && (
              <div>
              {/* {this.props.currentUser.user ? this.props.currentUser.user.username: null} */}
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                  >
                  <AccountCircle />
                </IconButton>
                
              </div>
            )}
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch checked={auth} onChange={this.handleChange} aria-label="LoginSwitch" />
                      }
                      label={auth ? <Typography className={classes.logout}>Logout</Typography> : 'Login'}
                      />
                  </FormGroup>
                      </React.Fragment>
                      :null}
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