import 'dart:convert';

import 'package:medichain/constants.dart';
import 'package:medichain/helper/registration/registeration.dart';
import 'package:medichain/screens/doctor/models/doctors.dart';

// THIS IS GETDoctor API Response
class Details extends PersonalDetails {
  Address? address;
  ContactDetails? contact;

  Details(Map<String, dynamic> json) : super.getJson() {
    address = Address.getJson(json['address']);
    contact = ContactDetails.getJson(json['contact']);

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

class EachPatient {
  String active = '';
  num assignedOn = 0;
  String dischargeOk = 'null';
  String name = '';
  PatientDetailsAPIResponse? patientData;

  EachPatient.getJson(Map<String, dynamic> json, String ptID) {
    active = json['active'];
    assignedOn = json['assignedOn'];
    dischargeOk = json['dischargeOk'] ?? "null";
    name = json['name'];
    getPatientData(ptID).then((value) {
      print("Valuie $value");
      patientData = value;
    });
  }
}

Future<PatientDetailsAPIResponse?> getPatientData(String id) async {
  final response = await DoctorConstants.sendGET(
      "${DoctorConstants.getPatientInfo}?ptID=$id", <String, String>{});
  return PatientDetailsAPIResponse(jsonDecode(response.body));
}

class AssociatedPatients {
  Map<String, EachPatient> patients = <String, EachPatient>{};
  AssociatedPatients(Map<String, dynamic> json) {
    json.forEach((key, value) {
      patients[key] = EachPatient.getJson(value, key);
    });
  }
}

class DoctorDetailsAPIResponse {
  List<String>? active;
  AssociatedPatients? associatedPatients;
  Details? details;
  OrgDetails? orgDetails;

  DoctorDetailsAPIResponse(Map<String, dynamic> json) {
    active = List<String>.from(json['active']);
    associatedPatients = AssociatedPatients(json['associatedPatients']);
    details = Details(json['details']);
    orgDetails = OrgDetails(json["orgDetails"]);
  }
}
