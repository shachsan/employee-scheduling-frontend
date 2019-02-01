import { getSchedules, postSchedules } from '../action/actionCreater';
import {getDeptShifts} from '../action/actionCreater';
import {postSchedule} from '../action/actionCreater';

export const fetchGetSchedules = () => {
        return function (dispatch) {

         fetch('http://localhost:3000/api/v1/departments')
          .then(res => res.json())
          .then(schedules => {
            dispatch(getSchedules(schedules))
          })
      }
}

export const fetchGetDeptShifts = () => {
  return function (dispatch) {

    fetch('http://localhost:3000/api/v1/dept_shifts')
     .then(res => res.json())
     .then(deptShifts => {
       dispatch(getDeptShifts(deptShifts))
     })
 }
}

export const fetchPostSchedules=(schedule)=>{
  return function(dispatch){
    fetch('http://localhost:3000/api/v1/schedules',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(schedule)
    }).then(res=>res.json())
      .then(schedule=>dispatch(postSchedule(schedule)))
      // .then(res=>res.json())
  }
}
 