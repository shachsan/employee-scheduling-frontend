import React, { Component } from 'react';
import {auth, getCurrentUser} from '../../thunk/auth';
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
        console.log('login button clicked');
        this.props.onAuth(this.state.form.username, this.state.form.password)
    }

    

    inputChangeHandler=(e)=>{
        const newState={...this.state.form}
        newState[e.target.name]=e.target.value;
        this.setState({form:newState})
        // console.log(newState)
    }

    //  resetPasswordInput=()=>{
    //      const pass={...this.state}
    //      console.log('heelo from reset pass', pass);
    //     pass.password=""
    //     console.log('pass', pass);
    //     this.setState({form:pass})
    // }

    render() {
        // console.log('from auth', this.state)
        return (
            <React.Fragment>
            {this.props.currentUser.user ? <Redirect to='/home'/> :
                // <div>
                    <form className="login" onSubmit={this.onSubmitHandler}>
                        <div style={{paddingTop:'15px', height:'50px', margin:'0px', backgroundColor:'yellowgreen', outline:'none', textAlign:'center'}}>
                        <h3 style={{color:'midnightblue'}}>Welcome</h3></div>
                        {this.props.currentUser.message !==null ?
                            <><span style={{backgroundColor:'red', color:'white'}}>{this.props.currentUser.message}</span><br/></>
                        :null}
                        {/* <label>Username</label> */}
                        <input type='text' name='username' value={this.state.form.username} placeholder="username" required
                        onChange={(e)=>this.inputChangeHandler(e)}/> <br/>
                        {/* <label>Password</label> */}
                        
                        <input type='password' name='password' value={this.state.form.password} placeholder="password" required
                        onChange={(e)=>this.inputChangeHandler(e)}/> <br/>

                        <input className="login-submit" type='submit' value="Login"/>

                    </form>
                // </div>
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

