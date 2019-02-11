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