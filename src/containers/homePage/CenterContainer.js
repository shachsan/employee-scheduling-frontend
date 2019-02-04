import React from 'react';


const CenterContainer = (props) => {

    console.log(props, "center container")
    const getAssociates=()=>{
        console.log(props);
        if(props.menuSelected==='team'){
            console.log('hello from center container');
            return props.deptAssociates.map(associate=>{
                return <div key={associate.id}>{associate.name}</div>
            })
        }
    }

    
    return ( 
        <div className="hp-center-container">
           {getAssociates()}
        </div>
                 
     );
}
 
export default CenterContainer;