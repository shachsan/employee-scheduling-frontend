
import React from 'react';

const AssociateShowPage = (props) => {
    console.log(props);
    return ( 
        <React.Fragment>
            <h1>{props.associate.name}</h1>
            <div className="show-emp">Avatar</div>
            <ul>
                <li>Date of Birth: {props.associate.date_of_birth}</li>
                <li>Gender: {props.associate.gender}</li>
                <li>Position: {props.associate.position}</li>
            </ul>
        </React.Fragment>
     );
}
 
export default AssociateShowPage;