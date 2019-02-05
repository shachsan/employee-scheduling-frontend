import {updateStoreWithCurrentUser} from '../action/actionCreater';


export const auth=(username, password)=>{
    return function (dispatch) {

        fetch('http://localhost:3000/api/v1/login',{
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
    console.log(token);
    return function (dispatch) {

        fetch("http://localhost:3000/api/v1/current_user", {
            method: 'GET',
            headers:{
                "Content-Type":"application/json",
                'Authorization': token
                // Action: "application/json", 
                // Authorization:`${token}`
            }
        })
        .then(res=>res.json())
          .then(current_user=>
          dispatch(updateStoreWithCurrentUser(current_user)))
    }
}