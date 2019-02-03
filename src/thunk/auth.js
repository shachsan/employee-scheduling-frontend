import {authStart} from '../action/actionCreater';

export const auth=(username, password)=>{
    return dispatch=>{
        dispatch(authStart())
    }
}