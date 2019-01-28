'use strict';

import React from 'react';
import Moment from 'moment';
import Strings from "../../utils/Strings/Strings_ES";


class ClassItem extends React.Component {
    constructor(props) {
        super(props)
    }

    handleClick(event) {
        event.preventDefault();
        let currentElement = this;
        console.log('cancelacion');
        //todo este click para abrir el modal de cancelacion
    }


    render() {
        let membershipCredits = '';
        if (this.props.reservation.credit === null) {
            membershipCredits = (
                <p className={'reservation-item-membership'}>{Strings.MEMBERSHIP}{this.props.reservation.user_membership.membership['name']}</p>)
        } else {
            membershipCredits = (
                <p className={'reservation-item-credits'}>{Strings.CREDIT}{this.props.reservation.credit['name']}</p>)
        }

        return (
            <div className={'reservation-item-container col-md-4'}>
                <button type="button" className="close cancelationButton" aria-label="Close" onClick={this.handleClick.bind(this)}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <div className={'reservation-item mb-4 card shadow-sm'}>

                    <div className={'card-header'}>
                        <h4 className={'reservation-item-name'}>{this.props.reservation.location['slug']}</h4>
                    </div>
                    <div className={'card-body'}>
                        <p className={'reservation-item-staff'}>{this.props.reservation.staff['name']}</p>
                        <p className={'reservation-item-service'}>{this.props.reservation.service['name']}</p>
                        <p className={'reservation-item-position'}>{Strings.POSITION}{this.props.reservation.meeting_position}</p>
                        <p className={'reservation-item-meeting'}>{Strings.BEGINS}{Moment(this.props.meeting_start).format('DD-MM-YYYY HH:MM')}</p>
                        {membershipCredits}
                    </div>

                </div>
            </div>
        )
    }
}

export default ClassItem;