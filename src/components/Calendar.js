import React from "react";
import dateFns from "date-fns";
import {connect} from 'react-redux';
import Alert from '../components/Alert';
import { 
          fetchGetSchedules, fetchGetDeptShifts, 
          fetchPostSchedules, fetchGetSchedulesOnly, 
           
        } from '../thunk/dept_asso_schedules';

import {deleteWholeWeekShifts, setDraggedShift, updateDraggedShift} from '../action/actionCreater';
import './Calendar.css';


class Calendar extends React.Component {

  state={
    totalWeeklyShifts:0,
    dailyShifts:[],//populate it with shift id for randomly picking up for auto generation
    deptAssociates:[],
    mandotoryShifts:[],
    token:'',
    edittedShifts:[],
    draggable:false,
  }

  //my handlers
  onDragHandler=(e, shift)=>{
    e.preventDefault();
    //store currently dragged shift in redux store
    this.props.setDraggedShift(shift);
  }

  onDropHandler=(e, i)=>{
    e.preventDefault();
    const draggedSch=this.props.schedules.find(sch=>sch===this.props.draggedShift)//
    // i is the target date
    draggedSch.date=i
    this.setState({edittedShifts:[...this.state.edittedShifts, draggedSch]})
    //optimistic update
    this.props.updateDraggedShift(draggedSch);
  }

  onDragOverHandler=(e)=>{
    e.preventDefault();
  }

  onEditClickHandler=()=>{
    this.setState({draggable:true})
  }

  renderHeader() {
      const dateFormat = "MM/DD/YY";
        return (
          <div>
            <div className="header row flex-middle">
              <div className="col col-start">
                <div className="icon" onClick={this.props.onClickPrevWeekHandler}>
                  chevron_left
                </div>
              </div>
              <div>
                <span>
                  {dateFns.format(dateFns.startOfWeek(this.props.currentDate, {weekStartsOn:1}), dateFormat)}
                   - {dateFns.format(dateFns.endOfWeek(this.props.currentDate, {weekStartsOn:1}), dateFormat)}
                </span>
              </div>
              <div className="col col-end" onClick={this.props.onClickNextWeekHandler}>
                <div className="icon">chevron_right</div>
              </div>
              <button className="autoGen" onClick={this.handleAutoGenerateShifts}>Auto Generate Schedule</button>
              <button className="clear-sch"onClick={this.handleDeleteAllShifts}>Clear All Shifts</button>
            </div>
          </div>
        );
        }
    

