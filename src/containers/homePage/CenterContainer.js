import React, { Component } from 'react';
import {removeAssociate} from '../../thunk/associate';
import {removeAssFromStore} from '../../action/actionCreater';
import {connect} from 'react-redux';
import CompanyCalendar from '../../components/CompanyCalendar';
import AssociateShowPage from '../../components/AssociateShowPage';


class CenterContainer extends Component{

    state={
        associate:'',
    }

    removeTeamHandler = (e, associate)=>{

        //optimistic removal
        this.props.removeAssFromStore(associate)

        //remove from database
        let token=localStorage.getItem('token')
        this.props.removeAssociate(token, associate.id)
    }

    onClickAvatarHandler =(e, associate)=>{
        console.log(associate);
        
        this.setState({
            associate:associate,
        })
    }

    renderAssociateShowPage=(associate)=>{
        return <div>
            <AssociateShowPage associate={associate}/>
        </div>
    }

    renderCenterPage=()=>{
        if(typeof(this.props.menuSelected)==="object"){
            return <div className='showPage-container'>
                        <AssociateShowPage associate={this.props.menuSelected}/>
                    </div>
        }

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
                    <div onClick={
                    ()=>this.props.menuClicked(associate)} className='associate-card'>{associate.name}</div>
                    <h1>{associate.name}</h1>
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