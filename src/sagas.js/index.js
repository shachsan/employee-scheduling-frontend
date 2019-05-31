import {takeEvery} from 'redux-saga/effects';
import * as actions from '../action/actionTypes';
import {authLoginSaga} from './associateSagas'

// import { select, takeEvery } from 'redux-saga/effects'



export default function* mySaga(){
    yield takeEvery(actions.LOGIN_START, (action)=>authLoginSaga(action));//takeEvery will pass
    //action object to the callback function
}