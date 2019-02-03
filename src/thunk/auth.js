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
          .then(user=>dispatch(updateStoreWithCurrentUser(user)))
    }
}