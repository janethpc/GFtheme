'use strict';

import React from "react";

class GafaFitSDKWrapper extends React.Component {
    constructor(props) {
        super(props);
    }

    static initValues() {
        GafaFitSDK.setUrl('https://devgafa.fit/');
        GafaFitSDK.setCompany(1);
        window.GFtheme = {};
        window.GFtheme.brand = 'test-brand-1';
        window.GFtheme.location = 't3mplo-pedregal';
    }

    static setBrand(brand) {
        window.GFtheme.brand = brand;
    }

    static getStaffList(options, callback) {
        GafaFitSDK.GetBrandStaffList(
            window.GFtheme.brand, options, function (error, result) {
                if (error === null) {
                    callback(result);
                }
            }
        );
    };

    static getServiceList(callback) {
        GafaFitSDK.GetBrandServiceList(
            window.GFtheme.brand, {}, function (error, result) {
                if (error === null) {
                    callback(result);
                }
            }
        );
    };

    static isAuthenticated() {
        return GafaFitSDK.isAuthentified();
    };


    static getComboList(callback) {
        let functionToRetrieveCombos = GafaFitSDK.GetBrandCombolist;
        if (GafaFitSDK.isAuthentified()) {
            functionToRetrieveCombos = GafaFitSDK.GetBrandComboListforUser;
        }
        functionToRetrieveCombos(
            window.GFtheme.brand, {
                'only_actives': true,
                'propagate': true
            }, function (error, result) {
                if (error === null) {
                    callback(result);
                }
            }
        );
    };

    static getMembershipList(callback) {
        let functionToRetrieveMemberships = GafaFitSDK.GetBrandMembershipList;
        if (GafaFitSDK.isAuthentified()) {
            functionToRetrieveMemberships = GafaFitSDK.GetBrandMembershipListForUser;
        }
        functionToRetrieveMemberships(
            window.GFtheme.brand, {
                'only_actives': true,
                'propagate': true
            }, function (error, result) {
                if (error === null) {
                    callback(result);
                }
            }
        );
    };

    static getFancyForBuyCombo(combos_id, callback) {
        GafaFitSDKWrapper.getMe(function () {
            GafaFitSDK.GetCreateReservationForm(
                window.GFtheme.brand,
                window.GFtheme.location,
                window.GFtheme.me.id,
                '[data-gf-theme="fancy"]',
                {
                    'combos_id': combos_id,
                }, function (error, result) {
                    if (error === null) {
                        callback(result);
                    }
                }
            );
        });
    };

    static getFancyForBuyMembership(memberships_id, callback) {
        GafaFitSDKWrapper.getMe(function () {
            GafaFitSDK.GetCreateReservationForm(
                window.GFtheme.brand,
                window.GFtheme.location,
                window.GFtheme.me.id,
                '[data-gf-theme="fancy"]',
                {
                    'memberships_id': memberships_id,
                }, function (error, result) {
                    if (error === null) {
                        callback(result);
                    }
                }
            );
        });
    };

    static getToken(email, password, successCallback, errorCallback) {
        GafaFitSDK.GetToken(
            1,
            "9fG7adUeA43FfidqQN7WsgBAwcCMJJMtPGoPdPOM",
            email,
            password,
            {
                "grant_type": "password",
                "scope": "*"
            },
            function (error, result) {
                if (error != null) {
                    let errorToPrint = Object.keys(error).map(function (key) {
                        return error[key];
                    }).join(". ");
                    errorCallback(errorToPrint);
                } else {
                    GafaFitSDKWrapper.getMe(function () {
                        successCallback(result)
                    });
                }
            }
        );
    };

    static getUserCredits(callback) {
        GafaFitSDK.GetUserCredits(
            window.GFtheme.brand, {}, function (error, result) {
                if (error === null) {
                    callback(result);
                }
            }
        );
    };

    static getUserMemberships(callback) {
        GafaFitSDK.GetUserMembership(
            window.GFtheme.brand, {}, function (error, result) {
                if (error === null) {
                    callback(result);
                }
            }
        );
    };

    static postRegister(params, successCallback, errorCallback) {
        let options = {};
        options.last_name = params.last_name;
        options.grant_type = 'password';
        options.scope = '*';
        GafaFitSDK.PostRegister(
            3,
            "rh9}UJA<7,H7d!T27&a9.9ZXQsCf&CS/[jik==c&",
            params.email,
            params.password,
            params.passwordConfirmation,
            params.first_name,
            options,
            function (error, result) {
                if (error != null) {
                    let errorToPrint = Object.keys(error).map(function (key) {
                        return error[key];
                    }).join(". ");
                    errorCallback(errorToPrint);
                } else {
                    successCallback(result)
                }
            }
        );
    };

