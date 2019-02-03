import React, { Component } from 'react';
import {auth} from '../../thunk/auth';
import {connect} from 'react-redux';


class Authenticate extends Component {

    state={
        form:{
            username:'',
            password:''
        }
    }

    onSubmitHandler=(e)=>{
        e.preventDefault();
        this.props.onAuth(this.state.username, this.state.password)
    }

    inputChangeHandler=(e)=>{
        const newState={...this.state.form}
        newState[e.target.name]=e.target.value;
        this.setState({form:newState})
        // console.log(newState)
    }

    render() {
        return (
             <div>
                 <form onSubmit={this.onSubmitHandler}>
                     <label>Enter Username</label>
                     <input type='text' name='username' value={this.state.form.username}
                        onChange={(e)=>this.inputChangeHandler(e)}/> <br/>
                     <label>Enter Password</label>
                     <input type='text' name='password' value={this.state.form.password}
                        onChange={(e)=>this.inputChangeHandler(e)}/> <br/>
                     <input type='submit' value="Submit"/>

                 </form>
             </div>
        );
    }
};

const mapDispatchToProps=(dispatch)=>{
    return{
        onAuth:(username, password)=>dispatch(auth(username, password))
    }
}

export default connect(null, mapDispatchToProps)(Authenticate);

