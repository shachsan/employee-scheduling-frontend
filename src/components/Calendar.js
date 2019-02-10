import React from "react";
import dateFns from "date-fns";
import {connect} from 'react-redux';
import Alert from '../components/Alert';
import UpdateAlert from '../components/UpdateAlert';
import { 
          fetchGetSchedules, fetchGetDeptShifts, 
          fetchPostSchedules, fetchGetSchedulesOnly,
          fetchUpdateEdittedShifts, 
           
        } from '../thunk/dept_asso_schedules';

import {deleteWholeWeekShifts, setDraggedShift, updateDraggedShift, cancelEdit} from '../action/actionCreater';
import './Calendar.css';
import { Button, ButtonToolbar } from 'react-bootstrap';
import AnimationDiv from '../components/AnimationDiv';


class Calendar extends React.Component {


  state={
    totalWeeklyShifts:0,
    dailyShifts:[],//populate it with shift id for randomly picking up for auto generation
    deptAssociates:[],
    mandotoryShifts:[],
    token:'',
    selectedWeekShifts:[],
    copiedWeek:'',
    edittedShifts:[],
    originalSchedules:[],
    switchAutoGen:true,
    switchEditShifts:false,
    switchUpdateShifts:false,
    draggable:false,
    needUpdate:false,
    startAnimation:false,
    // shiftsAnimate:'animate',
  }


  getSelectedWeekSchedules=()=>{
    const selectedWeekSchedules = this.props.schedules.filter(s=>dateFns.parse(s.date)>=dateFns.startOfWeek(this.props.currentDate, {weekStartsOn:1}) && 
    dateFns.parse(s.date)<=dateFns.endOfWeek(this.props.currentDate, {weekStartsOn:1}))
    return selectedWeekSchedules;
  }

  //my handlers


  copyHandler=()=>{
    this.setState({
      selectedWeekShifts:this.getSelectedWeekSchedules(),
      copiedWeek:dateFns.startOfWeek(this.props.currentDate),
    })

    console.log('copied',this.state.selectedWeekShifts)
  }

  pasteHandler=()=>{
    let newShifts=[]
    let shiftsObj={}
    const selectedWeekSchedules=this.getSelectedWeekSchedules();
    //check if the selectedWeekSchedules in state is not empty
    if(this.state.selectedWeekShifts.length<1)
      return alert("No schedules have been copied, please copy the source schedules.")
    
    //check if shifts already exist on the selected week
    if(selectedWeekSchedules.length>0)
      return alert("Shifts already exist for this week. Please choose empty schedules or clear these shifts")
    
    //if not update redux store schedules with the selectedWeekSchedules from the local state
    const daysDiff=dateFns.differenceInCalendarDays(dateFns.startOfWeek(this.props.currentDate), this.state.copiedWeek)
    const cloneCopiedWeek=JSON.parse(JSON.stringify(this.state.selectedWeekShifts))//this makes a copy of an object without referencing same object
    console.log("clone", cloneCopiedWeek);
    cloneCopiedWeek.forEach(schedule=>{
      const parseDate=dateFns.parse(schedule.date)//parse schedule date to add days in next step
      const addDays=dateFns.addDays(parseDate,daysDiff)
      // console.log('updatedSch', updatedSch);
      delete schedule.id;//remove id for post method
      schedule.date=dateFns.format(addDays, 'YYYY-MM-DD')//convert to string to match database type
      newShifts.push(schedule)
    })
    console.log("state",this.state.selectedWeekShifts);
    // console.log('selected original schedules', this.state.selectedWeekShifts);
    // console.log('updated schedules', newShifts);
    shiftsObj.schedules=newShifts
    this.props.fetchPostSchedules(this.state.token, shiftsObj); 
    

    // const newSchedules=[...this.state.selectedWeekShifts,]


  }

  resetEdittedShiftHandler=()=>{
    this.setState({edittedShifts:[]});
    this.state.originalSchedules.forEach(sch=>this.props.cancelEdit(sch))
  }

  cancelEditHandler=()=>{
    this.setState({
      switchUpdateShifts:false,
      draggable:false, 
      switchEditShifts:true})
  }

  onDragHandler=(e, shift)=>{
    e.preventDefault();

    //store currently dragged shift in redux store
    this.props.setDraggedShift(shift);
  }

  onDropHandler=(e, newDate)=>{
    e.preventDefault();
    const draggedSch=this.props.schedules.find(sch=>sch===this.props.draggedShift)//
    const newSch = Object.assign({}, draggedSch)
    this.setState({originalSchedules:[...this.state.originalSchedules, newSch]})

      // newDate is the target date where the shift was dropped
      draggedSch.date=newDate
      this.setState({edittedShifts:[...this.state.edittedShifts, draggedSch]})

      //optimistic update
      this.props.updateDraggedShift(draggedSch);
  }

  onDragOverHandler=(e)=>{
    e.preventDefault();
  }

  onEditClickHandler=()=>{
    
    this.setState({
      draggable:true,
      switchEditShifts:false,
      switchUpdateShifts:true
    })
  }

