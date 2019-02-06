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
// import {connect} from 'react-redux';


// import {getSchedules} from './action/actionCreater';
import HomePageMainContainer from './containers/homePage/HomePageMainContainer';
import Authenticate from './containers/authenticate/Authenticate';

class App extends Component {
  state={
    currentDate:new Date(),
  }

  logoutHandler=()=>{
    this.props.logUserOut();

    console.log(('app logout emloyee', this.props));
    this.props.history.push("/")
    
  }

  onClickNextWeekHandler=()=>{
    this.setState({
      currentDate: dateFns.addWeeks(dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1}), 1)
    });
  }

  onClickPrevWeekHandler=()=>{
    this.setState({
      currentDate: dateFns.subWeeks(dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1}), 1)
    });
  }
  
  componentDidMount(){
    console.log('did mount from app')
    let token=localStorage.getItem('token')
    if (token) {
      this.props.getCurrentUser(token);
      this.props.fetchGetEvents(token)
    }
  }

  render() {
    // console.log('app render', this.props.currentUser);
    return (
      // <Router>
          <div className="App">
              <Switch>
                <Route exact path='/' component={Authenticate}/>
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
                            onClickPrevWeekHandler={this.onClickPrevWeekHandler}/>
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
