import React, { Component } from 'react';
import './App.css';
import Calendar from './components/Calendar';
import ScheduleRightSideContainer from './containers/ScheduleRightSideContainer';
import NavContainer from './containers/NavContainer';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';


// import {getSchedules} from './action/actionCreater';
import HomePageMainContainer from './containers/homePage/HomePageMainContainer';
import Authenticate from './containers/authenticate/Authenticate';

class App extends Component {

  

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
                    <Calendar/>
                    <ScheduleRightSideContainer/>
                  </React.Fragment>
                )}/>
              </Switch>
          </div>
      </Router>
    );
  }
}

export default App;
