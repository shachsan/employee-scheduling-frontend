import React, { Component } from 'react';
import {removeAssociate} from '../../thunk/associate';
import {removeAssFromStore} from '../../action/actionCreater';
import {connect} from 'react-redux';
import CompanyCalendar from '../../components/CompanyCalendar';
import AssociateShowPage from '../../components/AssociateShowPage';


class CenterContainer extends Component{

    state={
        associate:'',
        // menuSelected:this.props.menuSelected,
    }

    removeTeamHandler = (e, associate)=>{

        //optimistic removal
        this.props.removeAssFromStore(associate)

        //remove from database
        // console.log('associate id:', associate.id);
        let token=localStorage.getItem('token')
        this.props.removeAssociate(token, associate.id)
    }

    onClickAvatarHandler =(e, associate)=>{
        console.log(associate);
        
        this.setState({
            associate:associate,
            // menuSelected:'show',
        })
    }

    renderAssociateShowPage=(associate)=>{
        return <div>
            <AssociateShowPage associate={associate}/>
        </div>
    }

    // console.log(props, "center container")
    renderCenterPage=()=>{
        console.log('menu clicked', this.props.menuSelected);
        // console.log(props);
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
                        // (e)=>this.onClickAvatarHandler(e, associate);
                    ()=>this.props.menuClicked(associate)} className='associate-card'>{associate.name}</div>
                    <button className='btn-del' onClick={(e)=>this.removeTeamHandler(e, associate)}>Remove {associate.name}</button>
                </div>
                )
            })
        }
    }

    render(){
        return ( 
            <div className="hp-center-container">
            {/* {this.state.associate ? this.renderAssociateShowPage(this.state.associate):this.renderCenterPage()} */}
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