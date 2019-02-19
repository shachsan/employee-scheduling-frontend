import {updateStoreWithCurrentUser} from '../action/actionCreater';


export const auth=(username, password)=>{
    ('inside thunk');
    return function (dispatch) {

        fetch('https://employee-auto-scheduling.herokuapp.com/api/v1/login',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                auth:{username:username,
                password:password}
            })
          }).then(res=>res.json())
          .then(user=>{localStorage.setItem("token", user.jwt);
          dispatch(updateStoreWithCurrentUser(user))})
    }
}


export const getCurrentUser=(token)=>{
    return function (dispatch) {

        fetch("https://employee-auto-scheduling.herokuapp.com/api/v1/current_user", {
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                'Authorization': token
            }
        })
        .then(res=>res.json())
          .then(current_user=>
          dispatch(updateStoreWithCurrentUser(current_user)))
    }
}