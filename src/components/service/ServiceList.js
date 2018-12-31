'use strict';

import React from "react";
import ServiceItem from "./ServiceItem";
import Strings from "../utils/Strings/Strings_ES";

class ServiceList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const listItems = this.props.list.map((service) =>
            <ServiceItem key={service.id} service={service}/>
        );
        return (
            <div>
                <h1 className={["display-4", "container", "text-center"].join(" ")}>{Strings.SERVICE_LIST}</h1>
                <div className={["service-list", "container"].join(" ")}>
                    <div className={["row", "mt-5", "justify-content-center", "text-center"].join(" ")}>
                        {listItems}
                    </div>
                </div>
            </div>
        );
    }
}

export default ServiceList;

