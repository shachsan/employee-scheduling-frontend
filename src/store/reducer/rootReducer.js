const initialState={
    dept_asso_schedule:[]
}


export default function rootReducer(state=initialState, action){
    switch (action.type) {
        case 'FETCH_SCHEDULES':
            return {
                ...state,
                dept_asso_schedule:action.payload,
            }
    
        default:
            return state
    }
}
