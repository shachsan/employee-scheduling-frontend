import React, { Component } from 'react';
import { getCurrentUser } from './thunk/auth';
import './App.css';
import Calendar from './components/Calendar';
import ScheduleRightSideContainer from './containers/ScheduleRightSideContainer';
import NavContainer from './containers/NavContainer';
import {Route, Switch, withRouter} from 'react-router-dom';
import {fetchGetEvents} from './thunk/event';
import {logUserOut} from './action/actionCreater';
import {connect} from 'react-redux';
import dateFns from 'date-fns';
import HomePageMainContainer from './containers/homePage/HomePageMainContainer';
import Authenticate from './containers/authenticate/Authenticate';

class App extends Component {
  state={
    currentDate:new Date(),
    
    switchEditShifts:false,
  }

  switchEditHandler=(action)=>{
    this.setState({switchEditShifts:action})
  }

  logoutHandler=()=>{
    this.props.logUserOut();
    this.props.history.push("/")
  }

  ifDateIsGreater=(passedDate)=>{
    return passedDate >= new Date() ? true:false
  }

  selectDateChangeHandler=(e)=>{
    const dateSelected=dateFns.parse(e.target.value)
    this.setState({
      currentDate:dateSelected,
      switchEditShifts:this.ifDateIsGreater(dateSelected)
    })
  }

  onClickNextWeekHandler=()=>{
    this.setState({
      currentDate: dateFns.addWeeks(dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1}), 1),
      
    },()=>{
      this.setState({switchEditShifts:this.ifDateIsGreater(this.state.currentDate)})
    });
  }
  
  onClickPrevWeekHandler=()=>{
    this.setState({
      currentDate: dateFns.subWeeks(dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1}), 1),
    },()=>{
      this.setState({switchEditShifts:this.ifDateIsGreater(this.state.currentDate)})
    });
  }
  
  componentDidMount(){
    let token=localStorage.getItem('token')
    if (token) {
      this.props.getCurrentUser(token);
      this.props.fetchGetEvents(token)
    }
  }

  render() {
    return (
          <div className="App">
              <Switch>
                <Route exact path='/' render={()=>(
                   <React.Fragment>
                     <NavContainer currentUser={this.props.currentUser}
                        logoutHandler={this.logoutHandler}/>
                        <Authenticate />

                   </React.Fragment>
                   )}/>
              </Switch>
                
              <Switch>
                <Route exact path='/home' render={()=>(
                  <React.Fragment>
                    <NavContainer currentUser={this.props.currentUser}
                        logoutHandler={this.logoutHandler}/>
                      <HomePageMainContainer />
                      </React.Fragment>
                )}/>
              </Switch>
                
              <Switch>
                <Route exact path='/schedule' render={()=>(
                  <React.Fragment>
                    <NavContainer currentUser={this.props.currentUser}
                        logoutHandler={this.logoutHandler}/>
                    <Calendar currentDate={this.state.currentDate}
                            onClickNextWeekHandler={this.onClickNextWeekHandler}
                            onClickPrevWeekHandler={this.onClickPrevWeekHandler}
                            selectDateChangeHandler={this.selectDateChangeHandler}
                            switchEditHandler={this.switchEditHandler}
                            switchEditShifts={this.state.switchEditShifts}/>
                    <ScheduleRightSideContainer currentDate={this.state.currentDate}/>
                  </React.Fragment>
                )}/>
              </Switch>
          </div>
    );
  }
}

const mapStateToProps = (state) => {
  return ( {
      events:state.events,
      currentUser:state.currentLogInUser
  } );
}

const mapDispatchToProps = (dispatch) => {
  return ( {
    getCurrentUser: (token) => dispatch(getCurrentUser(token)),
    fetchGetEvents:(token)=>dispatch(fetchGetEvents(token)),
    logUserOut:()=>dispatch(logUserOut()),

  } );
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
