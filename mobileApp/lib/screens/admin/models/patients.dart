import 'dart:convert';

class Patient {
  List<String> activeList = [
    "Watched",
    "Waiting For Discharge",
    "Waiting To Be Assigned",
    "Not Patients"
  ];

  // Common Details
  String active = '';
  Map<String, dynamic> associatedDoctors = {};
  List checkIn = [];
  List checkOut = [];
  Map<String, dynamic> details = {};
  Map<String, dynamic> orgDetails = {};
  Map<String, dynamic> secretSharingPair = {};
  int patientCount = 0;

  // Patient Details
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

  // Org Details
  String org = '';
  String role = '';

  Patient(Map<String, dynamic> json) {
    active = json['active'] ?? 'null';
    associatedDoctors = json['associatedDoctors'] ?? 'null';
    checkIn.add(json['checkIn'] ?? 'null');
    checkOut.add(json['checkOut'] ?? 'null');
    details = json['details'] ?? 'null';
    orgDetails = json['orgDetails'] ?? 'null';
    secretSharingPair = json['secretSharingPair'] ?? 'null';

    // Patient Details
    // final tempDate = DateTime.parse(json['DOB'].toString());

    // DOB = tempDate as int;
    city = details['address']['city'] ?? 'null';
    country = details['address']['country'] ?? 'null';
    postcode = details['address']['postcode'] ?? 'null';
    state = details['address']['state'] ?? 'null';
    street1 = details['address']['street1'] ?? 'null';
    street2 = details['address']['street2'] ?? 'null';

    mobile = details['contact']['mobile'] ?? 'null';
    otherNumber = details['contact']['otherNumber'] ?? 'null';
    whatsapp = details['contact']['whatsapp'] ?? 'null';

    email = details['email'] ?? 'null';
    firstName = details['firstName'] ?? 'null';
    middleName = details['middleName'] ?? 'null';
    lastName = details['lastName'] ?? 'null';
    gender = details['gender'] ?? 'null';
    maritalStatus = details['maritalStatus'] ?? 'null';
    passport = details['passport'] ?? 'null';

    org = orgDetails['org'] ?? 'null';
    role = orgDetails['role'] ?? 'null';
    // Details(details);
    // OrgDetails(orgDetails);
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
    // final tempDate = DateTime.parse(json['DOB'].toString());

    // DOB = tempDate as int;
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
    org = json['org'] ?? 'null';
    role = json['role'] ?? 'null';
  }
}
