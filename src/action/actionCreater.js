export const getSchedules=(schedules)=>({type:'FETCH_SCHEDULES',payload:schedules})
export const getDeptShifts=(deptShifts)=>({type:'FETCH_DEPT_SHIFTS', payload:deptShifts})
export const postSchedules=(schedule)=>({type:'POST_SCHEDULE', payload:schedule})