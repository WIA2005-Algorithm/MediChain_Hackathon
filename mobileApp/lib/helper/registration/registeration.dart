import 'dart:convert';
import 'package:json_annotation/json_annotation.dart';

import 'package:medichain/constants.dart';
import 'package:medichain/helper/helperfunctions.dart';

@JsonSerializable(explicitToJson: true)
class Payload {
  late LoginDetails loginDetails;
  late PersonalDetails personalDetails;
  late Address address;
  late ContactDetails contactDetails;

  Payload(
    this.loginDetails,
    this.personalDetails,
    this.address,
    this.contactDetails,
  );

  Map<String, dynamic> toJson() {
    return {
      "loginDetails": loginDetails,
      "personalDetails": personalDetails,
      "address": address,
      "contactDetails": contactDetails
    };
  }
}

@JsonSerializable(explicitToJson: true)
class LoginDetails {
  String org = "";
  String ID = ""; // passport/ID
  String password = "";
  String TYPE = "";
  LoginDetails(this.org, this.ID, this.password, this.TYPE);

  Map<String, String> toJson() {
    return {
      "org": org,
      "ID": ID,
      "password": password,
      "TYPE": TYPE,
    };
  }
}

@JsonSerializable(explicitToJson: true)
class PersonalDetails {
  String firstName = "";
  String middleName = ""; // passport/ID
  String lastName = "";
  String email = "";
  int DOB = 0;
  String gender = "";
  String maritalStatus = "";
  String? department = "";
  String passport = "";

  PersonalDetails(
      this.firstName,
      this.middleName,
      this.lastName,
      this.email,
      this.DOB,
      this.gender,
      this.maritalStatus,
      this.department,
      this.passport);

  Map<String, dynamic> toJson() {
    return {
      "firstName": firstName,
      "middleName": middleName, // passport/ID
      "lastName": lastName,
      "email": email,
      "DOB": DOB,
      "gender": gender,
      "maritalStatus": maritalStatus,
      "department": department!,
      "passport": passport,
    };
  }
}

class RegistrationConstants {
  static List<String> departmentOptions = [
    "General",
    "Medicine",
    "Surgery",
    "Neurology",
    "Cardiology",
    "Psychology",
    "Dermotology",
    "ENT",
    "Ophthalmology",
    "Other"
  ];

  static List<String> maritalStatusOptions = [
    "Single",
    "Married",
    "Divorced",
    "Legally Seperated",
    "Windowed"
  ];

  static List<String> genderOptions = [
    "Male",
    "Female",
    "Other",
  ];
}

@JsonSerializable(explicitToJson: true)
class Address {
  String street1 = "";
  String street2 = "";
  String postcode = "";
  String country = "";
  String state = "";
  String city = "";

  Address(
    this.street1,
    this.street2,
    this.postcode,
    this.country,
    this.state,
    this.city,
  );

  Map<String, String> toJson() {
    return {
      "street1": street1,
      "street2": street2,
      "postcode": postcode,
      "country": country,
      "state": state,
      "city": city,
    };
  }
}

@JsonSerializable(explicitToJson: true)
class ContactDetails {
  String mobile = "";
  String whatsapp = "";
  String other = "";

  ContactDetails(
    this.mobile,
    this.whatsapp,
    this.other,
  );

  Map<String, String> toJson() {
    return {
      "mobile": mobile,
      "whatsapp": whatsapp,
      "other": other,
    };
  }
}
