export const getSchedules=(schedules)=>({type:'FETCH_SCHEDULES',payload:schedules})
export const getSchedulesOnly=(schedules)=>({type:'FETCH_SCHEDULES_ONLY',payload:schedules})
export const getDeptShifts=(deptShifts)=>({type:'FETCH_DEPT_SHIFTS', payload:deptShifts})
export const postSchedules=(schedule)=>({type:'POST_SCHEDULE', payload:schedule})
export const deleteWholeWeekShifts=(schedules)=>({type:'DELETE_WHOLEWEEKSCHEDULES', payload:schedules})
export const updateStoreWithCurrentUser=(user)=>({type:'UPDATE_CURRENT_USER', payload:user})
export const getDeptAssociates=(associates)=>({type:'FETCH_DEPT_ASSOCIATES', payload:associates})
export const removeAssociate=(associateId)=>({type:'REMOVE_ASSOCIATE', payload:associateId})
export const postNewAssociate=(newAss)=>({type:'FETCH_ADD_ASSOCIATE', payload:newAss})
export const getEvents=(events)=>({type:'FETCH_EVENTS', payload:events})
export const logUserOut=()=>({type:'LOG_OUT'})
export const updateDraggedShift=(newShift)=>({type:'UPDATE_DRAGGED_SHIFT', payload:newShift})
export const cancelEdit=(sch)=>({type:'CANCEL_EDIT_SCHEDULE', payload:sch})
export const updateAvailability=(associate)=>({type:'UPDATE_AVAILABLITY', payload:associate})


