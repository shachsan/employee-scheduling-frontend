import {postNewAssociate} from '../action/actionCreater';

export const removeAssociate=(token, id)=>{
    return function(dispatch){
      fetch(`http://localhost:3000/api/v1/associates/${id}`,{
        method:'DELETE',
        headers:{"Content-Type":"application/json",
        'Authorization': token},
      })
    }
}

export const addNewTeamMember=(token, newAss)=>{
    return function(dispatch){
      fetch('http://localhost:3000/api/v1/associates',{
        method:'POST',
        headers:{"Content-Type":"application/json",
        'Authorization': token},
        body:JSON.stringify(newAss)
      }).then(res=>res.json())
      .then(justAddedAss=>dispatch(postNewAssociate(justAddedAss)))
    }
  }

