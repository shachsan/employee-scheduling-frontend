import {put} from 'redux-saga/effects';
import * as actionCreaters from '../action/actionCreater';

export function* authLoginSaga(action){
    // console.log('user inside saga:', action);

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