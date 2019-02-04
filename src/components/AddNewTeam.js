import React, { Component } from 'react';

export default class AddNewTeam extends Component {
    state={
        name:'',
        dob:'',
        gender:'',
        position:'',
        availability:[],
    }
    render() {
        return (
             <form>
                 <label>Name:</label>
                 <input type='text' name='name' value={this.state.name}
                 onChange={this.inputChangeHandler}/> <br/>
                 <label>Date of birth:</label>
                 <input type='text' name='dob' value={this.state.dob}
                 onChange={this.inputChangeHandler}/> <br/>
                 <label>Gender:</label>
                 <input type="radio" name="gender" value="male"
                 onChange={this.genderRadioHandler}/> Male <br/>
                 <input type="radio" name="gender" value="female"
                 onChange={this.genderRadioHandler}/> Female<br/>
                 <input type="radio" name="gender" value="other"
                 onChange={this.genderRadioHandler}/> Other 
                 <label>Position:</label>
                 <input type="radio" name="position" value="full-time"
                 onChange={this.positionRadioHandler}/> Full Time <br/>
                 <input type='radio' name='position' value="part-time"
                 onChange={this.positionRadioHandler}/> Part Time<br/>

                 <label>Availability</label>
                 <input type="checkbox" name="mon" value="mon"
                 onChange={this.availabilityCheckHandler}/> Mon
                 <input type="checkbox" name="tues" value="tues" /> Tues
                 <input type="checkbox" name="wed" value="wed"/> Wed
                 <input type="checkbox" name="thurs" value="thurs" /> Thurs
                 <input type="checkbox" name="fri" value="fri"/> Fri
                 <input type="checkbox" name="sat" value="sat" /> Sat
                 <input type="checkbox" name="sun" value="sun" /> Sun



                 <input type='submit' value='Submit'/>

             </form>
        );
    }
};
