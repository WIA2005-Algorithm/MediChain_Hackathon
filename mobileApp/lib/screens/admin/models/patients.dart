import 'dart:convert';

class Patient {
  static String active = '';
  static String associatedDoctors = '';
  static String checkIn = '';
  static String checkOut = '';
  static String details = '';
  static String orgDetails = '';

  static String secretSharingPair = '';
  static int patientCount = 0;

  static void fromJson(Map<String, dynamic> json) {
    active = json['active'];
    associatedDoctors = json['associatedDoctors'];
    checkIn = json['checkIn'];
    checkOut = json['Address'];
    details = json['details'];
    orgDetails = json['orgDetails'];
    secretSharingPair = json['secretSharingPair'];
    Details(jsonDecode(details));
    OrgDetails(jsonDecode(orgDetails));
  }
}

class Details {
  int DOB = 0;
  String city = '';
  String country = '';
  String postcode = '';
  String state = '';
  String street1 = '';
  String street2 = '';

  String mobile = '';
  String otherNumber = '';
  String whatsapp = '';

  String email = '';
  String firstName = '';
  String middleName = '';
  String lastName = '';
  String gender = '';
  String maritalStatus = '';
  String passport = '';

  Details(Map<String, dynamic> json) {
    final tempDate = DateTime.parse(json['DOB']);

    DOB = tempDate as int;
    city = json['address']['city'] ?? 'null';
    country = json['address']['country'] ?? 'null';
    postcode = json['address']['postcode'] ?? 'null';
    state = json['address']['state'] ?? 'null';
    street1 = json['address']['street1'] ?? 'null';
    street2 = json['address']['street2'] ?? 'null';

    mobile = json['contact']['mobile'] ?? 'null';
    otherNumber = json['contact']['otherNumber'] ?? 'null';
    whatsapp = json['contact']['whatsapp'] ?? 'null';

    email = json['email'] ?? 'null';
    firstName = json['firstName'] ?? 'null';
    middleName = json['middleName'] ?? 'null';
    lastName = json['lastName'] ?? 'null';
    gender = json['gender'] ?? 'null';
    maritalStatus = json['maritalStatus'] ?? 'null';
    passport = json['passport'] ?? 'null';
  }
}

class OrgDetails {
  String org = '';
  String role = '';

  OrgDetails(Map<String, dynamic> json) {
    org = json['orgDetails']['org'] ?? 'null';
    role = json['orgDetails']['role'] ?? 'null';
  }
}
