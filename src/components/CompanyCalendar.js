import React from "react";
import dateFns from "date-fns";



class CompanyCalendar extends React.Component {

    state={
        currentMonth: new Date(),
    }
   
  getClassName=(month) => {
    return dateFns.format(month, "MMMM")
  }

  getEvent=(day)=>{
    let eventFound='';
    this.props.events.forEach(event=>{
        if(event.event_date===dateFns.format(day, 'YYYY-MM-DD')){
            eventFound=event.event;
        }
    })
    return eventFound;
  }

  renderHeader() {
      const dateFormat = "MMMM YYYY";
      return (
        <div className={this.getClassName(this.state.currentMonth)}>
          <div className="header rows flex-middle">
            <div className="cols col-centers">
              <span>
                {dateFns.format(this.state.currentMonth, dateFormat)}
              </span>
            </div>
          </div>
        </div>
      );
    }

  renderDays=()=>{
    const dateFormat = "ddd";
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentMonth, {weekStartsOn:1});
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="cols col-centers" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days rows">{days}</div>;
  }

  renderCells=()=>{
      const monthStart = dateFns.startOfMonth(this.state.currentMonth);
      const monthEnd = dateFns.endOfMonth(monthStart);
      const startDate = dateFns.startOfWeek(monthStart, {weekStartsOn:1});
      const endDate = dateFns.endOfWeek(monthEnd,{weekStartsOn:1});
      const dateFormat = "D";
      const rows = [];
      
      let days = [];
      let day = startDate;
      let formattedDate = "";
      
          while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
              formattedDate = dateFns.format(day, dateFormat);
              days.push(
                <div
                  className={`cols cells ${
                    dateFns.isSameMonth(day, monthStart)
                      ? dateFns.isSameDay(day, new Date()) ? "selected" : ""
                      : "disabled"
                  }`}
                  key={day}
                >
                  <span className="number">{formattedDate}</span>
                  <span>{this.getEvent(day)}</span>
                </div>
              );
              day = dateFns.addDays(day, 1);
            }
            rows.push(
              <div className="rows" key={day}>
                {days}
              </div>
            );
            days = [];
          }
    return <div className="body">{rows}</div>;
  }


  render() {
    return (
        <div className="calendars">
            {this.renderHeader()}
            {this.renderDays()}
            {this.renderCells()}
        </div>
    );
  }
}

export default CompanyCalendar;