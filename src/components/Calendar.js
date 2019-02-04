import React from "react";
import dateFns from "date-fns";
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import { 
          fetchGetSchedules, fetchGetDeptShifts, 
          fetchPostSchedules, fetchGetSchedulesOnly, 
           
        } from '../thunk/dept_asso_schedules';

import {deleteWholeWeekShifts} from '../action/actionCreater';




class Calendar extends React.Component {

  state={
    currentDate:new Date(),
    dept:1,//this needs to come from Auth
    totalWeeklyShifts:0,
    dailyShifts:[],//populate it with shift id for randomly picking up for auto generation
    deptAssociates:[],
    mandotoryShifts:[],
    token:'',
  }


  nextWeek = () => {
    this.setState({
      currentDate: dateFns.addWeeks(dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1}), 1)
    });
  };
  prevWeek = () => {
    this.setState({
      currentDate: dateFns.subWeeks(dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1}), 1)
    });
  };

 

    renderHeader() {
        const dateFormat = "MM/DD/YY";
        return (
          <div>
            <div className="header row flex-middle">
              <div className="col col-start">
                <div className="icon" onClick={this.prevWeek}>
                  chevron_left
                </div>
              </div>
              <div>
                <span>
                  {dateFns.format(dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1}), dateFormat)}
                   - {dateFns.format(dateFns.endOfWeek(this.state.currentDate, {weekStartsOn:1}), dateFormat)}
                </span>
              </div>
              <div className="col col-end" onClick={this.nextWeek}>
                <div className="icon">chevron_right</div>
              </div>
              <button onClick={this.handleAutoGenerateShifts}>Auto Generate Schedule</button>
              <button onClick={this.handleDeleteAllShifts}>Clear All Shifts</button>
            </div>
          </div>
        );
        }
    

      renderDays=()=>{
        const dateFormat = "ddd";
        const days = [];
        let startDate = dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1});
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
        // this.props.fetchGetSchedules();
        this.props.fetchGetSchedulesOnly(token);
        this.props.fetchGetDeptShifts(token);
      }
    }

    deleteWholeWeekShiftsFromBackEnd=(idsToBeDeleted)=>{
      // console.log(idsToBeDeleted);

        // if(prevProps.schedules.length>this.props.schedules.length){
          // let idsToBeDeleted=[];/
          // prevProps.schedules.forEach(schedule=>{
          //   if(!this.props.schedules.includes(schedule)){
          //     idsToBeDeleted.push(schedule.id)
          //   }
          // })
          // if(idsToBeDeleted.length!==0){
            // console.log('run component did update and idsToBeDeleted', idsToBeDeleted);
              fetch(`http://localhost:3000/api/v1/schedules/${idsToBeDeleted}`,{
                method:'DELETE', 
                headers:{
                "Content-Type":"application/json",
                'Authorization': this.state.token
                }
              })
          // // }
        }
        
      // }

    // componentDidUpdate(prevProps, prevState){
    //   if(prevProps.schedules.length>this.props.schedules.length){
    //     let idsToBeDeleted=[];
    //     prevProps.schedules.forEach(schedule=>{
    //       if(!this.props.schedules.includes(schedule)){
    //         idsToBeDeleted.push(schedule.id)
    //       }
    //     })
    //     if(idsToBeDeleted.length!==0){
    //       console.log('run component did update and idsToBeDeleted', idsToBeDeleted);
    //         fetch(`http://localhost:3000/api/v1/schedules/${idsToBeDeleted}`,{
    //           method:'DELETE'})
    //     }
    //   }
      
    // }

    renderShift=()=>{
      let shift=[];
      let row=[];
      let shiftContainerCounter=0;
      const startOfWeek = dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1})
      const endOfWeek = dateFns.endOfWeek(this.state.currentDate, {weekStartsOn:1})
      const dept=this.props.dept_asso_schedules.find(dept=>dept.id===this.state.dept)//hard code 1, 1 is department id
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
                shift.push(<div className={`shift ${this.getShiftColor(associateShifts.shift_id)}`} key={i}>{this.getShiftTime(associateShifts.shift_id)}</div>)
              }else{
                shift.push(<div className="shift day-off" key={i}>No Shift Assigned</div>)
              }
              //end

              // console.log('associate Shifts',associateShifts);


              /* working code, uncomment to do back
              let shiftExist=associate.schedules.find(schedule=>schedule.date===dateFns.format(i, 'YYYY-MM-DD'));
              if(shiftExist){
                  shift.push(<div className="shift" key={i}>{this.getShiftTime(shiftExist.shift_id)}</div>)
                }else{
                  shift.push(<div className="shift" key={i}>No Shift Assigned</div>)
                }
                */
            }
            row.push(<div className="shift-container" key={shiftContainerCounter}>{shift}</div>)
            shift=[];
          })
      }
      return row;
    }

    getRandomAssociateId=(associatesIds)=>{
      
      // const ids=associates.map(associate=>associate.id)
      if(associatesIds.length===1){
        return associatesIds[0]
      }else{
      const pickedAssociateId=associatesIds.splice(Math.floor(Math.random()*associatesIds.length), 1);
      return pickedAssociateId[0];
      }
    }

    // removeSelectedAssociates=(toBeRemoved, cloneDailyAssociates)=>{
    //   console.log('to be removed', toBeRemoved);
    //   console.log('cloneDailyAssociates', cloneDailyAssociates);
    //   for( let i = 0; i < cloneDailyAssociates.length-1; i++){ 
    //     if ( cloneDailyAssociates[i] === toBeRemoved) {
    //       cloneDailyAssociates.splice(i, 1); 
    //       return cloneDailyAssociates;
    //     }
    //   }
    // }

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
      // console.log('picked shift',pickedShift[0]);
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
      // debugger;
      let totalWeeklyShifts=0;
      let dailyShiftsAvailable=['day off'];
      let shiftsObj={};
      let newShifts=[];
      
      
      const dept=this.props.dept_asso_schedules.find(dept=>dept.id===this.state.dept)//hard code 1, 1 is department id
      const deptAssociatesId=dept.associates.map(associate=>associate.id)
      const all_dept_shifts=this.props.dept_shifts;
      const deptShifts=all_dept_shifts.filter(ds=>ds.department_id===this.state.dept)
      // console.log('available shift',deptShifts);

      
      deptShifts.forEach(shift=>{
        for(let i=1;i<=shift.no_of_shift;i++){
          dailyShiftsAvailable.push(shift.shift_id) //populating dailyShifts with shift_id to be used at 
          //remaining shift left for each day.
        }
        totalWeeklyShifts=totalWeeklyShifts+shift.no_of_shift;// total weekly shifts 
      })
      totalWeeklyShifts=totalWeeklyShifts*7//total shifts for a week
      // console.log('dailyShiftsAvailable', dailyShiftsAvailable);

      this.setState({
        dailyShifts:dailyShiftsAvailable,
        totalWeeklyShifts:totalWeeklyShifts,
        deptAssociates:deptAssociatesId,
        mandotoryShifts:this.calculateMandotoryShifts(),
      },()=>{
          // console.log(this.state.deptAssociates);
            const startOfWeek = dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1})
            const endOfWeek = dateFns.endOfWeek(this.state.currentDate, {weekStartsOn:1})
            let shiftCounter={};//store number of shifts of assigned for each associate
            if(dept){
             
              for(let i=startOfWeek; i<=endOfWeek; i=dateFns.addDays(i,1)){
                  let cloneMandotoryShift=[...this.state.mandotoryShifts];
                  let cloneOfDailyShift = [...this.state.dailyShifts];
                  let cloneDailyAssociates = [...this.state.deptAssociates];
                  // let totalAssociate=cloneDailyAssociates.length;
                  // console.log('cloneDailyAssociates',cloneDailyAssociates);
                  // console.log('cloneMandotoryShift',cloneMandotoryShift);
                  // console.log('cloneOfDailyShift',cloneOfDailyShift);
                  for (let j=1; j<=this.state.deptAssociates.length; j++){
                    
                    // console.log('day-',i,'j-',j,'cloneDailyAssociates',cloneDailyAssociates);
                    let randSelectedAssociate = this.getRandomAssociateId(cloneDailyAssociates);
                    // if(cloneMandotoryShift.length===0 && cloneDailyAssociates.length>0){
                    //   // let randShift=this.getRandomShiftFromExtraShifts(cloneOfDailyShift)
                    // }
                    // cloneDailyAssociates=this.removeSelectedAssociates(randSelectedAssociate, cloneDailyAssociates)
                    // console.log('day-',i,'j-',j,'randSelectedAssociate',randSelectedAssociate);
                    shiftCounter[randSelectedAssociate]=shiftCounter[randSelectedAssociate] + 1 || 1;
                    console.log('shiftCounter', shiftCounter);
                    
                    if(shiftCounter[randSelectedAssociate]<=5){
                      console.log('no of shifts of currently selected associate:',shiftCounter[randSelectedAssociate]);
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
              //*****Uncomment below code for autogeneration. commented just for testing other feature */
              shiftsObj.schedules=newShifts
              
              this.props.fetchPostSchedules(this.state.token, shiftsObj); 
            }
            // console.log('newShifts',newShifts);
        });
    }
    
    handleDeleteAllShifts=()=>{
      let idsToBeDeleted=[]
      const startOfWeek = dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1})
      const endOfWeek = dateFns.endOfWeek(this.state.currentDate, {weekStartsOn:1})
      // console.log(this.props.schedules);
      const remainingShiftsAfterDeletion=this.props.schedules.filter(
        schedule=>{
          if((dateFns.parse(schedule.date) >= startOfWeek && 
          dateFns.parse(schedule.date) <= endOfWeek) && 
          schedule.department_id===this.state.dept){

            idsToBeDeleted.push(schedule.id)
          }
          return (!(dateFns.parse(schedule.date) >= startOfWeek && 
                dateFns.parse(schedule.date) <= endOfWeek) && 
                schedule.department_id===this.state.dept)
              })
      //this.state.dept needs to be store in redux store and assigned the dept based on the dept managers logs in
      // // console.log(remainingShiftsAfterDeletion);
      // this.setState({
      //   idsToBeDeleted:idsToBeDeleted,
      // })
      this.deleteWholeWeekShiftsFromBackEnd(idsToBeDeleted);//for pessimistic operation
      this.props.deleteWholeWeekShifts(remainingShiftsAfterDeletion)//for optimistic rendering, this will update redux store

    }
    
    
    render() {
    return (
      <React.Fragment>
        {/* {this.props.currentUser.user ? */}
          <div className="calendar">
              {this.renderHeader()}
              {this.renderDays()}
              <div className="name-header">Name</div>
              <div>{this.renderShift()}</div>            
          </div>
          {/* :<Redirect to='/'/> */}
        {/* } */}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log("state", state);
  return {
    dept_asso_schedules:state.dept_asso_schedule,
    dept_shifts:state.dept_shifts,
    schedules:state.schedules,
    currentUser: state.currentLogInUser
  }
}
 

const mapDispatchToProps=(dispatch)=>{
  return {
    fetchGetSchedules:(token)=>dispatch(fetchGetSchedules(token)),
    fetchGetSchedulesOnly:(token)=>dispatch(fetchGetSchedulesOnly(token)),
    fetchGetDeptShifts:(token)=>dispatch(fetchGetDeptShifts(token)),
    fetchPostSchedules:(token, schedule)=>dispatch(fetchPostSchedules(token, schedule)),
    deleteWholeWeekShifts:(schedules)=>dispatch(deleteWholeWeekShifts(schedules)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);