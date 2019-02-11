
import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import {fetchUpdateAvailability} from '../thunk/associate';
import {connect} from 'react-redux';
import { getImage } from '../helper_functions/Helper';
import Alert from '../components/Alert';

class AssociateShowPage extends Component{

    state={
        availability:{
            monday:this.props.associate.monday,
            tuesday:this.props.associate.tuesday,
            wednesday:this.props.associate.wednesday,
            thursday:this.props.associate.thursday,
            friday:this.props.associate.friday,
            saturday:this.props.associate.saturday,
            sunday:this.props.associate.sunday,
        },

        originalAvailability:{},
        updateBtn:false,
        renderAlert:false,
        alertMessage:'',
    }

    onChangeHandler=(e)=>{
        
        // console.log('originalAvailability',originalAvailability);
        // if(cancelRequested){
        //     return originalAvailability;
        // }
        const newAvail={...this.state.availability}
        newAvail[e.target.name]=e.target.checked
        // console.log('checkbox target',e.target.value);
        this.setState({
            updateBtn:true,
            renderAlert:false,
            availability:newAvail
        })
    }
    
    handleCancelAvailability=()=>{
        this.setState({
            availability:this.state.originalAvailability,
            updateBtn:false,
        })
    }
    
    handleUpdateAvailability=()=>{
        let token=localStorage.getItem('token')
        this.props.fetchUpdateAvailability(token, this.props.associate.id, this.state.availability)
        this.setState({
            renderAlert:true,
            alertMessage:'Availability successfully updated',
            updateBtn:false,
        })
    }
    
    componentDidMount(){
        const originalAvailability=JSON.parse(JSON.stringify(this.state.availability));
        this.setState({originalAvailability:originalAvailability})
    }

    render(){
        console.log(this.state);
        return ( 
            <React.Fragment>
                <div className="showpage-header">
                    <h1>{this.props.associate.name}</h1>
                    <div><img src={getImage(this.props.associate)} width='300px' height='300px'alt='avatar'/></div>
                    <ul style={{listStyleType:'none'}}>
                        <li>Date of Birth: {this.props.associate.date_of_birth}</li>
                        <li>Gender: {this.props.associate.gender}</li>
                        <li>Position: {this.props.associate.position}</li>
                    </ul>
                </div>
                <div className='showpage-details'>
                    <div className='showpage-availability'>
                        <h3>Availability</h3>
                        <ul>
                            <li>Monday:<input type="checkbox" name="monday" checked={this.state.availability.monday} onChange={this.onChangeHandler}/></li>
                            <li>Tuesday:<input type="checkbox" name="tuesday" checked={this.state.availability.tuesday} onChange={this.onChangeHandler}/></li>
                            <li>Wednesday:<input type="checkbox" name="wednesday" checked={this.state.availability.wednesday} onChange={this.onChangeHandler}/></li>
                            <li>Thursday:<input type="checkbox" name="thursday" checked={this.state.availability.thursday} onChange={this.onChangeHandler}/></li>
                            <li>Friday:<input type="checkbox" name="friday" checked={this.state.availability.friday} onChange={this.onChangeHandler}/></li>
                            <li>Saturday:<input type="checkbox" name="saturday" checked={this.state.availability.saturday} onChange={this.onChangeHandler}/></li>
                            <li>Sunday:<input type="checkbox" name="sunday" checked={this.state.availability.sunday} onChange={this.onChangeHandler}/></li>
                        </ul>
                    </div>
                    <div className='wages-benefits'>
                        <h3>Wages and Benefits</h3>
                        <ul style={{listStyleType:'none'}}>
                            <li>Pay rate <span style={{marginLeft:'5px'}}>$16/hr</span></li>
                            <li>Overtime rate <span style={{marginLeft:'5px'}}>$24/hr</span></li>
                            <hr/>
                            <li>PTO balance <span style={{marginLeft:'5px'}}>36.5 hours</span></li>
                            <li>Sick balance <span style={{marginLeft:'5px'}}>12 hours</span></li>
                        </ul>
                    </div>
                </div>

                {this.state.renderAlert ? <Alert message={this.state.alertMessage}/>:null}
                {this.state.updateBtn ? 
                <div>
                    <ButtonToolbar>
                        <Button className="availability" variant='info' onClick={this.handleUpdateAvailability}>Update Availability</Button>
                        <Button className="availability" variant='danger' onClick={this.handleCancelAvailability}>Cancel</Button>
                    </ButtonToolbar>
                </div>
                :null}
            </React.Fragment>
        );
    }
}
 

const mapDispatchToProps=(dispatch)=>{
   return {
       fetchUpdateAvailability:(token, associateId, availability)=>dispatch(fetchUpdateAvailability(token, associateId, availability))
        }
    }

export default connect(null, mapDispatchToProps)(AssociateShowPage);