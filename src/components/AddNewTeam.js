import React, { Component } from 'react';
import {addNewTeamMember} from '../thunk/associate';
import {connect} from 'react-redux';

class AddNewTeam extends Component {
    state={
        name:'',
        bday:'',
        gender:'',
        position:'',
        availability:[],
    }

    inputChangeHandler=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    availabilityHandler = (e) => {
        let newAvailability=[...this.state.availability]
        if(e.target.checked)
            newAvailability.push(e.target.value)
        else
            newAvailability.splice(newAvailability.indexOf(e.target.value),1)
        this.setState({
            availability:newAvailability
        })
    }

    onSubmitHandler=(e)=>{
        e.preventDefault();
        let token=localStorage.getItem('token');
        let newAssociate={
            name:this.state.name,
            date_of_birth:this.state.bday,
            position:this.state.position,
            gender:this.state.gender,
            department_id:this.props.deptId,
        }
        this.props.addNewTeamMember(token,newAssociate)
    }
     
    render() {
        return (
             <form onSubmit={(e)=>this.onSubmitHandler(e)}>
                 <label>Name:</label>
                 <input type='text' name='name' value={this.state.name}
                 onChange={this.inputChangeHandler}/> <br/>

                 <label>Date of birth:</label>
                 <input type="date" name="bday"
                 onChange={this.inputChangeHandler}/> <br/>


                 <label>Gender:</label><br/>
                 <input type="radio" name="gender" value="male" 
                 onChange={this.inputChangeHandler}/> Male <br/>
                 <input type="radio" name="gender" value="female"
                 onChange={this.inputChangeHandler}/> Female<br/>
                 <input type="radio" name="gender" value="other"
                 onChange={this.inputChangeHandler}/> Other <br/><br/>


                 <label>Position:</label><br/>
                 <input type="radio" name="position" value="full-time"
                 onChange={this.inputChangeHandler}/> Full Time <br/>
                 <input type='radio' name='position' value="part-time"
                 onChange={this.inputChangeHandler}/> Part Time<br/><br/>

                 <label>Availability</label><br/>
                 <input type="checkbox" name="mon" value="mon"
                 onChange={this.availabilityHandler}/> Mon
                 <input type="checkbox" name="tues" value="tues" 
                 onChange={this.availabilityHandler}/> Tues
                 <input type="checkbox" name="wed" value="wed"
                 onChange={this.availabilityHandler}/> Wed
                 <input type="checkbox" name="thurs" value="thurs" 
                 onChange={this.availabilityHandler}/> Thurs
                 <input type="checkbox" name="fri" value="fri"
                 onChange={this.availabilityHandler}/> Fri
                 <input type="checkbox" name="sat" value="sat" 
                 onChange={this.availabilityHandler}/> Sat
                 <input type="checkbox" name="sun" value="sun"
                 onChange={this.availabilityHandler} /> Sun<br/><br/>

                 <input type='submit' value='Submit'/>

             </form>
        );
    }
};

const mapDispatchToProps=(dispatch)=>{
    return {
      addNewTeamMember:(token,newAssociate)=>dispatch(addNewTeamMember(token, newAssociate)),
    }
}

export default connect(null, mapDispatchToProps)(AddNewTeam)