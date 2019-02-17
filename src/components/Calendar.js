import React from "react";
import dateFns from "date-fns";
import {connect} from 'react-redux';
import { withRouter} from 'react-router-dom';
import Alert from '../components/Alert';
import UpdateAlert from '../components/UpdateAlert';
import { 
          fetchGetSchedules, fetchGetDeptShifts, 
          fetchPostSchedules, fetchGetSchedulesOnly,
          fetchUpdateEdittedShifts, 
           
        } from '../thunk/dept_asso_schedules';

import {deleteWholeWeekShifts, updateDraggedShift, cancelEdit} from '../action/actionCreater';
import './Calendar.css';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { getShiftColor, getShiftTime } from '../helper_functions/Helper';
import pointer from '../img/pointer.jpeg';
// import plus from '../img/plus.png';


class Calendar extends React.Component {

  state={
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
    stagedShifts:[],
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
    //console.log("clone", cloneCopiedWeek);
    cloneCopiedWeek.forEach(schedule=>{
      const parseDate=dateFns.parse(schedule.date)//parse schedule date to add days in next step
      const addDays=dateFns.addDays(parseDate,daysDiff)
      // //console.log('updatedSch', updatedSch);
      delete schedule.id;//remove id for post method
      schedule.date=dateFns.format(addDays, 'YYYY-MM-DD')//convert to string to match database type
      newShifts.push(schedule)
    })
    shiftsObj.schedules=newShifts
    this.props.fetchPostSchedules(this.state.token, shiftsObj); 
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

  // onDragHandler=(e, shift)=>{
  //   e.preventDefault();

  //   this.setState({renderAlert:false})
    
  //   //store currently dragged shift in redux store
  //   this.props.setDraggedShift(shift);
  // }

  // test codes starts
  onDragStart=(e, shift)=>{
    this.setState({renderAlert:false})
    e.dataTransfer.setData('text/plain', JSON.stringify(shift))
    e.dataTransfer.effectAllowed='copy'
      // console.log(e.dataTransfer.get);
  }
  
  handleDragEnter=(e)=>{
    if(e.target.id ==='unassigned'){
      e.target.style.opacity='0.3'
      // e.target.style.backgroundImage=`url(${plus})`
      
    }
  }
  //test codes end

  onDropHandler=(e, newDate, associateId)=>{
    e.preventDefault();
    e.target.style.opacity='1'
    //test start
    const draggedShift=JSON.parse(e.dataTransfer.getData('text/plain'))
    console.log('dataTransfer',draggedShift);
    //test end
    // const draggedSch=this.props.schedules.find(sch=>sch===this.props.draggedShift)//
    const newSch = Object.assign({}, draggedShift) // creates new object not referrenced to draggedSch
    this.setState({originalSchedules:[...this.state.originalSchedules, newSch]})

      // newDate is the target date where the shift was dropped
      draggedShift.date=newDate
      draggedShift.associate_id=associateId
      this.setState({
        edittedShifts:[...this.state.edittedShifts, draggedShift],
        stagedShifts:[...this.state.stagedShifts].filter(shift=>shift.id!==draggedShift.id)
      })

      //optimistic update
      this.props.updateDraggedShift(draggedShift);
  }

  onDragOverHandler=(e)=>{
    e.preventDefault();
    e.dataTransfer.dropEffect='copy'
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
                  <div style={{textAlign:'center'}}> Week showing</div>
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
            </div>
          </div>
        );
      }
      
      
      renderDays=()=>{
        const dateFormat = "ddd";
        const days = [<div className="name-header">NAME</div>];
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
              
              let associateShifts=this.props.schedules.find(schedule=>schedule.date===dateFns.format(i, 'YYYY-MM-DD')
              && associate.id===schedule.associate_id
              );
              let avail=dateFns.format(i, 'dddd').toLowerCase()
              if(associateShifts){
                shift.push(
                  <div key={i} className={`shift ${dateFns.format(i, 'ddd')+ associate.id} col ${getShiftColor(associateShifts.shift_id)}`}
                  draggable={this.state.draggable} onDragStart={(e)=>this.onDragStart(e, associateShifts)} 
                  onClick={this.onClickShiftHandler}>
                  {/* onDrag={(e)=>this.onDragHandler(e, associateShifts)} */}
                       {getShiftTime(associateShifts.shift_id)} 
                  </div>)
              }else if(!associate[avail]){
                shift.push(<div key={i} className="shift not-available col na">Not available</div>)
              }else{
                shift.push(<div id='unassigned' className={`shift col day-off day-off-${associate.id}`} key={i}
                onDrop={(e)=>this.onDropHandler(e, dateFns.format(i, 'YYYY-MM-DD'), associate.id)}
                onDragEnter={this.handleDragEnter}
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
        const availability=associate[day];
        return availability;
      }
      
      
      handleAutoGenerateShifts=()=>{  //right name for this function would be 'setupDataForAutoScheduling'
      
        const shiftsExist=this.getSelectedWeekSchedules();
        if(shiftsExist.length>0){
          return alert("Shifts already exist for this week. Please clear the schedules before proceeding.")
        }

        this.props.switchEditHandler(true)
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
        })
        
        this.setState({
          dailyShifts:dailyShiftsAvailable,
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
        const draggedShift=JSON.parse(e.dataTransfer.getData('text/plain'))
        if(this.state.stagedShifts.length<6){
          const duplicateShift=this.state.stagedShifts.filter(shft=>shft.id===draggedShift.id)
            if(duplicateShift.length<1){
            const draggedSch=this.props.schedules.find(sch=>sch.id===draggedShift.id)
            const newSch = Object.assign({}, draggedSch)
            this.setState({originalSchedules:[...this.state.originalSchedules, newSch]})

            draggedSch.date='stage'
            draggedSch.associate_id=''
            this.setState({
              stagedShifts:[...this.state.stagedShifts, draggedSch]
            })
          }
        }

      }

      onStagedDragHandler=(e,draggedShift)=>{
        // e.preventDefault();
        e.dataTransfer.setData('text/plain', JSON.stringify(draggedShift))
        // this.props.setDraggedShift(draggedShift);
      }
      
      render() {
        return (
          <React.Fragment>
          <div className="calendar">
              {this.renderHeader()}
              {this.state.needUpdate ? <UpdateAlert resetEdittedShiftHandler={this.resetEdittedShiftHandler}
                  updateShiftsHandler={this.updateShiftsHandler}/>:null}
              {this.renderDays()}
              {/* <div className="name-header">NAME</div> */}
              <div className='all-shifts'>{this.renderShift()}</div>
              <div className='bottom-nav'>
                  {this.state.trash ?
                      <>
                      <div style={{border:'1px dotted', marginTop:'10px',display:'inline-block', width:'20%', marginLeft:'10%'}}>
                      <span>This is a stagging area. You could drag and drop shifts here 
                        and assign back to anyone.<br/><br/>
                        Note: Any shifts left here will be removed upon update.

                        </span>
                      </div>
                      <div style={{display:'inline-block', marginBottom:'50px'}}><img src={pointer} width={'100px'} height={'100px'} alt='hand'/></div>
                      <div className="stage-wrapper">
                        <div className="shifts-stage" onDrop={(e)=>this.onStageDropHandler(e)}
                          onDragOver={(e)=>this.onDragOverHandler(e)}>
                          
                          {this.state.stagedShifts.map(shift=>
                            (<div key={shift.id} draggable className={`shift ${getShiftColor(shift.shift_id)}`}
                            onDragStart={(e)=>this.onStagedDragHandler(e, shift)}>
                            {getShiftTime(shift.shift_id)}
                            </div>))
                          }
                        </div>
                      </div>
                      </>
                    :null
                  }
              
              {this.state.renderAlert ?
                <Alert message={'In order to change shifts, drag and drop the shifts.'}/>:null
              }
              {this.props.switchEditShifts && this.getSelectedWeekSchedules().length>0 ?
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
  }
}
 

const mapDispatchToProps=(dispatch)=>{
  return {
    fetchGetSchedules:(token)=>dispatch(fetchGetSchedules(token)),
    fetchGetSchedulesOnly:(token)=>dispatch(fetchGetSchedulesOnly(token)),
    fetchGetDeptShifts:(token)=>dispatch(fetchGetDeptShifts(token)),
    fetchPostSchedules:(token, schedule)=>dispatch(fetchPostSchedules(token, schedule)),
    deleteWholeWeekShifts:(schedules)=>dispatch(deleteWholeWeekShifts(schedules)),
    updateDraggedShift:(newShift)=>dispatch(updateDraggedShift(newShift)),
    fetchUpdateEdittedShifts:(token, edittedShifts)=>dispatch(fetchUpdateEdittedShifts(token, edittedShifts)),
    cancelEdit:(sch)=>dispatch(cancelEdit(sch)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Calendar));