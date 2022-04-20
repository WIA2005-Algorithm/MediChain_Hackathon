"use strict";
const Address = (street, zip, city, state, country) => ({
    street: !street ? "N/A" : street,
    zipCode: !zip ? "N/A" : zip,
    city,
    state: !state ? "N/A" : state,
    country,
});

const Contact = (mobile, otherNo, whatsapp) => ({
    mobile,
    otherNumber: !otherNo ? "N/A" : otherNo,
    whatsapp: !whatsapp ? "N/A" : whatsapp,
});
const PersonalDetails = (
    firstName,
    lastName,
    gender,
    DOB,
    address,
    contact
) => ({
    firstName,
    lastName,
    gender,
    DOB,
    address,
    contact,
});

/**
 * @param {String} type MemberType [Doctor, Patient]
 * @param {String} firstName
 * @param {String} lastName [Optional]
 * @param {Number} gender options [0, 1, undefined]
 * @param {String} DOB format: "DD/MM/YYYY"
 * @param {String} street
 * @param {String} zip [Optional]
 * @param {String} city
 * @param {String} state [Optional]
 * @param {String} country
 * @param {String} org
 * @param {String} role
 * @param {Number} mobile [required]
 * @param {Number} Other [Optional]
 * @param {Number} Whatsapp [Optional]
 * @returns {JSON}
 */
const obtainDetails = (
    firstName,
    lastName,
    gender,
    DOB,
    street,
    zip,
    city,
    state,
    country,
    org,
    role,
    mobile,
    other = null,
    whatsapp = null
) => ({
    details: PersonalDetails(
        firstName,
        lastName,
        gender,
        DOB,
        Address(street, zip, city, state, country),
        Contact(mobile, other, whatsapp)
    ),
    orgDetails: {org, role},
});

module.exports = { obtainDetails };
