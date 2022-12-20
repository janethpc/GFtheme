'use strict';

import React from 'react';
import GlobalStorage from '../../store/GlobalStorage';
import ClassItem from "./ClassItem";
import GafaFitSDKWrapper from "../../utils/GafaFitSDKWrapper";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import StringStore from "../../utils/Strings/StringStore";

class FutureClasses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            counterBuyItems: '',
        }

        this.getFutureClasses = this.getFutureClasses.bind(this);
        GlobalStorage.addSegmentedListener(['future_classes', 'filter_location', 'filter_brand'], this.updateFutureClasses.bind(this));
    }

    componentDidMount() {
        this.getFutureClasses();
    }

    getFutureClasses() {
        const currentComponent = this;
        let brands = GlobalStorage.get('brands');
        let futureClassesList = [];

        brands.forEach(function (brand) {
            GafaFitSDKWrapper.getUserFutureReservationsInBrand(
                brand.slug,
                {reducePopulation: true,},
                function (result) {
                    futureClassesList = futureClassesList.concat(result);
                    GlobalStorage.set('future_classes', futureClassesList);
                    currentComponent.setState({list: futureClassesList});
                });
        })
    }

    updateFutureClasses() {
        let classes = GlobalStorage.get('future_classes');
        let location = GlobalStorage.get('filter_location');
        let brand = GlobalStorage.get('filter_brand');

        if (location) {
            classes = classes.filter(function (item) {
                return item.locations_id === location.id;
            });
        }

        if (brand) {
            classes = classes.filter(function (item) {
                return item.brands_id === brand.id;
            });
        }

        this.setState({list: classes});
    }

    render() {
        let preC = 'GFSDK-c';
        let preE = 'GFSDK-e';
        let profileClass = preC + '-profile';
        let ordersClass = preC + '-orders';
        let formClass = preE + '-form';

        const listItems = this.state.list.map((reservation) =>
            <ClassItem key={reservation.id} reservation={reservation} id={reservation.id}/>
        );

        return (
            <div className={profileClass + '__section is-futureClass'}>

                {this.state.list.length > 0
                    ? <div className={ordersClass + '__section'}>{listItems}</div>
                    : <div className="is-empty">
                        <div className="is-notification">
                            <h3>{StringStore.get('PROFILE_NO_UPCOMING_CLASSES', [window.GFtheme.ClassName])}</h3>
                            {/* <p>Lorem ipsum dolor sit amet</p> */}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default FutureClasses;