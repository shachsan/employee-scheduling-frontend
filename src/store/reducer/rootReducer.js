const initialState={
    dept_asso_schedule:[],
    dept_shifts:[],
    schedules:[],
    deptAssociates:[],
    currentLogInUser:'',
    events:[],
    draggedShift:{},
}


export default function rootReducer(state=initialState, action){
    switch (action.type) {
        case 'FETCH_SCHEDULES':
            return {
                ...state,
                dept_asso_schedule:action.payload,
            }

        case 'FETCH_EVENTS':
        return {
            ...state,
            events:action.payload,
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
                schedules:state.schedules.concat(action.payload)
            }

        case 'DELETE_WHOLEWEEKSCHEDULES':
        return{
            ...state,
            schedules:action.payload
        }

        case 'UPDATE_CURRENT_USER':
            return{
                ...state,
                currentLogInUser:action.payload
            }
        
        case 'FETCH_DEPT_ASSOCIATES':
        return{
            ...state,
            deptAssociates:action.payload
        }


        case 'REMOVE_ASSOCIATE':
        return{
            ...state,
            deptAssociates:[...state.deptAssociates.filter(ass=>ass!==action.payload)]
        }

        case 'FETCH_ADD_ASSOCIATE':
        return{
            ...state,
            deptAssociates:[...state.deptAssociates,action.payload]
        }
        
        case 'LOG_OUT':
        return{
            ...state,
            currentLogInUser:''
        }

        case 'SET_DRAGGED_SHIFT':
        return {
            ...state,
            draggedShift:action.payload,
        }
        
        default:
            return state
    }
}
