import React, { Component } from 'react';
import './App.css';
import Calendar from './components/Calendar';
import ScheduleRightSideContainer from './containers/ScheduleRightSideContainer';
import NavContainer from './containers/NavContainer';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {fetchGetEvents} from './thunk/event';
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
    let token=localStorage.getItem('token')
    this.props.fetchGetEvents(token)
  }

  render() {
    return (
      <Router>
          <div className="App">
              <Switch>
                <Route exact path='/' component={Authenticate}/>
              </Switch>
                
              <Switch>
                <Route exact path='/home' render={()=>(
                  <React.Fragment>
                    <NavContainer/>
                    <HomePageMainContainer/>
                  </React.Fragment>
                )}/>
              </Switch>
                
              <Switch>
                <Route exact path='/schedule' render={()=>(
                  <React.Fragment>
                    <NavContainer/>
                    <Calendar currentDate={this.state.currentDate}
                            onClickNextWeekHandler={this.onClickNextWeekHandler}
                            onClickPrevWeekHandler={this.onClickPrevWeekHandler}/>
                    <ScheduleRightSideContainer currentDate={this.state.currentDate}/>
                  </React.Fragment>
                )}/>
              </Switch>
          </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return ( {
      events:state.events
  } );
}

const mapDispatchToProps = (dispatch) => {
  return ( {
    fetchGetEvents:(token)=>dispatch(fetchGetEvents(token)),
  } );
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
