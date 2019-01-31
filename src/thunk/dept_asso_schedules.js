import { getSchedules } from '../action/actionCreater';
import {getDeptShifts} from '../action/actionCreater';

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
 