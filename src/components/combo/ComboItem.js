'use strict';

import React from "react";
import Strings from "../utils/Strings/Strings_ES";
import GlobalStorage from "../store/GlobalStorage";
import GafaFitSDKWrapper from "../utils/GafaFitSDKWrapper";

import {formatMoney} from "../utils/FormatUtils";

class ComboItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentBrand: null,
            currentLocation: null,
        }
    }

    componentDidMount() {
        let currentElement = this;
        let {combo} = this.props;
        let locations = GlobalStorage.get('locations');

        let params = (new URL(document.location)).searchParams;
        let combo_id = parseInt(params.get('combo-id'));

        if (locations) {
            locations = locations.filter(function (location) {
                return combo.brand.id === location.brand.id
            });
        }
        ;

        this.setState({
            currentBrand: locations[0].brand,
            currentLocation: locations[0],
        });

        if (!typeof gafa === 'undefined' && combo_id) {
            GafaFitSDKWrapper.isAuthenticated(function (auth) {
                if (auth) {
                    currentElement.showBuyFancybyUrl(combo_id);
                }
            });
        }
        ;
    }

    handleClick(event) {
        event.preventDefault();
        let currentElement = this;

        GafaFitSDKWrapper.isAuthenticated(function (auth) {
            if (auth) {
                currentElement.showBuyFancyForLoggedUsers();
            } else {
                currentElement.showLoginForNotLoggedUsers();
            }
        });
    };

    showBuyFancybyUrl(combo_id) {
        let comp = this;
        let {combo} = this.props;
        let {currentBrand, currentLocation} = this.state;

        if (combo_id === combo.id) {
            comp.setState({
                openFancy: true,
            });

            const fancy = document.querySelector('[data-gf-theme="fancy"]');
            fancy.classList.add('active');

            setTimeout(function () {
                fancy.classList.add('show');
            }, 400);

            comp.getFancyForCombo(combo, currentBrand, currentLocation, fancy, true);
        }
    }

    showBuyFancyForLoggedUsers() {
        let comp = this;
        let {combo} = this.props;
        let {currentBrand, currentLocation} = this.state;

        comp.setState({
            openFancy: true,
        });

        const fancy = document.querySelector('[data-gf-theme="fancy"]');
        fancy.classList.add('active');

        setTimeout(function () {
            fancy.classList.add('show');
        }, 400);

        comp.getFancyForCombo(combo, currentBrand, currentLocation, fancy, false);
    }

    getFancyForCombo(combo, currentBrand, currentLocation, fancySelector, cleanUrl) {
        let comp = this;

        GafaFitSDKWrapper.getFancyForBuyCombo(
            currentBrand.slug,
            currentLocation.slug,
            combo.id,
            function (result) {
                getFancy();

                function getFancy() {
                    if (document.querySelector('[data-gf-theme="fancy"]').firstChild) {
                        const closeFancy = document.getElementById('CreateReservationFancyTemplate--Close');

                        closeFancy.addEventListener('click', function (e) {
                            if (!typeof gafa === 'undefined' && cleanUrl) {
                                var url = window.location.href.split('?')[0];
                                window.history.pushState("buq-home", "Home", url);
                            }

                            fancySelector.removeChild(document.querySelector('[data-gf-theme="fancy"]').firstChild);
                            fancySelector.classList.remove('show');

                            setTimeout(function () {
                                fancySelector.classList.remove('active');
                                fancySelector.innerHTML = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>';
                            }, 400);

                            comp.setState({
                                openFancy: false,
                            });

                        })
                    } else {
                        setTimeout(getFancy, 1000);
                    }
                }
            }
        );
    }

    showLoginForNotLoggedUsers() {
        let comp = this;
        let locations = GlobalStorage.get('locations');
        locations = locations.filter(function (location) {
            return location.brand.slug === comp.props.combo.brand.slug
        });

        window.GFtheme.brand_slug = this.props.combo.brand.slug;
        window.GFtheme.location_slug = locations[0].slug;

        if (typeof gafa === 'undefined') {
            this.props.setShowRegister(true);
            window.GFtheme.combo_id = this.props.combo.id;
        } else {
            let combo_url = gafa.b_login + '?combo-id=' + this.props.combo.id;
            window.location.replace(combo_url);
        }
    }

    render() {
        let preC = 'GFSDK-c';
        let preE = 'GFSDK-e';
        let productClass = preE + '-product';
        let comboClass = preC + '-membershipList';
        let {combo} = this.props;
        let {openFancy} = this.state;
        // const services = this.getServicesAndParentsForCombo();
        let currency = GlobalStorage.getBrandCurrency(combo.brand);

        return (
            <div className={comboClass + 'item ' + productClass}>
                <div className={productClass + '__head'}>
                    <h3 className="this-name">{this.props.combo.name}</h3>
                </div>
                <div className={productClass + '__body'}>
                    {this.props.combo.has_discount &&
                    <div>
                        <div className="this-price has-discount">
                            <p>
                                ${formatMoney(this.props.combo.price, 0)} {currency.sufijo}
                            </p>
                        </div>
                    </div>
                    }
                    <div className="this-price has-total">
                        <p>
                            ${formatMoney(this.props.combo.price_final, 0)} {currency.sufijo}
                        </p>
                    </div>

                    {this.props.combo.short_description &&
                    <p className={'this-shortDescription'}>{this.props.combo.short_description}</p>
                    }


                    <button style={{pointerEvents: openFancy ? 'none' : 'auto'}} className="buq-accentColor"
                            onClick={openFancy ? null : this.handleClick.bind(this)}> Comprar
                    </button>

                </div>
                <div className={productClass + '__footer'}>
                    {combo.expiration_days
                        ? <p className={'this-expiration'}><span>{Strings.EXPIRE_IN}</span>
                            <strong>{combo.expiration_days} {Strings.DAYS}</strong></p>
                        : null
                    }
                </div>
            </div>
        );
    }
}

export default ComboItem;