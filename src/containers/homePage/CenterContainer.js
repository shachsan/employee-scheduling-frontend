import React, { Component } from 'react';
import {removeAssociate} from '../../thunk/associate';
import {removeAssFromStore} from '../../action/actionCreater';
import {connect} from 'react-redux';
import CompanyCalendar from '../../components/CompanyCalendar';


class CenterContainer extends Component{

    removeTeamHandler = (e, associate)=>{

        //optimistic removal
        this.props.removeAssFromStore(associate)

        //remove from database
        // console.log('associate id:', associate.id);
        let token=localStorage.getItem('token')
        this.props.removeAssociate(token, associate.id)
    }

    // console.log(props, "center container")
    renderCenterPage=()=>{
        // console.log(props);
        if(this.props.menuSelected===''){
            return <div className='heading-center-container'><h2>Company Calendar</h2>
                        <CompanyCalendar events={this.props.events}/>
                    </div>
        }

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
        removeAssociate:(token, id)=>dispatch(removeAssociate(token, id)),
        removeAssFromStore:(associate)=>dispatch(removeAssFromStore(associate))
    }
}
 
export default connect(mapStateToProps, mapDispatchToProps)(CenterContainer);