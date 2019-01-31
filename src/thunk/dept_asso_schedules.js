import { getSchedules } from '../action/actionCreater';

export const fetchGetSchedules = () => {
        return function (dispatch) {

         fetch('http://localhost:3000/api/v1/departments')
          .then(res => res.json())
          .then(schedules => {
            dispatch(getSchedules(schedules))
          })
      }
}