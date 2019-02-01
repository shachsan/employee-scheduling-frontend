const initialState={
    dept_asso_schedule:[],
    dept_shifts:[],
}


export default function rootReducer(state=initialState, action){
    switch (action.type) {
        case 'FETCH_SCHEDULES':
            return {
                ...state,
                dept_asso_schedule:action.payload,
            }

        case 'FETCH_DEPT_SHIFTS':
            return {
                ...state, 
                dept_shifts:action.payload
            }

        case 'POST_SCHEDULE':
            return{
                ...state,
                dept_asso_schedule
            }
    
        default:
            return state
    }
}
