import React, { Component } from 'react';
import RightSideContainer from './CenterContainer';
import LeftSideContainer from './LeftSideContainer';
import CenterContainer from './RightSideContainer';
import { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';

class HomePageMainContainer extends Component {


    render() {
        return (
            <React.Fragment>
                {this.props.currentUser.user ?
                    <div className="hp-main-container">
                        <LeftSideContainer/>
                        <CenterContainer/>
                        <RightSideContainer/>
                    </div>
                    :<Redirect to='/'/>
                }
            </React.Fragment>
        );
    }
};

const mapStateToProps=(state)=>{
    return {
        currentUser: state.currentLogInUser,
    }
}

export default connect(mapStateToProps)(HomePageMainContainer);
