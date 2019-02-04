import React, { Component } from 'react';
import {auth} from '../../thunk/auth';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';


class Authenticate extends Component {

    state={
        form:{
            username:'',
            password:''
        }
    }



    onSubmitHandler=(e)=>{
        e.preventDefault();
        // console.log(this.state);
        
        this.props.onAuth(this.state.form.username, this.state.form.password)
    }

    

    inputChangeHandler=(e)=>{
        const newState={...this.state.form}
        newState[e.target.name]=e.target.value;
        this.setState({form:newState})
        // console.log(newState)
    }

    render() {
        
        return (
            <React.Fragment>
            {this.props.currentUser.user ? <Redirect to='/home'/> :
                <div>
                    <form onSubmit={this.onSubmitHandler}>
                        <span style={{backgroundColor:'red', color:'white'}}>{this.props.currentUser.message}</span><br/>
                        <label>Enter Username</label>
                        <input type='text' name='username' value={this.state.form.username} required
                        onChange={(e)=>this.inputChangeHandler(e)}/> <br/>
                        <label>Enter Password</label>
                        <input type='text' name='password' value={this.state.form.password} required
                        onChange={(e)=>this.inputChangeHandler(e)}/> <br/>

                        <input type='submit' value="Login"/>

                    </form>
                </div>
            }
            </React.Fragment> 
        );
    }
};

const mapStateToProps=(state)=>{
    return {
        currentUser: state.currentLogInUser,
    }
}

const mapDispatchToProps=(dispatch)=>{
    return{
        onAuth:(username, password)=>dispatch(auth(username, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);

