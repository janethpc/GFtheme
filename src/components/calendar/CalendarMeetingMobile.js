'use strict';

import React from "react";
import CalendarStorage from "./CalendarStorage";
import GafaFitSDKWrapper from "../utils/GafaFitSDKWrapper";
import moment from 'moment';
import 'moment/locale/es';
import StringStore from "../utils/Strings/StringStore";
import Check from "../icons/Check";

class CalendarMeetingMovil extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openFancy: false,
            showTooltip: false,
        }
    }


    handleClick(event) {
        event.preventDefault();
        let currentElement = this;
        let login_initial = this.props.login_initial;

        GafaFitSDKWrapper.isAuthenticated(function (auth) {
            if (auth) {
                currentElement.showBuyFancyForLoggedUsers();
            } else {
                login_initial ? currentElement.showLoginForNotLoggedUsers() : currentElement.showRegisterForNotLoggedUsers();
                /*currentElement.showRegisterForNotLoggedUsers();*/
            }
        });
    };

    showBuyFancyForLoggedUsers() {
        let comp = this;
        let meeting = this.props.meeting;

        comp.setState({
            openFancy: true,
        });

        const fancy = document.querySelector('[data-gf-theme="fancy"]');
        fancy.classList.add('active');

        setTimeout(function () {
            fancy.classList.add('show');
        }, 400);

        if (meeting) {

            GafaFitSDKWrapper.getFancyForMeetingReservation(
                meeting.location.brand.slug,
                meeting.location.slug,
                meeting.id,
                function (result) {
                    getFancy();

                    function getFancy() {
                        if (document.querySelector('[data-gf-theme="fancy"]').firstChild) {
                            const closeFancy = document.getElementById('CreateReservationFancyTemplate--Close');

                            closeFancy.addEventListener('click', function (e) {
                                var event_before = new Event('buq__reservation_fancy_before_closed');
                                dispatchEvent(event_before);
                                fancy.removeChild(document.querySelector('[data-gf-theme="fancy"]').firstChild);

                                fancy.classList.remove('show');

                                setTimeout(function () {
                                    fancy.classList.remove('active');
                                    fancy.innerHTML = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
                                }, 400);

                                comp.setState({
                                    openFancy: false,
                                })
                            })
                        } else {
                            setTimeout(getFancy, 1000);
                        }
                    }
                }
            );
        }
    }

    showLoginForNotLoggedUsers() {
        window.GFtheme.meetings_id = this.props.meeting.id;
        window.GFtheme.location_slug = this.props.meeting.location.slug;
        window.GFtheme.brand_slug = this.props.meeting.location.brand.slug;
        let login = CalendarStorage.get('show_login');
        login(true);
    }

    showRegisterForNotLoggedUsers() {
        window.GFtheme.meetings_id = this.props.meeting.id;
        window.GFtheme.location_slug = this.props.meeting.location.slug;
        window.GFtheme.brand_slug = this.props.meeting.location.brand.slug;
        let register = CalendarStorage.get('show_register');
        register(true);
    }

    printDescription() {
        let show_description = CalendarStorage.get('show_description');
        let meeting = this.props.meeting;

        if (show_description) {
            return (
                <p className={'this-description'}>
                    {meeting.description}
                </p>
            );
        }

        return null;
    }

    printStaff() {
        let {meeting} = this.props;
        let staff = meeting.staff;
        const coachExtraInfo = meeting.extra_fields && meeting.extra_fields.coachExtraInfo;


        if (staff && staff.hasOwnProperty('job') && staff.job !== null) {
            return (
                <p className={'this-staff'}>{staff.job} {coachExtraInfo && coachExtraInfo !== '' ? ` / ${coachExtraInfo}` : ''}</p>
            )
        } else {
            return (
                <p className={'this-staff'}>{meeting.staff.name} {meeting.staff.lastname} {coachExtraInfo && coachExtraInfo !== '' ? ` / ${coachExtraInfo}` : ''}</p>
            );
        }
    }

    printSubstituteStaff() {
        let {meeting} = this.props;
        let substitute_staff = meeting.substitute_staff;

        if (substitute_staff) {
            if (substitute_staff.hasOwnProperty('job') && substitute_staff.job !== null) {
                return (
                    <p className={'this-substitute-staff'}>{StringStore.get('SUBSTITUTE_INDICATOR')} {substitute_staff.job}</p>
                );
            } else {
                return (
                    <p className={'this-substitute-staff'}>{StringStore.get('SUBSTITUTE_INDICATOR')} {substitute_staff.name} {substitute_staff.lastname}</p>
                );
            }
        }

        return null;
    }

    showTooltip(e) {
        e.preventDefault();
        e.stopPropagation();
        let {showTooltip} = this.state;

        this.setState({
            showTooltip: !showTooltip
        });
    }

    render() {
        const { meeting, day } = this.props;
    const classStart = moment(meeting.start).toDate();
    const duration =
    meeting.duration ||
    (meeting.service && meeting.service.duration) ||
    50;
    const staff = meeting.staff;
    const avatar =
    (staff && staff.picture) ||
    (staff && staff.avatar) ||
    null;

    return (
    <div
        className="GFSDK-e-meeting-list meeting-item"
        onClick={this.handleClick.bind(this)}
    >
        {/* LEFT */}
        <div className="meeting-list__left">
            <p className="meeting-time">{meeting.start_time}</p>
            <p className="meeting-duration">{duration} min.</p>

            <div className="meeting-avatar">
                {avatar ? (
                    <img
                        src={avatar}
                        alt={staff && staff.name ? staff.name : ''}
                    />
                ) : (
                    <div className="avatar-placeholder" />
                )}
            </div>
        </div>

        {/* RIGHT */}
        <div className="meeting-list__right">
            <h4 className="meeting-title">
                {meeting.service.name}
            </h4>

            <p className="meeting-coach">
                {staff && staff.name} {staff && staff.lastname}
            </p>

            <p className="meeting-service">
                {meeting.service.parent_service_recursive
                    ? meeting.service.parent_service_recursive.name
                    : meeting.service.name}
            </p>

            <p className="meeting-location">
                {meeting.location.name}
            </p>

            <div className="meeting-footer">
                <span className="meeting-availability">
                    {meeting.available}/{meeting.capacity} Open
                </span>

                <button className="meeting-reserve-btn">
                    RESERVAR
                </button>
            </div>
        </div>
    </div>
);

}
}

export default CalendarMeetingMovil;
