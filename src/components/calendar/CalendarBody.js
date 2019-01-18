'use strict';

import React from "react";
import Strings from "../utils/Strings/Strings_ES";
import CalendarStorage from "./CalendarStorage";
import CalendarColumn from './CalendarColumn';

class CalendarBody extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            meetings_to_show: this.initialMeetings()
        };

        CalendarStorage.addSegmentedListener(['filter_location', 'filter_service', 'filter_room', 'meetings', 'start_date'], this.updateMeetings.bind(this));
    }

    initialMeetings() {
        let shown_meetings = [];
        let meetings = CalendarStorage.get('meetings');
        let start = CalendarStorage.get('start_date');
        if (!!meetings && !!start) {
            let end = new Date();
            end.setDate(start.getDate() + 6);
            let date_array = this.getDates(start, end);

            date_array.forEach(function (date) {
                let meet = {
                    title: date.toLocaleDateString(),
                    date: date.toISOString(),
                    meetings: meetings.filter(function (meeting) {
                        let meeting_date = new Date(meeting.start_date);

                        return new Date(date.toDateString()).getTime() === new Date(meeting_date.toDateString()).getTime();
                    })
                };

                shown_meetings.push(meet);
            });
        }

        return shown_meetings;
    }

    updateMeetings() {
        let location = CalendarStorage.get('filter_location');
        let service = CalendarStorage.get('filter_service');
        let room = CalendarStorage.get('filter_room');
        let meetings = CalendarStorage.get('meetings');
        let start = CalendarStorage.get('start_date');
        let end = new Date();
        end.setDate(start.getDate() + 6);
        let shown_meetings = [];

        if (location) {
            meetings = meetings.filter(function (meeting) {
                return meeting.locations_id === location.id;
            })
        }

        if (service) {
            meetings = meetings.filter(function (meeting) {
                return meeting.services_id === service.id;
            })
        }

        if (room) {
            meetings = meetings.filter(function (meeting) {
                return meeting.rooms_id === room.id;
            })
        }

        let date_array = this.getDates(start, end);

        date_array.forEach(function (date) {
            let meet = {
                title: date.toLocaleDateString(),
                date: date.toISOString(),
                meetings: meetings.filter(function (meeting) {
                    let meeting_date = new Date(meeting.start_date);

                    return new Date(date.toDateString()).getTime() === new Date(meeting_date.toDateString()).getTime();
                })
            };

            shown_meetings.push(meet);
        });

        this.setState({
            meetings_to_show: shown_meetings
        });
    }

    getDates(startDate, stopDate) {
        let dateArray = [];
        let currentDate = new Date(startDate.getTime());
        while (currentDate <= stopDate) {
            let new_date = new Date(currentDate.getTime());
            dateArray.push(new_date);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }

    render() {
        return (
            <div className={'row text-center'}>
                {this.state.meetings_to_show.map(function (day, index) {
                    return (
                        <CalendarColumn key={`calendar-day--${index}`}
                                        index={index}
                                        day={day}/>
                    );
                })}
            </div>
        );

    }
}

export default CalendarBody;