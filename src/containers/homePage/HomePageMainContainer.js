import React, { Component } from 'react';
import RightSideContainer from './RightSideContainer';
import LeftSideContainer from './LeftSideContainer';
import CenterContainer from './CenterContainer';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchGetDeptAssociates} from '../../thunk/dept_asso_schedules';
import {fetchGetEvents} from '../../thunk/event';

class HomePageMainContainer extends Component {
    state={
        clickedMenuItem:'',
      }
    
    clickHandlerForTeam=()=>{
      this.setState({clickedMenuItem:'team'},()=>{
        // console.log(this.state.clickedMenuItem);
      })
    }

    componentDidMount(){
        let token = localStorage.getItem("token")
        this.props.fetchGetDeptAssociates(this.props.currentUser.user.dept_manager_id,token);
        this.props.fetchGetEvents(token)
    }

    render() {
        // const dept=this.props.dept_asso_schedule.filter(dept=>dept.id===this.props.currentUser.dept_manager_id)
        console.log('home container render user', this.props.deptAssociates);                  
        return (
            <React.Fragment>
                {this.props.currentUser.user ?
                    <div className="hp-main-container">
                        <LeftSideContainer menuClicked={this.clickHandlerForTeam}
                            />
                        <CenterContainer 
                            menuSelected={this.state.clickedMenuItem}
                            events={this.props.events}
                            deptAssociates={this.props.deptAssociates}/>
                        <RightSideContainer menuSelected={this.state.clickedMenuItem}
                            deptId={this.props.currentUser.user.dept_manager_id}/>
                    </div>
                    :<Redirect to='/'/> 
                }
            </React.Fragment>
        );
    }
};

const mapDispatchToProps=(dispatch)=>{
    return {
        fetchGetDeptAssociates:(deptId,token)=>dispatch(fetchGetDeptAssociates(deptId,token)),
        fetchGetEvents:(token)=>dispatch(fetchGetEvents(token))
    }
}

const mapStateToProps=(state)=>{
    return {
        currentUser: state.currentLogInUser,
        deptAssociates:state.deptAssociates,
        events:state.events,
        // leftSideMenuItemSelected:state.leftSideMenuItemSelected,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePageMainContainer);