import React,{Component} from 'react';
import {connect} from 'react-redux';
import dateFns from 'date-fns';
import AnimationDiv from '../components/AnimationDiv';

class ScheduleRightSideContainer extends Component{

    renderEvents=()=>{
        const evnts=this.props.events.filter(event=>
            (dateFns.parse(event.event_date)>=this.props.currentDate) && (dateFns.parse(event.event_date)<=dateFns.addDays(this.props.currentDate,6)))
            
            console.log('rendered right container', evnts);
        return evnts.map(evnt=>(
            <div key={evnt.id}>
                    <span>{evnt.event_date} | {dateFns.format(evnt.event_date, 'ddd')}</span>
                    <h4 style={{display:'inline'}}>=></h4>
                    <span>{evnt.event}</span>
                </div>))
        
    }

    render(){
        return ( 
            <div className='side-container'> 
                <h2>Plan your schedules based on the events</h2>
                {this.renderEvents()}
                {/* <AnimationDiv/> */}
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