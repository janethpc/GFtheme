'use strict';

import React from "react";
import {Button, Tab, Tabs} from "react-bootstrap";
import CustomScroll from "react-custom-scroll";
import "react-custom-scroll/dist/customScroll.css"
import {FormErrors} from "../../form/FormErrors";
import GafaFitSDKWrapper from "../../utils/GafaFitSDKWrapper";
import Strings from "../../utils/Strings/Strings_ES";
import {isFunction} from "../../utils/TypeUtils";
import 'moment/locale/es';
import UserInfo from "./UserInfo";
import AddressInfo from "./AddressInfo";
import ContactInfo from "./ContactInfo";
import FutureClasses from "./FutureClasses";
import PastClasses from "../PastClasses";
// import PaymentMethods from "./Payment/PaymentMethods";
import PurchasesList from "../PurchasesList";
import ChangePassword from "./ChangePassword";
import IconLogOut from '../../utils/Icons/IconLogOut';
// import LocationsFilter from "../../locations/LocationsFilters";
// import CloseIcon from "../../utils/Icons/CloseIcon";
// import CheckIcon from "../../utils/Icons/CheckIcon";
import GlobalStorage from '../../store/GlobalStorage';

//Estilos
import '../../../styles/newlook/components/GFSDK-c-Profile.scss';
import '../../../styles/newlook/components/GFSDK-c-Orders.scss';
import '../../../styles/newlook/components/GFSDK-c-Payment.scss';
import '../../../styles/newlook/components/GFSDK-c-Tabs.scss';
import '../../../styles/newlook/elements/GFSDK-e-form.scss';
import '../../../styles/newlook/elements/GFSDK-e-scroll.scss';
import '../../../styles/newlook/elements/GFSDK-e-buttons.scss';

