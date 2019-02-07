import { 
  getSchedules, getDeptShifts, postSchedules, 
  getSchedulesOnly, getDeptAssociates
} from '../action/actionCreater';

export const fetchGetSchedules = (token) => {
        return function (dispatch) {

         fetch(`http://localhost:3000/api/v1/departments`
         ,{
           method:'GET',
           headers:{
            "Content-Type":"application/json",
            'Authorization': token
           }
          })
        
          .then(res => res.json())
          .then(schedules => {
            dispatch(getSchedules(schedules))
          })
      }
}

export const fetchGetSchedulesOnly = (token) => {
  return function (dispatch) {

   fetch('http://localhost:3000/api/v1/schedules',{
    method:'GET',
    headers:{
     "Content-Type":"application/json",
     'Authorization': token
    }
   })
    .then(res => res.json())
    .then(schedules => {
      dispatch(getSchedulesOnly(schedules))
    })
}
}

export const fetchGetDeptShifts = (token) => {
  return function (dispatch) {

    fetch('http://localhost:3000/api/v1/dept_shifts',{
      method:'GET',
      headers:{
       "Content-Type":"application/json",
       'Authorization': token
      }
     })
     .then(res => res.json())
     .then(deptShifts => {
       dispatch(getDeptShifts(deptShifts))
     })
 }
}

export const fetchPostSchedules=(token, schedule)=>{
  return function(dispatch){
    fetch('http://localhost:3000/api/v1/schedules',{
      method:'POST',
      headers:{"Content-Type":"application/json",
      'Authorization': token},
      body:JSON.stringify(schedule)
    }).then(res=>res.json())
    .then(justAddedSchedule=>dispatch(postSchedules(justAddedSchedule)))
  }
}

export const fetchGetDeptAssociates = (deptId,token) => {
  return function (dispatch) {

   fetch(`http://localhost:3000/api/v1/associates/${deptId}`
   ,{
     method:'GET',
     headers:{
      "Content-Type":"application/json",
      'Authorization': token
     }
    })
  
    .then(res => res.json())
    .then(associates => {
      dispatch(getDeptAssociates(associates))
    })
}
}

export const fetchUpdateEdittedShifts=(token, edittedShifts)=>{
  return function (dispatch) {

    fetch(`http://localhost:3000/api/v1/schedules/updateBatchSchs`,{
      method:'GET',
      headers:{
       "Content-Type":"application/json",
       'Authorization': token
      },
      body:JSON.stringify(edittedShifts)
     })
}
}


 