  updateShiftsHandler=()=>{
    const edittedShiftsObj={};
    let token=localStorage.getItem('token')
    edittedShiftsObj.schedules=this.state.edittedShifts;
    this.setState({
      switchUpdateShifts:false,
      edittedShifts:[],
      originalSchedules:[],
    })
    
    //do pessimistic update here
    this.props.fetchUpdateEdittedShifts(token, edittedShiftsObj);
    console.log('edittedshifts', edittedShiftsObj);
  }

  checkIfUpdatedEdit=(e)=>{
    if(this.state.edittedShifts.length>0){
      this.setState({needUpdate:true})
      // alert("Please update the changes made to the shifts")
    }else if(e.target.id==='prev-week'){
      this.props.onClickPrevWeekHandler();
    }else if(e.target.id==='next-week'){
      this.props.onClickNextWeekHandler();
    }
  }

  populateWeeks=()=>{
    let allSchedules=this.props.schedules;
    let weeklyDate=[];
    let dateStart=allSchedules[0]
    let dateEnd=allSchedules[allSchedules.length-1]
    if(dateStart && dateEnd){
      for(let i=dateFns.parse(dateStart.date, {weekStartsOn:1});i<=dateFns.parse(dateEnd.date, {weekStartsOn:1});i=dateFns.addDays(i,7)){
        weeklyDate.push(<option key={i} value={i}>{dateFns.format(i,'MM-DD-YYYY')}</option>)
      }
    }
    return weeklyDate;
  }

  

  renderHeader() {
      const dateFormat = "MM/DD/YY";
        return (
          <div className="header-wrap">
            <div className="header row flex-middle schedule-page">
              <div className="col col-start">
              <span id="select-label">Jump to Schedules</span>
              <select className="week-selection" onChange={this.props.selectDateChangeHandler}>
                <option>Select Week</option>
                {this.populateWeeks()}
              </select>
                <div id="prev-week" className="icon" onClick={(e)=>this.checkIfUpdatedEdit(e)}>
                  chevron_left
                </div>
              </div>
              <div className="center-week">
                <span>
                  {dateFns.format(dateFns.startOfWeek(this.props.currentDate, {weekStartsOn:1}), dateFormat)}
                   - {dateFns.format(dateFns.endOfWeek(this.props.currentDate, {weekStartsOn:1}), dateFormat)}
                </span>
              </div>
              <div className="col col-end">
                <div id="next-week" className="icon" onClick={(e)=>this.checkIfUpdatedEdit(e)}>chevron_right</div>
              </div>
              <button className="autoGen" onClick={this.handleAutoGenerateShifts}>Auto Generate Schedule</button>
              <button className="clear-sch"onClick={this.handleDeleteAllShifts}>Clear All Shifts</button>
              {/* <div><button>Copy</button></div> */}
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
          return 'closed'
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
                  <div key={i} className={`shift ${dateFns.format(i, 'ddd')+ associate.id} 
                  col ${this.getShiftColor(associateShifts.shift_id)}`}
                  draggable={this.state.draggable} onDrag={(e)=>this.onDragHandler(e, associateShifts)}
                  >
                       {this.getShiftTime(associateShifts.shift_id)} 
                  </div>)
              }else{
                shift.push(<div className={`shift col day-off day-off-${associate.id}`} key={i}
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
      
      const shiftsExist=this.getSelectedWeekSchedules();
      if(shiftsExist.length>0){
        console.log(shiftsExist);
        return alert("Shifts already exist for this week. Please clear the schedules before proceeding.")
      }

      // this.setState({shiftsAnimate:''})
      
      // <AnimationDiv/>
      
      this.setState({switchEditShifts:true})
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
                    // const ani=()=><AnimationDiv/>
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
        console.log(this.state.shiftsAnimate);
        return (
          <React.Fragment>
          <div className="calendar">
              {this.renderHeader()}
              {this.state.needUpdate ? <UpdateAlert resetEdittedShiftHandler={this.resetEdittedShiftHandler}
                  updateShiftsHandler={this.updateShiftsHandler}/>:null}
              {this.renderDays()}
              <div className="name-header">Name</div>
              {/* {this.state.startAnimation ? <AnimationDiv/>:null} */}
              <div>{this.renderShift()}</div>
              <div className="copy-paste">
                  <div className="copy"><Button variant='info' onClick={this.copyHandler}>Copy Schedules</Button></div>
                  <div className="paste"><Button variant='info' onClick={this.pasteHandler}>Paste Schedules</Button></div>
              </div>
              
              {this.state.switchEditShifts ?
                <React.Fragment> 
                  <Alert/>
                  <Button className="edit-update-cancel-btn"variant="primary" onClick={this.onEditClickHandler}>Edit Shifts</Button>           
                </React.Fragment>
                :null}
                {this.state.switchUpdateShifts ? 
                <ButtonToolbar className='update-cancel-toolbar'>
                  <Button className="edit-update-cancel-btn" variant="success"onClick={this.updateShiftsHandler}>Update Shifts</Button>
                  <Button className="edit-update-cancel-btn" variant="danger" onClick={this.cancelEditHandler}>Cancel</Button>
                </ButtonToolbar>
                :null} 
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
    fetchUpdateEdittedShifts:(token, edittedShifts)=>dispatch(fetchUpdateEdittedShifts(token, edittedShifts)),
    cancelEdit:(sch)=>dispatch(cancelEdit(sch)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);