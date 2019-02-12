

import React, { Component } from 'react';
import {Dropdown} from 'react-bootstrap';

class ShiftDropDown extends Component{
    render() {
        console.log('Shift Drop down');
        return (
            <>
                <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
            </>
        );
    }
}

export default ShiftDropDown;


    //   <DropdownButton
    //     drop={'right'}
    //     variant="secondary"
    //     // title={` Drop ${direction} `}
    //     // id={`dropdown-button-drop-${direction}`}
    //     // key={direction}
    //   >
    //     <Dropdown.Item eventKey="1">Action</Dropdown.Item>
    //     <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
    //     <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
    //     <Dropdown.Divider />
    //     <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
    //   </DropdownButton>
  