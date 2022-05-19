"use strict";
const Address = (street1, street2, zip, city, state, country) => ({
    street1,
    street2: !street2 ? "" : street2,
    postcode: !zip ? "N/A" : zip,
    country,
    state,
    city

});

const Contact = (mobile, otherNo, whatsapp) => ({
    mobile,
    whatsapp: !whatsapp ? "N/A" : whatsapp,
    otherNumber: !otherNo ? "N/A" : otherNo,
});
const PersonalDetails = (
    firstName,
    middleName,
    lastName,
    email,
    DOB,
    gender,
    maritalStatus,
    address,
    contact
) => ({
    firstName,
    middleName,
    lastName,
    email,
    DOB,
    gender,
    maritalStatus,
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
    middleName,
    lastName,
    email,
    DOB,
    gender,
    maritalStatus,
    street1,
    street2,
    postcode,
    country,
    state,
    city,
    org,
    role,
    mobile,
    other = null,
    whatsapp = null
) => ({
    details: PersonalDetails(
        firstName,
        middleName,
        lastName,
        email,
        DOB,
        gender,
        maritalStatus,
        Address(street1, street2, postcode, city, state, country),
        Contact(mobile, other, whatsapp)
    ),
    orgDetails: { org, role },
});

module.exports = { obtainDetails };
