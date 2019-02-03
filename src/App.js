import React, { Component } from 'react';
import './App.css';
import Calendar from './components/Calendar';
import ScheduleRightSideContainer from './containers/ScheduleRightSideContainer';
import NavContainer from './containers/NavContainer';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';


// import {getSchedules} from './action/actionCreater';
import HomePageMainContainer from './containers/homePage/HomePageMainContainer';

class App extends Component {

  

  render() {
    return (
      <Router>
          <div className="App">
              <NavContainer/>
              <Switch>
                <Route exact path='/' component={HomePageMainContainer}/>
              </Switch>
              <Switch>
                <Route exact path='/schedule' render={()=>(
                  <React.Fragment>
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
