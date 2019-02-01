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
            //make a copy of state
            //go to the department you are updating
            //go to associate you are updating schedules
            //make a copy of schedules of that associate
            //add schedules for that associate(schedules comes from payload)
            
            // return{
            //     ...state,
            //     dept_asso_schedule:action.payload,
            //     // ...state,
            //     // dept_asso_schedule:{
            //     //     ...state.dept_asso_schedule[action.deptId].associates[]
            //     // }
                
            //     // action.payload
            //     // dept_asso_schedule
            // }
    
        default:
            return state
    }
}
