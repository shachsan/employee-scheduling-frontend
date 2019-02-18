import React,{Component} from 'react';
import {connect} from 'react-redux';
import dateFns from 'date-fns';

class ScheduleRightSideContainer extends Component{

    renderEvents=()=>{
        const evnts=this.props.events.filter(event=>
            (dateFns.parse(event.event_date)>=this.props.currentDate) && (dateFns.parse(event.event_date)<=dateFns.addDays(this.props.currentDate,6)))
        return evnts.map(evnt=>(
            <div key={evnt.id}>
                    <div style={{display:'inline-block', marginRight:'10px', marginBottom:'20px'}}><span>{evnt.event_date}</span></div>
                    <div style={{display:'inline-block', marginRight:'10px', width:'40px'}}><span>{dateFns.format(evnt.event_date, 'ddd') }</span></div>
                    <div style={{display:'inline-block', marginRight:'10px'}}><span>{evnt.event}</span></div>
                </div>))
        
    }

    render(){
        return ( 
            <div className='side-container'> 
                <div style={{textAlign:'center', marginBottom:'15px', borderBottom:'1px solid orange'}}><h2>Plan your schedules based on the events</h2></div>
                
                {this.renderEvents()}
                
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ( {
        events:state.events
    } );
}

 
export default connect(mapStateToProps, null)(ScheduleRightSideContainer);