import React, { Component } from 'react';
import {addNewTeamMember} from '../thunk/associate';
import {connect} from 'react-redux';

class AddNewTeam extends Component {
    state={
        name:'',
        bday:'',
        gender:'',
        position:'',
        monday:false,
        tuesday:false,
        wednesday:false,
        thursday:false,
        friday:false,
        saturday:false,
        sunday:false,
    
    }

    inputChangeHandler=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    availabilityHandler = (e) => {
        if(e.target.checked){
            this.setState({
                [e.target.name]:true
            })
        }else{
            this.setState({
                [e.target.name]:false
            })
        }
    }

    cancelAddTeamHandler=(e)=>{
        console.log(e.target.parentNode);
        e.target.parentNode.reset();
        this.setState({name:''})
        this.props.clickHandlerAddNewTeam();
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
            monday:this.state.monday,
            tuesday:this.state.tuesday,
            wednesday:this.state.wednesday,
            thursday:this.state.thursday,
            fridaysaturday:this.state.fridaysaturday,
            saturday:this.state.saturday,
            sunday:this.state.sunday,
        }
        this.props.addNewTeamMember(token,newAssociate)
        this.props.clickHandlerAddNewTeam();

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
                 Mon <input style={{marginRight:'15px'}} type="checkbox" name="monday" value="monday"
                 onChange={this.availabilityHandler}/>
                 Tues<input style={{marginRight:'15px'}} type="checkbox" name="tuesday" value="tuesday" 
                 onChange={this.availabilityHandler}/>
                 Wed<input style={{marginRight:'15px'}} type="checkbox" name="wednesday" value="wednesday"
                 onChange={this.availabilityHandler}/>
                 Thurs<input style={{marginRight:'15px'}} type="checkbox" name="thursday" value="thursday" 
                 onChange={this.availabilityHandler}/> 
                 Fri<input style={{marginRight:'15px'}} type="checkbox" name="friday" value="friday"
                 onChange={this.availabilityHandler}/>
                 Sat<input style={{marginRight:'15px'}} type="checkbox" name="saturday" value="saturday" 
                 onChange={this.availabilityHandler}/>
                 Sun<input style={{marginRight:'15px'}} type="checkbox" name="sunday" value="sunday"
                 onChange={this.availabilityHandler} /> <br/><br/>

                 <input type='submit' value='Submit'/>
                 <a href='#' onClick={(e)=>this.cancelAddTeamHandler(e)}>Cancel</a> 

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