      renderDays=()=>{
        const dateFormat = "ddd";
        const days = [];
        let startDate = dateFns.startOfWeek(this.props.currentDate, {weekStartsOn:1});
        for (let i = 0; i < 7; i++) {
          days.push(
            <div className="col col-center" key={i}>
              {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
            </div>
          );
        }
        return <div className="days row">{days}</div>;
      }

    
    getShiftTime=(id)=>{
      if(id===1)
        return "8AM - 4PM"
      if(id===2)
        return "11AM - 7PM"
      if(id===3)
        return "2PM - 10PM"
    }

    getShiftColor=(shiftId)=>{
      if(shiftId===1){
        return 'open'
      }else if(shiftId===2){
        return 'mid'
      }else if(shiftId===3){
        return 'close'
      }else{
        return 'day-off'
      }
    }

    componentDidMount(){
      let token = localStorage.getItem("token");
      this.setState({token:token})
      console.log('calender component did mount token:', token);
      if(token){
        this.props.fetchGetSchedules(token);
        this.props.fetchGetSchedulesOnly(token);
        this.props.fetchGetDeptShifts(token);
      }
    }

    deleteWholeWeekShiftsFromBackEnd=(idsToBeDeleted)=>{
              fetch(`http://localhost:3000/api/v1/schedules/${idsToBeDeleted}`,{
                method:'DELETE', 
                headers:{
                "Content-Type":"application/json",
                'Authorization': this.state.token
                }
              })
        }
        
     
    renderShift=()=>{
      let shift=[];
      let row=[];
      let shiftContainerCounter=0;
      const startOfWeek = dateFns.startOfWeek(this.props.currentDate, {weekStartsOn:1})
      const endOfWeek = dateFns.endOfWeek(this.props.currentDate, {weekStartsOn:1})
      const dept=this.props.dept_asso_schedules.find(dept=>dept.id===this.props.currentUser.user.dept_manager_id)//hard code 1, 1 is department id
      if(dept){
        dept.associates.forEach(associate=>{
          
            shift.push(<div className="emp-name" key={associate.id}>{associate.name}</div>);
            for(let i=startOfWeek; i<=endOfWeek; i=dateFns.addDays(i,1)){
              shiftContainerCounter++;

              //delete these lines if needs to back
              let associateShifts=this.props.schedules.find(schedule=>schedule.date===dateFns.format(i, 'YYYY-MM-DD')
                && associate.id===schedule.associate_id
              );
              if(associateShifts){
                shift.push(
                  <div key={i} className={`shift col ${this.getShiftColor(associateShifts.shift_id)}`}
                       onClick={()=>console.log(associateShifts)} 
                       draggable={this.state.draggable} onDrag={(e)=>this.onDragHandler(e, associateShifts)}
                       >
                       {this.getShiftTime(associateShifts.shift_id)} 
                  </div>)
              }else{
                shift.push(<div className="shift col day-off" key={i}
                onDrop={(e)=>this.onDropHandler(e, dateFns.format(i, 'YYYY-MM-DD'))}
                onDragOver={(e)=>this.onDragOverHandler(e)}
                >
                
                No Shift Assigned</div>)
              }
              
            }
            row.push(<div className="rows" key={shiftContainerCounter}>{shift}</div>)
            shift=[];
          })
      }
      return row;
    }

    getRandomAssociateId=(associatesIds)=>{
      
      if(associatesIds.length===1){
        return associatesIds[0]
      }else{
      const pickedAssociateId=associatesIds.splice(Math.floor(Math.random()*associatesIds.length), 1);
      return pickedAssociateId[0];
      }
    }


    getRandomShiftFromExtraShifts=(availableShifts)=>{
      if(availableShifts.length===1){
        return availableShifts[0]
      }else{
      const pickedShift=availableShifts.splice(Math.floor(Math.random()*availableShifts.length), 1);
      return pickedShift[0]
      }
    }

    getRandomShift=(mandotoryShift, cloneDailyShift )=>{
      const newArr= mandotoryShift;
      const pickedShift=newArr.splice(Math.floor(Math.random()*newArr.length), 1);


      for( let i = 0; i < cloneDailyShift.length-1; i++){ 
        if ( cloneDailyShift[i] === pickedShift[0]) {
          cloneDailyShift.splice(i, 1); 
        }
      }
        return pickedShift[0]
     
    }

    calculateMandotoryShifts=()=>{
      if(this.state.deptAssociates.length>3){
        return [1,2,3]
      }else if(this.state.deptAssociates.length<=3){
        return [1,3]
      }
    }


    handleAutoGenerateShifts=()=>{  //right name for this function would be 'setupDataForAutoScheduling'
      let totalWeeklyShifts=0;
      let dailyShiftsAvailable=['day off'];
      let shiftsObj={};
      let newShifts=[];
      
      
      const dept=this.props.dept_asso_schedules.find(dept=>dept.id===this.props.currentUser.user.dept_manager_id)//hard code 1, 1 is department id
      const deptAssociatesId=dept.associates.map(associate=>associate.id)
      const all_dept_shifts=this.props.dept_shifts;
      const deptShifts=all_dept_shifts.filter(ds=>ds.department_id===this.props.currentUser.user.dept_manager_id)

      
      deptShifts.forEach(shift=>{
        for(let i=1;i<=shift.no_of_shift;i++){
          dailyShiftsAvailable.push(shift.shift_id) //populating dailyShifts with shift_id to be used at 
          //remaining shift left for each day.
        }
        totalWeeklyShifts=totalWeeklyShifts+shift.no_of_shift;// total weekly shifts 
      })
      totalWeeklyShifts=totalWeeklyShifts*7//total shifts for a week

      this.setState({
        dailyShifts:dailyShiftsAvailable,
        totalWeeklyShifts:totalWeeklyShifts,
        deptAssociates:deptAssociatesId,
        mandotoryShifts:this.calculateMandotoryShifts(),
      },()=>{
            const startOfWeek = dateFns.startOfWeek(this.props.currentDate, {weekStartsOn:1})
            const endOfWeek = dateFns.endOfWeek(this.props.currentDate, {weekStartsOn:1})
            let shiftCounter={};//store number of shifts of assigned for each associate
            if(dept){
             
              for(let i=startOfWeek; i<=endOfWeek; i=dateFns.addDays(i,1)){
                  let cloneMandotoryShift=[...this.state.mandotoryShifts];
                  let cloneOfDailyShift = [...this.state.dailyShifts];
                  let cloneDailyAssociates = [...this.state.deptAssociates];

                  for (let j=1; j<=this.state.deptAssociates.length; j++){
                    let randSelectedAssociate = this.getRandomAssociateId(cloneDailyAssociates);
                    shiftCounter[randSelectedAssociate]=shiftCounter[randSelectedAssociate] + 1 || 1;
                    
                    if(shiftCounter[randSelectedAssociate]<=5){
                      if(cloneMandotoryShift.length===0 && cloneDailyAssociates.length>0){
                        let randShift=this.getRandomShiftFromExtraShifts(cloneOfDailyShift)
                        if(randShift!=='day off'){
                            newShifts.push({
                              date:dateFns.format(i, 'YYYY-MM-DD'),
                              associate_id:randSelectedAssociate,
                              department_id:dept.id,
                              shift_id:randShift
                            })
                        }else{
                          shiftCounter[randSelectedAssociate]=shiftCounter[randSelectedAssociate]-1
                        }
                      }else{

                        newShifts.push({
                            date:dateFns.format(i, 'YYYY-MM-DD'),
                            associate_id:randSelectedAssociate,
                            department_id:dept.id,
                            shift_id:this.getRandomShift(cloneMandotoryShift, cloneOfDailyShift)
                        })
                      }
                    }
                  }
              }
              shiftsObj.schedules=newShifts
              this.props.fetchPostSchedules(this.state.token, shiftsObj); 
            }
        });
    }
    
    handleDeleteAllShifts=()=>{
      let idsToBeDeleted=[]
      const startOfWeek = dateFns.startOfWeek(this.props.currentDate, {weekStartsOn:1})
      const endOfWeek = dateFns.endOfWeek(this.props.currentDate, {weekStartsOn:1})
      const remainingShiftsAfterDeletion=this.props.schedules.filter(
        schedule=>{
          if((dateFns.parse(schedule.date) >= startOfWeek && 
          dateFns.parse(schedule.date) <= endOfWeek) && 
          schedule.department_id===this.props.currentUser.user.dept_manager_id){

            idsToBeDeleted.push(schedule.id)
          }
          return (!(dateFns.parse(schedule.date) >= startOfWeek && 
                dateFns.parse(schedule.date) <= endOfWeek) && 
                schedule.department_id===this.props.currentUser.user.dept_manager_id)
              })
      this.deleteWholeWeekShiftsFromBackEnd(idsToBeDeleted);//for pessimistic operation
      this.props.deleteWholeWeekShifts(remainingShiftsAfterDeletion)//for optimistic rendering, this will update redux store

    }
    
    render() {
    return (
      <React.Fragment>
          <div className="calendar">
              {this.renderHeader()}
              {this.renderDays()}
              <div className="name-header">Name</div>
              <div>{this.renderShift()}</div>
              {this.state.draggable ? <Alert/><button>Update Shifts</button> : null} 
              <button className="edit-schedule" onClick={this.onEditClickHandler}>Edit Shifts</button>           
          </div>
          
        </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dept_asso_schedules:state.dept_asso_schedule,
    dept_shifts:state.dept_shifts,
    schedules:state.schedules,
    currentUser: state.currentLogInUser,
    draggedShift:state.draggedShift,
  }
}
 

const mapDispatchToProps=(dispatch)=>{
  return {
    fetchGetSchedules:(token)=>dispatch(fetchGetSchedules(token)),
    fetchGetSchedulesOnly:(token)=>dispatch(fetchGetSchedulesOnly(token)),
    fetchGetDeptShifts:(token)=>dispatch(fetchGetDeptShifts(token)),
    fetchPostSchedules:(token, schedule)=>dispatch(fetchPostSchedules(token, schedule)),
    deleteWholeWeekShifts:(schedules)=>dispatch(deleteWholeWeekShifts(schedules)),
    setDraggedShift:(shift)=>dispatch(setDraggedShift(shift)),
    updateDraggedShift:(newShift)=>dispatch(updateDraggedShift(newShift)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);