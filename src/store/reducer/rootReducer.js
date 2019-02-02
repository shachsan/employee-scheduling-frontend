const initialState={
    dept_asso_schedule:[],
    dept_shifts:[],
    schedules:[],
}


export default function rootReducer(state=initialState, action){
    switch (action.type) {
        case 'FETCH_SCHEDULES':
            return {
                ...state,
                dept_asso_schedule:action.payload,
            }

        case 'FETCH_SCHEDULES_ONLY':
        return {
            ...state,
            schedules:action.payload,
        }

        case 'FETCH_DEPT_SHIFTS':
            return {
                ...state, 
                dept_shifts:action.payload
            }

        case 'POST_SCHEDULE':
            return{
                ...state,
                schedules:action.payload
            }

        case 'DELETE_WHOLEWEEKSCHEDULES':
        return{
            ...state,
            schedules:action.payload
        }
    
        default:
            return state
    }
}
