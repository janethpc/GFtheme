'use strict';

import React from 'react'
import moment from "moment";
import CalendarMeetingMovil from "../CalendarMeetingMobile";
import uid from "uid";
import Slider from "react-slick";
import StringStore from "../../utils/Strings/StringStore";
import './css/MobileCalendarBody.css';



export default class MovilCalendarBody extends React.Component {
    constructor(props) {
        super(props);

        // Estado para la fecha seleccionada
        this.state = {
            selectedDate: new Date(),
        };

        this.handleDateChange = this.handleDateChange.bind(this);
    }


    // Método para manejar cambios de fecha
    handleDateChange(newDate) {
        this.setState({ selectedDate: newDate });

        // actualizar las reuniones según la fecha seleccionada
        if (this.props.onDateChange) {
            this.props.onDateChange(moment(newDate).format('YYYY-MM-DD'));
        }
    }

    printDaysHeader() {
    const { meetings_to_show } = this.props;
    let preC = 'GFSDK-c';

    if (!Array.isArray(meetings_to_show)) {
        return null;
    }

    const dayList = meetings_to_show.map(day =>
        moment(day.date).toDate()
    );

    const dayTags = dayList.map((item, i) => {
        moment.locale(StringStore.getLanguage().toLowerCase());

        const isEmpty =
            meetings_to_show[i] &&
            meetings_to_show[i].meetings &&
            meetings_to_show[i].meetings.length === 0;

        return (
            <a
                key={`${preC}-Calendar--vertical-head--${item}`}
                className={isEmpty ? 'empty-slide' : ''}
            >
                <div>
                    <p className="this-date">{moment(item).format('dd')}</p>
                    <p className="this-number">{moment(item).format('D')}</p>
                </div>
            </a>
        );
    });

    return (
        <div className={`${preC}-Calendar__header_vertical calendar-movil`}>
            {dayTags}
        </div>
    );
}



    printMeetingsBody() {
    const { meetings_to_show, openFancy, closedFancy, login_initial, limit } = this.props;
    let preC = 'GFSDK-c';

    if (!Array.isArray(meetings_to_show)) {
        return null;
    }

    const listItems = meetings_to_show.map(day => {
        let activeMeetings = day.meetings.filter(
            meeting => meeting && meeting.passed === false
        );

        if (limit) {
            activeMeetings = activeMeetings.slice(0, limit);
        }

        return (
            <div
                key={`${preC}-Calendar__day_column_vertical--${day.date}`}
                className={`${preC}-Calendar__day_column_vertical`}
                data-date={day.date}
            >
                {activeMeetings.map(meeting => (
                    <CalendarMeetingMovil
                        key={`meeting--${meeting.id}`}
                        meeting={meeting}
                        day={day}
                        openFancy={openFancy}
                        closedFancy={closedFancy}
                        login_initial={login_initial}
                    />
                ))}
            </div>
        );
    });

    return (
        <div className={`${preC}-Calendar__week_body_vertical`}>
            {listItems}
        </div>
    );
}

    

    render() {
        return (<div>
            {this.printDaysHeader()}
            {this.printMeetingsBody()}
        </div>)
        const { selectedDate } = this.state;

        return (
            <div>
                {/* React Calendar */}
                <div className="calendar-selector">
                    <Calendar
                        onChange={this.handleDateChange}
                        value={selectedDate}
                        minDate={this.minDate} 
                        maxDate={this.maxDate}
                    />
                </div>

                 {this.printDaysHeader()} 
                {this.printMeetingsBody()}
               
            </div>
        );
    }
}