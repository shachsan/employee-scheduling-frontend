import male from '../img/male.png';
import female from '../img/female.png';
import other from '../img/other.jpeg';
import noPhoto from '../img/noPhoto.jpeg';

export const getImage=(associate)=>{
    if(associate.gender==='male'){
        return male
    }else if(associate.gender==='female'){
        return female
    }else if(associate.gender==='other'){
        return other
    }else{
        return noPhoto
    }
}


      
export const getShiftTime=(id)=>{
    if(id===1)
    return "8AM - 4PM"
    if(id===2)
    return "11AM - 7PM"
    if(id===3)
    return "2PM - 10PM"
  }
  
  export const getShiftColor=(shiftId)=>{
    if(shiftId===1){
      return 'open'
    }else if(shiftId===2){
      return 'mid'
    }else if(shiftId===3){
      return 'closed'
    }else{
      return 'day-off'
    }
  }