class ProfileUserInfo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            first_name: "",
            last_name: "",
            // birthDate: new Date(),
            birth_date: "",
            password: "",
            password_confirmation: "",
            address: "",
            internal_number: "",
            external_number: "",
            municipality: "",
            postal_code: "",
            city: "",
            countries_id: "",
            country_states_id: "",
            countries: [],
            states: [],
            phone: "",
            cel_phone: "",
            gender: "",
            formErrors: {first_name: ''},
            first_nameValid: true,
            formValid: true,
            serverError: '',
            saved: false,
            // paymentNotification: GlobalStorage.get('ConektaPaymentNotification'),
        };
        // GlobalStorage.addSegmentedListener(['ConektaPaymentNotification'], this.updateConektaNotificaction.bind(this));
    }

    componentDidMount() {
        const currentComponent = this;
        GafaFitSDKWrapper.getMe(function (result) {
            currentComponent.setState(
                {
                    email: result.email,
                    first_name: result.first_name,
                    last_name: result.last_name,
                    // birthDate: new Date(result.birth_date.substring(0, 11)),
                    birth_date: result.birth_date,
                    address: result.address,
                    internal_number: result.internal_number,
                    external_number: result.external_number,
                    municipality: result.municipality,
                    postal_code: result.postal_code,
                    city: result.city,
                    countries_id: result.countries_id,
                    country_states_id: result.country_states_id,
                    phone: result.phone,
                    cel_phone: result.cel_phone,
                    gender: result.gender,
                });
            // GlobalStorage.set('me', result);
            currentComponent.getCountryList(currentComponent.getStatesListByCountry.bind(currentComponent));
        });
    }

    // updateConektaNotificaction(){
    //     let currentComponent = this;
    //     currentComponent.setState({
    //         paymentNotification: GlobalStorage.get('ConektaPaymentNotification'),
    //     });
    // }

    findCountryCodeById() {
        let country = this.state.countries.find(option => option.value === this.state.countries_id);
        let countryCode = "";
        if (country != null) {
            countryCode = country.code;
        }
        return countryCode;
    }

    getCountryList(callback) {
        const currentComponent = this;
        GafaFitSDKWrapper.getCountries(function (result) {
            currentComponent.setState(
                {
                    countries: result.map(function (item) {
                        return {label: item.name, value: item.id, code: item.code}
                    }),
                });
            if (isFunction(callback)) callback();
        });
    }

    getStatesListByCountry(callback) {
        const currentComponent = this;
        let countrySelected = currentComponent.findCountryCodeById();
        GafaFitSDKWrapper.getCountryStates(countrySelected, function (result) {
            currentComponent.setState({
                    states: result.map(function (item) {
                        return {label: item.name, value: item.id}
                    })
                });
            if (isFunction(callback)) callback();
        });
    }

    handleChangeField(event) {
        let fieldName = event.target.id;
        let fieldValue = event.target.value;
        this.setState({
            [fieldName]: fieldValue
        });
    }

    handleChangePassword(event) {
        let passvalue = event.target.value;

        this.setState({
            password: passvalue,
        })
    }

    handleChangeConfirmationPassword(event) {
        let passvalue = event.target.value;

        this.setState({
            password_confirmation: passvalue
        })
    }

    updateState(state) {
        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();
        let currentElement = this;
        currentElement.setState({serverError: '', saved: false});
        GafaFitSDKWrapper.putMe(this.state,
            currentElement.successSaveMeCallback.bind(this),
            currentElement.errorSaveMeCallback.bind(this));
    }

    successSaveMeCallback(result) {
        this.setState({saved: true});
        if (this.props.successCallback) {
            this.props.successCallback(result);
        }
    }

    // deleteCard(){
    //     let ConektaPaymentNotification = GlobalStorage.get('ConektaPaymentNotification');
    //     GafaFitSDKWrapper.postUserRemovePaymentOption(
    //         ConektaPaymentNotification.paymentMethod,
    //         ConektaPaymentNotification.cardID,
    //         function(result){
    //             GlobalStorage.set('ConektaPaymentInfo', result.conekta);
    //         }
    //     );
    // }

    // closeNotification(){
    //     GlobalStorage.set('ConektaPaymentNotification', null);
    // }

    errorSaveMeCallback(error) {
        this.setState({serverError: error});
    }

    render() {
        let preE = 'GFSDK-e';
        let preC = 'GFSDK-c';
        let profileClass = preC + '-profile';
        let paymentClass = preC + '-payment';
        let tabsClass = preC + '-tabs';
        let buttonClass = preE + '-buttons';
        let formClass = preE + '-form';
        let {paymentNotification} = this.state

        return (
            <div className="profile-info">
                <div className={'GFSDK-user__container'}>
                    <div className="profile-user">
                        <div className="profile-user__content">
                            <div className="profile-user__data">
                                <div className="this-picture"></div>
                                <h3 className="profile-user__name">¡Hola {this.state.first_name}! <br></br> Bienvenido</h3>
                                {/* <h4 className="profile-user__venue">{this.state.email}</h4> */}
                            </div>
                            <div className="profile-user__tools">
                                <div className="profile-user__tools-container">
                                    {/* <LocationsFilter /> */}
                                    <a className='this-logOut' onClick={this.props.handleClickLogout}>
                                        <IconLogOut/> {Strings.BUTTON_LOGOUT}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={'profile-tabs'}>
                    <div className="container">
                        <Tabs defaultActiveKey={1} id={'ProfileTabs'} className={profileClass + '__tab-content'} animation={true}>
                            <Tab eventKey={1} title={Strings.CLASS}>
                                <CustomScroll heightRelativeToParent="100%">
                                    <div className={profileClass + '__tab-section'}>
                                        <h4 className={'this-title'}>Mis próximas clases</h4>
                                        <FutureClasses />
                                    </div>
                                    <hr></hr>
                                    <div className={profileClass + '__tab-section'}>
                                        <h4 className={'this-title'}>Historial de clases</h4>
                                        <PastClasses />
                                    </div>
                                    <hr></hr>
                                    <div className={profileClass + '__tab-section'}>
                                        <h4 className={'this-title'}>Historial de compras</h4>
                                        <PurchasesList /> 
                                    </div>
                                </CustomScroll>
                                 {/* <div className={paymentClass + "__notification " + (paymentNotification ? 'is-active' : '')}>
                                       <div className={paymentClass + "__notification-container"}>
                                          <p>{!paymentNotification ? 'Error: No encuentré el mensaje' : paymentNotification.message}</p>
                                          <div className={paymentClass + "__controls"}>
                                             <button className={buttonClass + "__controls is-success"} onClick={this.deleteClass.bind(this)}>
                                                   <CheckIcon />
                                             </button>
                                             <button className={buttonClass + "__controls is-close"} onClick={this.classNotification.bind(this)}>
                                                   <CloseIcon />
                                             </button>
                                          </div>
                                       </div>
                                 </div> */}
                            </Tab>

                            <Tab eventKey={2} title={Strings.PROFILE}>
                                <div className={profileClass + '__tab-content'}>
                                    <CustomScroll heightRelativeToParent="100%">
                                        <form className={profileClass + '__form is-UserConf'} onSubmit={this.handleSubmit.bind(this)}>
                                            <UserInfo info={this.state} updateState={this.updateState.bind(this)}
                                                    handleChangeField={this.handleChangeField.bind(this)}/>
                                            <hr className={formClass + '__divider'}></hr>
                                            <AddressInfo info={this.state} updateState={this.updateState.bind(this)}
                                                        getStatesListByCountry={this.getStatesListByCountry.bind(this)}
                                                        handleChangeField={this.handleChangeField.bind(this)}/>
                                            <hr className={formClass + '__divider'}></hr>
                                            <ContactInfo info={this.state} updateState={this.updateState.bind(this)}
                                                        handleChangeField={this.handleChangeField.bind(this)}/>

                                            <div className={profileClass + '__section is-save'}>
                                                <button disabled={!this.state.formValid} type="submit" className={buttonClass + ' ' + buttonClass + "--submit is-primary"}>
                                                    {Strings.BUTTON_SAVE}
                                                </button>

                                                <div className={formClass + '__notifications'}>
                                                    <div className="text-danger">
                                                        <FormErrors formErrors={this.state.formErrors}/>
                                                        {this.state.serverError !== '' && <small>{this.state.serverError}</small>}
                                                    </div>
                                                    <div className="text-success">
                                                        {this.state.saved && <small>{Strings.SAVE_ME_SUCCESS}</small>}
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </CustomScroll>
                                </div>
                            </Tab>

                            <Tab eventKey={3} title={Strings.CHANGEPASSWORD}>
                                <div className={profileClass + '__tab-content'}>
                                    <form className={profileClass + '__form is-ChangePassword'} onSubmit={this.handleSubmit.bind(this)}>
                                        <ChangePassword info={this.state}
                                                        handleChangePassword={this.handleChangePassword.bind(this)}
                                                        handleChangeConfirmationPassword={this.handleChangeConfirmationPassword.bind(this)}/>
                                        <div className={profileClass + '__section is-save'}>
                                            <button
                                                disabled={!this.state.formValid}
                                                type="submit"
                                                className={buttonClass + ' ' + buttonClass + "--submit is-primary"}
                                            >
                                                {Strings.BUTTON_SAVE}
                                            </button>

                                            <div className={formClass + '__notifications'}>
                                                <div className="text-danger">
                                                    <FormErrors formErrors={this.state.formErrors}/>
                                                    {this.state.serverError !== '' && <small>{this.state.serverError}</small>}
                                                </div>
                                                <div className="text-success">
                                                    {this.state.saved && <small>{Strings.SAVE_ME_SUCCESS}</small>}
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </Tab>

                            {/* <Tab className={tabsClass + '-container is-payment'} eventKey={4} title={Strings.PAYMENT}>
                                <CustomScroll heightRelativeToParent="100%">
                                    <div className={profileClass + '__tab-section'}>
                                        <PaymentMethods />
                                    </div>
                                </CustomScroll>
                                <div className={paymentClass + "__notification " + (paymentNotification ? 'is-active' : '')}>
                                    <div className={paymentClass + "__notification-container"}>
                                        <p>{!paymentNotification ? 'Error: No encuentré el mensaje' : paymentNotification.message}</p>
                                        <div className={paymentClass + "__controls"}>
                                            <button className={buttonClass + "__controls is-success"} onClick={this.deleteCard.bind(this)}>
                                                <CheckIcon />
                                            </button>
                                            <button className={buttonClass + "__controls is-close"} onClick={this.closeNotification.bind(this)}>
                                                <CloseIcon />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Tab> */}
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileUserInfo;