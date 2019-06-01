import {put} from 'redux-saga/effects';
import * as actionCreaters from '../action/actionCreater';

export function* authLoginSaga(action){
    try{
        const response = yield fetch('https://employee-auto-scheduling.herokuapp.com/api/v1/login',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    auth:{username:action.username,
                    password:action.password}
                })
            })
            const responseData = yield response.json();
            // const data = yield responseJson.data();
            // console.log('login saga fetch response:', responseData.user);
            yield localStorage.setItem("token", responseData.jwt);
            yield put(actionCreaters.updateStoreWithCurrentUser(responseData.user));
    }catch(err){
        console.log('login saga fetch error:', err);
    }
}

export function* removeAssociateSaga(action){
    let token = yield localStorage.getItem('token');
    try {
        yield fetch(`https://employee-auto-scheduling.herokuapp.com/api/v1/associates/${action.id}`,{
                    method:'DELETE',
                    headers:{"Content-Type":"application/json",
                            'Authorization': token},
      })
    //   console.log('removeAssociateSaga response:', response.json());
      yield put(actionCreaters.removeAssociate(action.id));
    } catch (error) {
        console.log('remove Associate Error:', error);
    }
}