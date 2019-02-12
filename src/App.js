import React, { Component } from 'react';
import { getCurrentUser } from './thunk/auth';
import './App.css';
import Calendar from './components/Calendar';
import ScheduleRightSideContainer from './containers/ScheduleRightSideContainer';
import NavContainer from './containers/NavContainer';
import {BrowserRouter as Router, Route, Switch, withRouter} from 'react-router-dom';
import {fetchGetEvents} from './thunk/event';
import {logUserOut} from './action/actionCreater';
import {connect} from 'react-redux';
import dateFns from 'date-fns';
import HomePageMainContainer from './containers/homePage/HomePageMainContainer';
import Authenticate from './containers/authenticate/Authenticate';
import LeftSideContainer from './containers/homePage/LeftSideContainer';
import CenterContainer from './containers/homePage/CenterContainer';
import RightSideContainer from './containers/homePage/RightSideContainer';

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
    console.log('current date', this.state.currentDate);
    return passedDate >= new Date() ? true:false
    // return dateFns.format(this.state.currentDate, 'DDD')- dateFns.format(new Date(),'DDD') >= 0 ? true:false
    // return dateFns.subDays(this.state.currentDate, dateFns.format(new Date(),'DDD')) > 0 ? true:false
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
    // console.log('currentDate in App render',this.state.currentDate);
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

              {/* <Switch>
                <Route exact path='/home/show/:associate' render={()=>(
                  <React.Fragment>
                    <NavContainer currentUser={this.props.currentUser}
                        logoutHandler={this.logoutHandler}/>
                      <LeftSideContainer menuClicked={this.props.clickHandlerForTeam}/>
                      <CenterContainer/>
                      <RightSideContainer/>
                      </React.Fragment>
                )}/>
              </Switch> */}
                
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
