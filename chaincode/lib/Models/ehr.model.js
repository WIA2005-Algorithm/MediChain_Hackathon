"use strict";
const { obtainDetails } = require("./utilities.model.js");
function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}
const getTypeEHROrDoctor = (details, orgDetails, contact, type) => {
    let extraAttr;
    if (type === "Doctor") {
        extraAttr = {
            associatedPatients: [],
        };
    } else {
        extraAttr = {
            PHRID: null,
            associatedDoctors: {},
        };
    }

    return {
        ...extraAttr,
        secretSharingPair: {},
        ...obtainDetails(
            details.firstName,
            details.lastName,
            details.gender,
            details.DOB,
            details.street,
            details.zip,
            details.city,
            details.state,
            details.country,
            orgDetails.orgID,
            orgDetails.orgName,
            orgDetails.orgAddress,
            contact.mobile,
            contact.other,
            contact.whatsapp
        ),
    };
};

module.exports = { getTypeEHROrDoctor };

console.log(
    prettyJSONString(
        JSON.stringify(
            getTypeEHROrDoctor(
                {
                    firstName: "Kamal",
                    lastName: "Kumar Khatri",
                    gender: "Male",
                    DOB: "06/23/2001",
                    street: null,
                    zip: null,
                    city: "Salalah",
                    state: null,
                    country: "Oman",
                },
                {
                    orgID: "Org1MSP",
                    orgName: "UMMC",
                    orgAddress: "ummc.um.edu.my",
                },
                {
                    mobile: "+96894637602",
                    other: null,
                    whatsapp: null,
                },
                "Patient"
            )
        )
    )
);

console.log(
    prettyJSONString(
        JSON.stringify(
            getTypeEHROrDoctor(
                {
                    firstName: "Kamal",
                    lastName: "Kumar Khatri",
                    gender: "Male",
                    DOB: "06/23/2001",
                    street: null,
                    zip: null,
                    city: "Salalah",
                    state: null,
                    country: "Oman",
                },
                {
                    orgID: "Org1MSP",
                    orgName: "UMMC",
                    orgAddress: "ummc.um.edu.my",
                },
                {
                    mobile: "+96894637602",
                    other: null,
                    whatsapp: null,
                },
                "Doctor"
            )
        )
    )
);
