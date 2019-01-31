import React, { Component } from 'react';
import './App.css';
import Calendar from './components/Calendar';
import RightSideContainer from './containers/RightSideContainer';
// import {getSchedules} from './action/actionCreater';

class App extends Component {

  

  render() {
    return (
      <div className="App">
       <Calendar/>
       <RightSideContainer/>
      </div>
    );
  }
}

export default App;
