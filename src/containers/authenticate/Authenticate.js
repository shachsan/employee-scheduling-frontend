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
        this.props.onAuth(this.state.form.username, this.state.form.password)
    }

    

    inputChangeHandler=(e)=>{
        const newState={...this.state.form}
        newState[e.target.name]=e.target.value;
        this.setState({form:newState})
    }

    render() {
        return (
            <React.Fragment>
            {this.props.currentUser.user ? <Redirect to='/home'/> :
                    <form className="login" onSubmit={this.onSubmitHandler}>
                        <div style={{paddingTop:'15px', height:'50px', margin:'0px', backgroundColor:'yellowgreen', outline:'none', textAlign:'center'}}>
                        <h3 style={{color:'midnightblue'}}>Welcome</h3></div>
                        <div style={{backgroundColor:'yellow', color:'blue'}}>To test this app, please login with the following credentials:</div>
                        <div style={{backgroundColor:'yellow', color:'blue'}}>username: <span style={{backgroundColor:'green', color:'white', padding:'0 5px'}}>sanjay</span>  password:<span style={{backgroundColor:'green', color:'white', padding:'0 5px', marginLeft:'10px'}}>test</span></div>
                        {this.props.currentUser.message !==null ?
                            <><span style={{backgroundColor:'red', color:'white'}}>{this.props.currentUser.message}</span><br/></>
                        :null}
                        <input type='text' name='username' value={this.state.form.username} placeholder="username" required
                        onChange={(e)=>this.inputChangeHandler(e)}/> <br/>
                        
                        <input type='password' name='password' value={this.state.form.password} placeholder="password" required
                        onChange={(e)=>this.inputChangeHandler(e)}/> <br/>

                        <input className="login-submit" type='submit' value="Login"/>

                    </form>
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
        onAuth:(username, password)=>dispatch(auth(username, password)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate);

