import React, { Component } from 'react';
import {Button,ButtonToolbar, Alert} from 'react-bootstrap';

class UpdateAlert extends Component {
    constructor(props) {
      super(props);
  
      this.state = { show: true };
    }

    handleDiscard=()=>{
      this.setState({ show: false });
    }
  
    render() {
      return (
        <>
          {this.state.show ?
          <Alert variant="warning">
            <p>
              You have made some changes on the current schedules. What would you like to do?
            </p>
            <ButtonToolbar>
              <Button onClick={()=>{this.handleDiscard();this.props.resetEdittedShiftHandler()}} variant="outline-danger">
                Discard Changes
              </Button>
              <Button onClick={()=>{this.handleDiscard();this.props.updateShiftsHandler()}} variant="outline-success">
                Update
              </Button>
            </ButtonToolbar>

          </Alert>
          :null}
  
          {/* {!this.state.show && <Button onClick={handleShow}>Show Alert</Button>} */}
        </>
      );
    }
  }

  export default UpdateAlert;