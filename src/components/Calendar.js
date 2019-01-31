import React from "react";
import dateFns from "date-fns";
import {connect} from 'react-redux';
import { fetchGetSchedules } from '../thunk/dept_asso_schedules';
import {fetchGetDeptShifts} from '../thunk/dept_asso_schedules';



class Calendar extends React.Component {

  state={
    currentDate:new Date(),
    dept:1,
    
  
    // selectedDate:'',
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

  // onDateClick = day => {
  //   this.setState({
  //     selectedDate: day
  //   });
  // };
   
 

  

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

    componentDidMount(){
      this.props.fetchGetSchedules();
      
    }

    renderShift=()=>{
      let shift=[];
      let row=[];
      // let i=1;//day counter to be used as key in shift div
      let shiftContainerCounter=0;
      const startOfWeek = dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1})
      const endOfWeek = dateFns.endOfWeek(this.state.currentDate, {weekStartsOn:1})
      const dept=this.props.dept_asso_schedules.find(dept=>dept.id===this.state.dept)//hard code 1, 1 is department id
      if(dept){
        dept.associates.forEach(associate=>{
            // shift.push(<div>)
            shift.push(<div className="emp-name" key={associate.id}>{associate.name}</div>);
            for(let i=startOfWeek; i<=endOfWeek; i=dateFns.addDays(i,1)){
              shiftContainerCounter++;
              
              let shiftExist=associate.schedules.find(schedule=>schedule.date===dateFns.format(i, 'YYYY-MM-DD'));
                if(shiftExist){
                  shift.push(<div className="shift" key={i}>{this.getShiftTime(shiftExist.shift_id)}</div>)
                }else{
                  shift.push(<div className="shift" key={i}>No Shift Assigned</div>)
                }
            }
            row.push(<div className="shift-container" key={shiftContainerCounter}>{shift}</div>)
            shift=[];
            // shift.push(</div>)
          })
      }
      return row;
    }

    handleAutoGenerateShifts=()=>{
      this.props.fetchGetDeptShifts();
      let shifts=[];

      const startOfWeek = dateFns.startOfWeek(this.state.currentDate, {weekStartsOn:1})
      const endOfWeek = dateFns.endOfWeek(this.state.currentDate, {weekStartsOn:1})
      const dept=this.props.dept_asso_schedules.find(dept=>dept.id===this.state.dept)//hard code 1, 1 is department id
      if(dept){
        dept.associates.forEach(associate=>{
          for(let i=startOfWeek; i<=endOfWeek; i=dateFns.addDays(i,1)){

          }
        })
      }
        
    }


  render() {
    
    return (
      <div className="calendar">
            {this.renderHeader()}
            {this.renderDays()}
              <div className="name-header">Name</div>
              <div>{this.renderShift()}</div>            
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log("state", state);
  return {
    dept_asso_schedules:state.dept_asso_schedule,
    dept_shifts:state.dept_shifts
  }
}
 

const mapDispatchToProps=(dispatch)=>{
  return {
    fetchGetSchedules:()=>dispatch(fetchGetSchedules()),
    fetchGetDeptShifts:()=>dispatch(fetchGetDeptShifts())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);