import React, { Component } from 'react';
// import {removeAssociate} from '../../thunk/associate';
// import * as actions from '../../action/actionCreater';
// import {removeAssFromStore} from '../../action/actionCreater';
import * as actionTypes from '../../action/actionTypes';
import {connect} from 'react-redux';
import CompanyCalendar from '../../components/CompanyCalendar';
import AssociateShowPage from '../../components/AssociateShowPage';
import {getImage} from '../../helper_functions/Helper';


class CenterContainer extends Component{

    // state={
    //     associate:'',
    // }

    removeTeamHandler = (e, associateId)=>{

        // let token=localStorage.getItem('token')
        this.props.removeAssociate(associateId)
        //optimistic removal
        // this.props.removeAssFromStore(associate)

        //remove from database
    }

    // onClickAvatarHandler =(e, associate)=>{
    //     (associate);
        
    //     this.setState({
    //         associate:associate,
    //     })
    // }

  

    renderAssociateShowPage=(associate)=>{
        return <div>
            <AssociateShowPage associate={associate}/>
        </div>
    }

    renderCenterPage=()=>{
        if(typeof(this.props.menuSelected)==="object"){
            return <div>
                        <AssociateShowPage associate={this.props.menuSelected}/>
                    </div>
        }

        if(this.props.menuSelected===''){
            return <div className='heading-center-container'><h2>Company Calendar</h2>
                        <CompanyCalendar events={this.props.events}/>
                    </div>
        }

        if(this.props.menuSelected==='team'){
            return this.props.deptAssociates.map(associate=>{
                return (
                <div key={associate.id} className='asso-card-wrapper'> 
                    <div onClick={
                    ()=>this.props.menuClicked(associate)}><img src={getImage(associate)} width='200px' height='200px'alt='avatar'/></div>
                    <h1>{associate.name}</h1>
                    <button className='btn-del' onClick={(e)=>this.removeTeamHandler(e, associate.id)}>Remove {associate.name}</button>
                </div>
                )
            })
        }
    }


    render(){
        return ( 
            <div className="hp-center-container">
            {this.renderCenterPage()}
            
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
        removeAssociate:(id)=>dispatch({type:actionTypes.DELETE_ASSOCIATE, id}),
        // remove:(associate)=>dispatch(actions.removeAssociate(associate))
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(CenterContainer);