    static postPasswordForgot(params, successCallback, errorCallback) {
        GafaFitSDK.RequestNewPassword(
            params.email,
            params.returnUrl,
            function (error, result) {
                if (error != null) {
                    let errorToPrint = Object.keys(error).map(function (key) {
                        return error[key];
                    }).join(". ");
                    errorCallback(errorToPrint);
                } else {
                    successCallback(result)
                }
            }
        );
    };

    static postPasswordChange(params, successCallback, errorCallback) {
        GafaFitSDK.NewPassword(
            params.email,
            params.password,
            params.passwordConfirmation,
            params.token,
            function (error, result) {
                if (error != null) {
                    let errorToPrint = Object.keys(error).map(function (key) {
                        return error[key];
                    }).join(". ");
                    errorCallback(errorToPrint);
                } else {
                    successCallback(result)
                }
            }
        );
    };

    static getMe(callback) {
        if (window.GFtheme.me == null) {
            GafaFitSDK.GetMe(
                function (error, result) {
                    if (error == null) {
                        window.GFtheme.me = result;
                        callback(result);
                    } else {
                        callback(null);
                    }
                }
            );
        } else {
            callback(window.GFtheme.me);
        }
    };

    static getMeWithCredits(callback) {
        GafaFitSDKWrapper.getMe(function (result) {
            let user = result;
            GafaFitSDKWrapper.getUserCredits(function (result) {
                user.credits = result;
                user.creditsTotal = 0;
                user.credits.forEach(function (elem) {
                    user.creditsTotal += elem.total;
                });
                window.GFtheme.me = user;
                callback(user);
            });
        });
    }

    static putMe(params, successCallback, errorCallback) {
        GafaFitSDK.PutMe(
            params,
            function (error, result) {
                if (error != null) {
                    let errorToPrint = Object.keys(error).map(function (key) {
                        return error[key];
                    }).join(". ");
                    errorCallback(errorToPrint);
                } else {
                    window.GFtheme.me = result;
                    GafaFitSDKWrapper.getMeWithCredits(
                        successCallback
                    );
                }
            }
        );
    };

    static getCountries(callback) {
        GafaFitSDK.GetCountryList({},
            function (error, result) {
                if (error === null) {
                    callback(result);
                } else {
                    callback([]);
                }
            }
        );
    };

    static getCountryStates(country, callback) {
        GafaFitSDK.GetCountryStateList(country, {},
            function (error, result) {
                if (error === null) {
                    callback(result);
                } else {
                    callback([]);
                }
            }
        );
    };

    static logout(successCallback, errorCallback) {
        GafaFitSDK.PostLogout(
            {},
            function (error, result) {
                if (error != null) {
                    let errorToPrint = Object.keys(error).map(function (key) {
                        return error[key];
                    }).join(". ");
                    errorCallback(errorToPrint);
                } else {
                    window.GFtheme.me = null;
                    successCallback(result);
                }
            }
        );
    }

    static getMeetingsInLocation(location, start_date, end_date, callback) {
        GafaFitSDK.GetlocationMeetingList(window.GFtheme.brand, location, {
            'only_actives': true,
            'start': start_date,
            'end': end_date
        }, function (error, result) {
            if (error === null) {
                callback(result);
            }
        })
    }

    static getBrandLocations(options, callback) {
        options.only_actives = true;
        GafaFitSDK.GetBrandLocationList(window.GFtheme.brand, options, function (error, result) {
            if (error === null) {
                callback(result);
            }
        })
    }

    static getBrandRooms(options, callback) {
        GafaFitSDK.GetRoomsInBrand(window.GFtheme.brand, options, function (error, result) {
            if (error === null) {
                callback(result);
            }
        });
    }

    static getFancyForMeetingReservation(location,meetings_id, callback) {
        GafaFitSDKWrapper.getMe(function () {
            GafaFitSDK.GetCreateReservationForm(
                window.GFtheme.brand,
                location,
                window.GFtheme.me.id,
                '[data-gf-theme="fancy"]',
                {
                    'meetings_id': meetings_id,
                }, function (error, result) {
                    if (error === null) {
                        callback(result);
                    }
                }
            );
        });
    };
}

export default GafaFitSDKWrapper;

