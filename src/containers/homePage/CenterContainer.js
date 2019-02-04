import React, { Component } from 'react';
import {removeAssociate} from '../../thunk/associate';
import {removeAssFromStore} from '../../action/actionCreater';
import {connect} from 'react-redux';


class CenterContainer extends Component{

    removeTeamHandler = (e, associate)=>{

        //optimistic removal
        this.props.removeAssFromStore(associate)

        //remove from database
        let token=localStorage.getItem('token')
        // this.props.removeAssociate(token, associate.id)
    }

    // console.log(props, "center container")
    getAssociates=()=>{
        // console.log(props);
        if(this.props.menuSelected==='team'){
            console.log('hello from center container');
            return this.props.deptAssociates.map(associate=>{
                return (
                <div key={associate.id} className='asso-card-wrapper'> 
                    <div className='ass-avatar'></div>
                    <div className='associate-card'>{associate.name}</div>
                    <button className='btn-del' onClick={(e)=>this.removeTeamHandler(e, associate)}>Remove {associate.name}</button>
                </div>
                )
            })
        }
    }

    render(){
        return ( 
            <div className="hp-center-container">

            {this.getAssociates()}
            </div>
                    
        );
    }
}

const mapStateToProps=(state)=>{
    return {

    }
}

const mapDispatchToProps=(dispatch)=>{
    return {
        removeAssociate:(id)=>dispatch(removeAssociate(id)),
        removeAssFromStore:(associate)=>dispatch(removeAssFromStore(associate))
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(CenterContainer);