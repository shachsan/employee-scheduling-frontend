import React, { Component } from 'react';


export default class AnimationDiv extends Component {

    componentWillUnmount(){
        
    }

    render() {
        console.log('animation div');
        return (
             <div className="animate-div"></div>
        );
    }
};
