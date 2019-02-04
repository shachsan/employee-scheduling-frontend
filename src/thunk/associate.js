export const removeAssociate=(token, id)=>{
    return function(dispatch){
      fetch(`http://localhost:3000/api/v1/schedules${id}`,{
        method:'DELETE',
        headers:{"Content-Type":"application/json",
        'Authorization': token},
      })
    }
}