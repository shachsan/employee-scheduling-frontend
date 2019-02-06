import React, { Component } from 'react';
import RightSideContainer from './RightSideContainer';
import LeftSideContainer from './LeftSideContainer';
import CenterContainer from './CenterContainer';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {fetchGetDeptAssociates,fetchGetSchedulesOnly} from '../../thunk/dept_asso_schedules';
import {fetchGetEvents} from '../../thunk/event';

class HomePageMainContainer extends Component {
    state={
        clickedMenuItem:'',
      }
    
    clickHandlerForTeam=(itemSelected)=>{
      this.setState({clickedMenuItem:itemSelected},()=>{
      })
    }

    componentDidMount(){
        let token = localStorage.getItem("token")
        if (this.props.currentUser) {
            this.props.fetchGetDeptAssociates(this.props.currentUser.user.dept_manager_id,token);
        }
        this.props.fetchGetEvents(token)
        this.props.fetchGetSchedulesOnly(token)
    }

    render() {
        return (
            <React.Fragment>
                {this.props.currentUser.user ?
                    <div className="hp-main-container">
                        <LeftSideContainer menuClicked={this.clickHandlerForTeam}
                            />
                        <CenterContainer 
                            menuSelected={this.state.clickedMenuItem}
                            events={this.props.events}
                            menuClicked={this.clickHandlerForTeam}
                            deptAssociates={this.props.deptAssociates}/>
                        <RightSideContainer menuSelected={this.state.clickedMenuItem}
                            deptId={this.props.currentUser.user.dept_manager_id}
                            schedules={this.props.schedules}
                            deptAssociates={this.props.deptAssociates}/>

                        
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
        fetchGetEvents:(token)=>dispatch(fetchGetEvents(token)),
        fetchGetSchedulesOnly:(token)=>dispatch(fetchGetSchedulesOnly(token)),
    }
}

const mapStateToProps=(state)=>{
    return {
        currentUser: state.currentLogInUser,
        deptAssociates:state.deptAssociates,
        events:state.events,
        schedules:state.schedules
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePageMainContainer);
