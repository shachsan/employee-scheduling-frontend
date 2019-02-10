
import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

class AssociateShowPage extends Component{

    state={
        monday:this.props.associate.monday,
        tuesday:this.props.associate.tuesday,
        wednesday:this.props.associate.wednesday,
        thursday:this.props.associate.thursday,
        friday:this.props.associate.friday,
        saturday:this.props.associate.saturday,
        sunday:this.props.associate.sunday,
        updateBtn:false
    }

    onChangeHandler=(e)=>{

        // console.log('checkbox target',e.target.value);
        this.setState({
            updateBtn:true,
            [e.target.name]:e.target.checked
        })
    }

    render(){
        console.log(this.state);
        return ( 
            <React.Fragment>
                <h1>{this.props.associate.name}</h1>
                <div className="show-emp">Avatar</div>
                <ul>
                    <li>Date of Birth: {this.props.associate.date_of_birth}</li>
                    <li>Gender: {this.props.associate.gender}</li>
                    <li>Position: {this.props.associate.position}</li>
                </ul>
                <h3>Availability</h3>
                <ul>
                    <li>Monday:<input type="checkbox" name="monday" checked={this.state.monday} onChange={this.onChangeHandler}/></li>
                    <li>Tuesday:<input type="checkbox" name="tuesday" checked={this.state.tuesday} onChange={this.onChangeHandler}/></li>
                    <li>Wednesday:<input type="checkbox" name="wednesday" checked={this.state.wednesday} onChange={this.onChangeHandler}/></li>
                    <li>Thursday:<input type="checkbox" name="thursday" checked={this.state.thursday} onChange={this.onChangeHandler}/></li>
                    <li>Friday:<input type="checkbox" name="friday" checked={this.state.friday} onChange={this.onChangeHandler}/></li>
                    <li>Saturday:<input type="checkbox" name="saturday" checked={this.state.saturday} onChange={this.onChangeHandler}/></li>
                    <li>Sunday:<input type="checkbox" name="sunday" checked={this.state.sunday} onChange={this.onChangeHandler}/></li>
                </ul>
                {this.state.updateBtn ? 
                <ButtonToolbar>
                    <Button className="availability" variant='info' onClick={this.handleUpdateAvailability}>Update Availability</Button>
                    <Button className="availability" variant='danger' onClick={this.handleCancelAvailability}>Cancel</Button>
                </ButtonToolbar>
                :null}
            </React.Fragment>
        );
    }
}
 
export default AssociateShowPage;