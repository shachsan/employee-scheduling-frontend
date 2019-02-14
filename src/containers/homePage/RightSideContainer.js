import React,{Component} from 'react';
import AddNewTeam from '../../components/AddNewTeam';
import dateFns from 'date-fns';
import { getShiftColor, getShiftTime } from '../../helper_functions/Helper';

class RightSideContainer extends Component{
    state={
        toggleAddBtn:false,
    }

    getAssociateName=(id)=>{
        if(this.props.deptAssociates.length>0){
            const empName = this.props.deptAssociates.find(as=>as.id===id)
            return empName.name;
        }
    }

    renderRightContainer=()=>{
        if(this.props.menuSelected===''){
            const todaySch=this.props.schedules.filter(sch=>
                sch.date===dateFns.format(new Date(), 'YYYY-MM-DD'))
                return (
                    <React.Fragment>
                    <h1>Today's Roster</h1>

                    {todaySch.map(sch=>(
                        <div className="roaster-shift"key={sch.id}><span>{this.getAssociateName(sch.associate_id)}</span> <span className={getShiftColor(sch.shift_id)}>{getShiftTime(sch.shift_id)}</span></div>
                    ))}
                </React.Fragment>
            )
        }
        if(this.props.menuSelected==='team'){
           return <button className='add-new-team-button' 
                onClick={this.clickHandlerAddNewTeam}>Add New Team Member</button>
        }

        if(typeof(this.props.menuSelected)==='object'){
            const associateSch=this.props.schedules.filter(sch=>
                sch.associate_id===this.props.menuSelected.id &&
                dateFns.parse(sch.date)>=new Date())
            if(associateSch){
                return <div><h2>{`${this.props.menuSelected.name}'s Upcoming Schedule`}</h2>
                    {associateSch.map(as=><div className='rsc-date-shift' key={as.id}><span className='rsc-date'>
                    {as.date} | {dateFns.format(as.date, 'ddd')}</span><span className={`rsc-shift ${getShiftColor(as.shift_id)}`}>{getShiftTime(as.shift_id)}</span></div>)}
                    </div>
            }else{
                return <h2>No Schedule Found</h2>
            }
        }
    
    }

    clickHandlerAddNewTeam=()=>{
        this.setState({toggleAddBtn:!this.state.toggleAddBtn})
    }
    render() {

        return (
            <div className="hp-right-container">
                {this.renderRightContainer()}
               
                {this.state.toggleAddBtn ? 
                    <AddNewTeam deptId={this.props.deptId} clickHandlerAddNewTeam={this.clickHandlerAddNewTeam}/>
                    :null
                }
                
            </div>
        );
    }
}
 
export default RightSideContainer;