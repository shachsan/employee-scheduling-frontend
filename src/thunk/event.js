import {getEvents} from '../action/actionCreater'; 

export const fetchGetEvents = (token) => {
    return function (dispatch) {
  
      fetch('https://employee-auto-scheduling.herokuapp.com/api/v1/calendar_events',{
        method:'GET',
        headers:{
         "Content-Type":"application/json",
         'Authorization': token
        }
       })
       .then(res => res.json())
       .then(events => {
         dispatch(getEvents(events))
       })
   }
  }