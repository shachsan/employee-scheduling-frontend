import {put} from 'redux-saga/effects';
import dateFns from 'date-fns';
import * as actionCreaters from '../action/actionCreater';
// import { dateFns } from 'date-fns';
import { ListItemIcon } from '@material-ui/core/ListItemIcon';

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
            yield localStorage.setItem("token", responseData.jwt);
            yield localStorage.setItem("expiration", dateFns.addDays(new Date(), 1));
            yield localStorage.setItem('user', JSON.stringify(responseData.user));
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
      yield put(actionCreaters.removeAssociate(action.id));
    } catch (error) {
        console.log('remove Associate Error:', error);
    }
}