import 'dart:convert';

class Doctor {
  List<String> activeList = [
    "Active",
    "Unoccupied",
  ];

  // Common Details
  List active = [];
  List checkOut = [];

  Map<String, dynamic> associatedPatients = {};
  Map<String, dynamic> details = {};
  Map<String, dynamic> orgDetails = {};
  Map<String, dynamic> secretSharingPair = {};
  int patientCount = 0;

  // Doctor Details
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

  String department = '';
  String email = '';
  String firstName = '';
  String middleName = '';
  String lastName = '';
  String fullName = '';
  String gender = '';
  String maritalStatus = '';
  String passport = '';

  // Org Details
  String org = '';
  String role = '';

  Doctor(Map<String, dynamic> json) {
    json['active'] != <String, dynamic>{}
        ? json['active'].forEach((element) {
            active.add(element);
          })
        : null;

    associatedPatients = json['associatedPatients'] ?? <String, dynamic>{};
    details = json['details'] ?? <String, dynamic>{};
    orgDetails = json['orgDetails'] ?? <String, dynamic>{};
    secretSharingPair = json['secretSharingPair'] ?? <String, dynamic>{};
    department = details['department'] ?? 'null';
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
    fullName = firstName + " " + middleName + " " + lastName;
    gender = details['gender'] ?? 'null';
    maritalStatus = details['maritalStatus'] ?? 'null';
    passport = details['passport'] ?? 'null';

    org = orgDetails['org'] ?? 'null';
    role = orgDetails['role'] ?? 'null';
  }
}
