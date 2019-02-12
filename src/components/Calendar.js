import React from "react";
import dateFns from "date-fns";
import {connect} from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
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
import { getShiftColor, getShiftTime } from '../helper_functions/Helper';
// import DropdownItem from "react-bootstrap/DropdownItem";
import ShiftDropDown from '../components/ShiftDropDown';


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
    renderAlert:false,
    switchUpdateShifts:false,
    draggable:false,
    needUpdate:false,
    startAnimation:false,
    stagedShifts:[],
    draggedFromStage:{},
    trash:false,
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
    this.setState({
      edittedShifts:[],
      stagedShifts:[]
    });
    this.state.originalSchedules.forEach(sch=>this.props.cancelEdit(sch))
  }

  cancelEditHandler=()=>{
    this.props.switchEditHandler(true)
    this.setState({
      switchUpdateShifts:false,
      draggable:false, 
      renderAlert:false,
      trash:false,
      })
    this.resetEdittedShiftHandler()
  }

  onDragHandler=(e, shift)=>{
    e.preventDefault();
    this.setState({renderAlert:false})

    //store currently dragged shift in redux store
    this.props.setDraggedShift(shift);
  }

  onDropHandler=(e, newDate, associateId)=>{
    e.preventDefault();
    const draggedSch=this.props.schedules.find(sch=>sch===this.props.draggedShift)//
    const newSch = Object.assign({}, draggedSch)
    this.setState({originalSchedules:[...this.state.originalSchedules, newSch]})

      // newDate is the target date where the shift was dropped
      draggedSch.date=newDate
      draggedSch.associate_id=associateId
      this.setState({
        edittedShifts:[...this.state.edittedShifts, draggedSch],
        stagedShifts:[...this.state.stagedShifts].filter(shift=>shift.id!==this.state.draggedFromStage.id)
      })

      //optimistic update
      this.props.updateDraggedShift(draggedSch);
  }

  onDragOverHandler=(e)=>{
    e.preventDefault();
  }

  onEditClickHandler=()=>{
    this.props.switchEditHandler(false)
    this.setState({
      draggable:true,
      switchUpdateShifts:true,
      renderAlert:true,
      trash:true,
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
      trash:false,
    })
    
    //do pessimistic update here
    this.props.fetchUpdateEdittedShifts(token, edittedShiftsObj);

    // for shifts deletion
    if(this.state.stagedShifts.length>0){
      const scheduleIds=this.state.stagedShifts.map(sch=>sch.id)
      this.deleteWholeWeekShiftsFromBackEnd(scheduleIds);
      this.setState({stagedShifts:[]})
    }

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
                <div>
                  <span id="select-label">Jump to Schedules</span>
                  <select className="week-selection" onChange={this.props.selectDateChangeHandler}>
                    <option>Select Week</option>
                    {this.populateWeeks()}
                  </select>
                </div>

              <div className="week-nav-wrap">
                <div className="col-start">
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

                <div className="col-end">
                  <div id="next-week" className="icon" onClick={(e)=>this.checkIfUpdatedEdit(e)}>chevron_right</div>
                </div>
              </div>
              <button className="autoGen" onClick={this.handleAutoGenerateShifts}>Auto Generate Schedule</button>
              <button className="clear-sch"onClick={this.handleDeleteAllShifts}>Clear All Shifts</button>
              <div className="copy-paste">
                  <div className="copy"><Button variant='info' onClick={this.copyHandler}>Copy Schedules</Button></div>
                  <div className="paste"><Button variant='info' onClick={this.pasteHandler}>Paste Schedules</Button></div>
              </div>
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
        return <div className="days row-days">{days}</div>;
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

      handleOnClickName=(associate)=>{
        this.props.history.push('/home',
          {emp:associate}
        )
      }

      onClickShiftHandler=()=>{
        //  <ShiftDropDown/>
        console.log('hello');
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
            
            shift.push(<div className="emp-name" key={associate.id} onClick={()=>this.handleOnClickName(associate)}><span className='span-name'>{associate.name}</span></div>);
            for(let i=startOfWeek; i<=endOfWeek; i=dateFns.addDays(i,1)){
              shiftContainerCounter++;
              
              //delete these lines if needs to back
              let associateShifts=this.props.schedules.find(schedule=>schedule.date===dateFns.format(i, 'YYYY-MM-DD')
              && associate.id===schedule.associate_id
              );
              let avail=dateFns.format(i, 'dddd').toLowerCase()
              if(associateShifts){
                // console.log('associateShifts', associateShifts);
                shift.push(
                  <div key={i} className={`shift ${dateFns.format(i, 'ddd')+ associate.id} col ${getShiftColor(associateShifts.shift_id)}`}
                  draggable={this.state.draggable} onDrag={(e)=>this.onDragHandler(e, associateShifts)}
                  onClick={this.onClickShiftHandler}>
                       {getShiftTime(associateShifts.shift_id)} 
                  </div>)
              }else if(!associate[avail]){
                shift.push(<div key={i} className="shift not-available col na">Unavailable</div>)
              }else{
                shift.push(<div className={`shift col day-off day-off-${associate.id}`} key={i}
                onDrop={(e)=>this.onDropHandler(e, dateFns.format(i, 'YYYY-MM-DD'), associate.id)}
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

      checkAvailability=(dept, associateId, day)=>{
        const associate=dept.associates.find(ass=>ass.id===associateId)
        console.log(associate, day);
        const availability=associate[day];
        // console.log('availability:',availability);
        return availability;
        // this.props.fetchCheckAvailability(associateId, day.toLowerCase())
      }
      
      
      handleAutoGenerateShifts=()=>{  //right name for this function would be 'setupDataForAutoScheduling'
      
      const shiftsExist=this.getSelectedWeekSchedules();
      if(shiftsExist.length>0){
        console.log(shiftsExist);
        return alert("Shifts already exist for this week. Please clear the schedules before proceeding.")
      }

      this.setState({startAnimation:true})
      
      // <AnimationDiv/>
      
      // this.setState({switchEditShifts:true})
      this.props.switchEditHandler(true)
      let totalWeeklyShifts=0;
      let dailyShiftsAvailable=['day off'];
      let shiftsObj={};
      let newShifts=[];
      
      
      const dept=this.props.dept_asso_schedules.find(dept=>dept.id===this.props.currentUser.user.dept_manager_id)
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
              let available=this.checkAvailability(dept,randSelectedAssociate, dateFns.format(i, 'dddd').toLowerCase())
              shiftCounter[randSelectedAssociate]=shiftCounter[randSelectedAssociate] + 1 || 1;
              
              if(shiftCounter[randSelectedAssociate]<=5 && available){
                // if(available){

                //   shiftCounter[randSelectedAssociate]=shiftCounter[randSelectedAssociate]-1
                // }
                console.log('shift counter', shiftCounter);
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
              }else{shiftCounter[randSelectedAssociate]=shiftCounter[randSelectedAssociate]-1}
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

      onStageDropHandler=(e)=>{
        e.preventDefault();
        if(this.state.stagedShifts.length<6){
            const draggedSch=this.props.schedules.find(sch=>sch.id===this.props.draggedShift.id)
            const newSch = Object.assign({}, draggedSch)
            this.setState({originalSchedules:[...this.state.originalSchedules, newSch]})

            draggedSch.date='stage'
            draggedSch.associate_id=''
            this.setState({
              stagedShifts:[...this.state.stagedShifts, draggedSch]
            })
        }

      }

      onStagedDragHandler=(e,draggedShift)=>{
        e.preventDefault();

        this.setState({
          draggedFromStage:draggedShift
          // stagedShifts:[...this.state.stagedShifts].filter(shift=>shift.id!==draggedShift.id)
          // draggedFromStage:draggedShift
        })
      }
      
      render() {
        console.log('editted shifts', this.state.edittedShifts);
        return (
          <React.Fragment>
          <div className="calendar">
              {this.renderHeader()}
              {this.state.needUpdate ? <UpdateAlert resetEdittedShiftHandler={this.resetEdittedShiftHandler}
                  updateShiftsHandler={this.updateShiftsHandler}/>:null}
              {this.renderDays()}
              <div className="name-header">NAME</div>
              {/* {this.state.startAnimation ? <AnimationDiv/>:null} */}
              <div>{this.renderShift()}</div>
             
              {this.state.trash ?
                  <div className="stage-wrapper">
                    <div className="shifts-stage" onDrop={(e)=>this.onStageDropHandler(e)}
                      onDragOver={(e)=>this.onDragOverHandler(e)}>
                      <div style={{border:'1px dotted'}}><span>This is a stagging area. You could drag and drop shifts here 
                        and assign back to anyone.<br/><br/>
                        Note: Any shifts left here will be removed upon update.

                      </span></div>
                      {this.state.stagedShifts.map(shift=>
                        (<div key={shift.id} draggable className={`shift ${getShiftColor(shift.shift_id)}`}
                        onDrag={(e)=>this.onStagedDragHandler(e, shift)}>
                        {getShiftTime(shift.shift_id)}
                        </div>))
                      }
                    </div>
                  </div>
                :null
              }
              {this.state.renderAlert ?
                <Alert message={'In order to change shifts, drag and drop the shifts.'}/>:null
              }
              {this.props.switchEditShifts ?
                <React.Fragment> 
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Calendar));