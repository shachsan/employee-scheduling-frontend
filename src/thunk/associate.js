import {postNewAssociate, updateAvailability} from '../action/actionCreater';

export const removeAssociate=(token, id)=>{
    return function(dispatch){
      fetch(`https://employee-auto-scheduling.herokuapp.com/api/v1/associates/${id}`,{
        method:'DELETE',
        headers:{"Content-Type":"application/json",
        'Authorization': token},
      })
    }
}

export const addNewTeamMember=(token, newAss)=>{
    return function(dispatch){
      fetch('https://employee-auto-scheduling.herokuapp.com/api/v1/associates',{
        method:'POST',
        headers:{"Content-Type":"application/json",
        'Authorization': token},
        body:JSON.stringify(newAss)
      }).then(res=>res.json())
      .then(justAddedAss=>dispatch(postNewAssociate(justAddedAss)))
    }
  }

  export const fetchUpdateAvailability=(token, assoId, availability)=>{
    return function(dispatch){
      fetch(`https://employee-auto-scheduling.herokuapp.com/api/v1/associates/${assoId}`,{
        method:'PATCH',
        headers:{"Content-Type":"application/json",
        'Authorization': token},
        body:JSON.stringify(availability)
      }).then(res=>res.json())
      .then(associateUpdateAvail=>dispatch(updateAvailability(associateUpdateAvail)))
    }
  }

