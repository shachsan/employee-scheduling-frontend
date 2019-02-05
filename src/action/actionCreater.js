// import * as actionTypes from './actionTypes';

export const getSchedules=(schedules)=>({type:'FETCH_SCHEDULES',payload:schedules})
export const getSchedulesOnly=(schedules)=>({type:'FETCH_SCHEDULES_ONLY',payload:schedules})
export const getDeptShifts=(deptShifts)=>({type:'FETCH_DEPT_SHIFTS', payload:deptShifts})
export const postSchedules=(schedule)=>({type:'POST_SCHEDULE', payload:schedule})
export const deleteWholeWeekShifts=(schedules)=>({type:'DELETE_WHOLEWEEKSCHEDULES', payload:schedules})
export const updateStoreWithCurrentUser=(user)=>({type:'UPDATE_CURRENT_USER', payload:user})
export const getDeptAssociates=(associates)=>({type:'FETCH_DEPT_ASSOCIATES', payload:associates})
export const removeAssFromStore=(associate)=>({type:'REMOVE_ASSOCIATE', payload:associate})
// export const updateStoreWithNewTeamMember=(associate)=>({type:'ADD_ASSOCIATE', payload:associate})
export const postNewAssociate=(newAss)=>({type:'FETCH_ADD_ASSOCIATE', payload:newAss})
export const getEvents=(events)=>({type:'FETCH_EVENTS', payload:events})


//Auth Action Creator
// export const authStart=()=>({type:actionTypes.AUTH_START})
// export const authSuccess=(authData)=>({type:actionTypes.AUTH_SUCESS, authData:authData})
// export const authFail=(error)=>({type:actionTypes.AUTH_FAIL, error:error})
// export const auth=(username, password)=>({type:})

