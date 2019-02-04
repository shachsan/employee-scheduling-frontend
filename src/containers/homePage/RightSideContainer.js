import React,{Component} from 'react';
import AddNewTeam from '../../components/AddNewTeam';

class RightSideContainer extends Component{
    state={
        toggleAddBtn:false,
    }

    clickHandlerAddNewTeam=()=>{
        this.setState({toggleAddBtn:!this.state.toggleAddBtn})
    }
    render() {
        return (
            <div className="hp-right-container">
                {this.props.menuSelected==='team' ?
                    <button className='add-new-team-button' onClick={this.clickHandlerAddNewTeam}>Add New Team Member</button>
                    :null
                }
                {this.state.toggleAddBtn ? 
                    <AddNewTeam/>
                    :null
                }
            </div>
        );
    }
}
 
export default RightSideContainer;