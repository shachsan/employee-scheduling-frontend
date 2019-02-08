import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

class UpdateAlert extends Component {
    constructor(props) {
      super(props);
  
      this.state = { show: true };
    }
  
    render() {
      const handleHide = () => this.setState({ show: false });
      const handleShow = () => this.setState({ show: true });
      return (
        <>
          <Alert show={this.state.show} variant="success">
            {/* <Alert.Heading>How's it going?!</Alert.Heading> */}
            <p>
              You have made some changes on the current schedules. What would you like to do?
            </p>
            {/* <hr /> */}
            <div className="d-flex justify-content-middle">
              <Button onClick={handleHide} variant="outline-success">
                Discard Changes
              </Button>
            </div>

            <div className="d-flex justify-content-end">
              <Button onClick={handleHide} variant="outline-success">
                Update
              </Button>
            </div>

          </Alert>
  
          {!this.state.show && <Button onClick={handleShow}>Show Alert</Button>}
        </>
      );
    }
  }

  export default UpdateAlert;