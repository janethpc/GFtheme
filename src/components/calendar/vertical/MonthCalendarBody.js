'use strict';

import React, { useState } from 'react';
import moment from "moment";
import CalendarMeeting from "../CalendarMeeting";
import uid from "uid";
import Slider from "react-slick";
import Calendar from "react-calendar"; // Importar react-calendar
import 'react-calendar/dist/Calendar.css'; // Importar estilos predeterminados

export default class VerticalCalendarBody extends React.Component {
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
        let { meetings_to_show } = this.props;
        let preC = 'GFSDK-c';

        const dayList = meetings_to_show.map(function (day) {
            return moment(day.date).toDate();
        });

        let dayTags = !!dayList && dayList.length
            ? dayList.map(function (item, i) {
                  return (
                      <a
                          key={`${preC}-Calendar--vertical-head--${item}`}
                          className={meetings_to_show[i].meetings.length === 0 ? 'empty-slide' : ''}
                      >
                          <div>
                              <p className="this-date">{moment(item).format('dd')}</p>
                              <p className="this-number">{moment(item).format('D')}</p>
                          </div>
                      </a>
                  );
              })
            : [];

        return <div className={`${preC}-Calendar__header_vertical`}>{dayTags}</div>;
    }

    printMeetingsBody() {
        let { meetings_to_show, openFancy, closedFancy, login_initial, limit } = this.props;
        let { selectedDate } = this.state;
        let preC = 'GFSDK-c';

        // Filtrar reuniones del día seleccionado
        const filteredMeetings = meetings_to_show.filter((day) => {
            return moment(day.date).isSame(moment(selectedDate), 'day');
        });

        let listItems = [];

        filteredMeetings.forEach(function (day, index) {
            let column_days = [];
            let activeClass = day.meetings.filter((meeting) => {
                if (meeting.passed === false) {
                    return meeting;
                }
            });
            if (limit) {
                activeClass = activeClass.slice(0, limit);
            }

            column_days = activeClass.map((meeting) => {
                if (meeting) {
                    return (
                        <CalendarMeeting
                            key={`column-day--${uid()}--meeting--${meeting.id}`}
                            meeting={meeting}
                            day={day}
                            openFancy={openFancy}
                            closedFancy={closedFancy}
                            login_initial={login_initial}
                        />
                    );
                }
            });

            listItems.push(
                <div
                    key={`${preC}-Calendar__day_column_vertical--${day.date}`}
                    className={`${preC}-Calendar__day_column_vertical`}
                    data-date={day.date}
                >
                    {column_days}
                </div>
            );
        });

        return <div className={`${preC}-Calendar__week_body_vertical`}>{listItems}</div>;
    }

    printMeetingsBodyMobile() {
        let { sliderSettings, sliderItems } = this.props;

        return <Slider {...sliderSettings} className={'vertical-calendar--mobile'}>{sliderItems}</Slider>;
    }

    render() {
        const { selectedDate } = this.state;

        return (
            <div>
                {/* React Calendar */}
                <div className="calendar-selector">
                    <Calendar
                        onChange={this.handleDateChange}
                        value={selectedDate}
                        minDate={new Date()} // deshabilitar fechas pasadas
                    />
                </div>

                {/* {this.printDaysHeader()} */}
                {this.printMeetingsBody()}
                {this.printMeetingsBodyMobile()}
            </div>
        );
    }
}