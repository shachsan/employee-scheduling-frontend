import React, { Component } from 'react';
import RightSideContainer from './CenterContainer';
import LeftSideContainer from './LeftSideContainer';
import CenterContainer from './RightSideContainer';

class HomePageMainContainer extends Component {


    render() {
        return (
             <div className="hp-main-container">
                <LeftSideContainer/>
                <CenterContainer/>
                <RightSideContainer/>
                 
             </div>
        );
    }
};

export default HomePageMainContainer;
