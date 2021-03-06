

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {Group} from '@material-ui/icons';
import {Link} from 'react-router-dom';


const styles = theme => ({
  menuItem: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& $primary, & $icon': {
        color: theme.palette.common.white,
      },
    },
  },
  primary: {
      
  },
  icon: {},
});

class LeftSideContainer extends Component{
  
  
  render(){
    const { classes } = this.props;

  return (
    <div className="hp-left-container">
        <Paper>
            <MenuList>
                <MenuItem className={classes.menuItem}>
                    <ListItemIcon className={classes.icon}>
                        <Group/>
                    </ListItemIcon>
                    <ListItemText onClick={()=>this.props.menuClicked('team')}classes={{ primary: classes.primary }} primary="Team" />
                </MenuItem>
                <Link style={{textDecoration: 'none'}} to='/schedule'>
                    <MenuItem className={classes.menuItem}>
                    <ListItemIcon className={classes.icon}>
                    <i className="material-icons">
                        schedule
                    </i>
                    </ListItemIcon>
                    <ListItemText classes={{ primary: classes.primary }} inset primary="Schedule" />
                    </MenuItem>
                  </Link>
            </MenuList>
        </Paper>
    </div>
  );
}
}

LeftSideContainer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LeftSideContainer);