import 'dart:convert';

import 'package:medichain/helper/registration/registeration.dart';
import 'package:medichain/screens/admin/models/patients.dart';

class EachDoctor {
  List<String> active = [];
  num assignedOn = 0;
  num deAssigned = 0;
  String department = "";
  String dischargeOk = "null";
  String email = "";
  String name = "";
  String note = "";

  EachDoctor.getJson(Map<String, dynamic> json) {
    active = List<String>.from(json["active"]);
    assignedOn = json["assignedOn"] ?? 0;
    deAssigned = json["deAssigned"] ?? 0;
    department = json["department"] ?? 'null';
    dischargeOk = json["dischargeOk"] ?? 'null';
    email = json["email"] ?? 'null';
    name = json["name"] ?? 'null';
    note = json["note"] ?? 'null';
  }
}

class AssociatedDoctors {
  Map<String, EachDoctor> doctors = <String, EachDoctor>{};
  AssociatedDoctors(Map<String, dynamic> json) {
    json.forEach((key, value) {
      doctors[key] = EachDoctor.getJson(value);
    });
  }
}

class PatientDetailsAPIResponse {
  String active = "";
  List<num> checkIn = [];
  List<num> checkOut = [];
  OrgDetails? orgDetails;
  Details? details;
  AssociatedDoctors? associatedDoctors;

  PatientDetailsAPIResponse(Map<String, dynamic> json) {
    print("HELLO");
    active = json["active"] ?? "";
    print("HELLO - 2");
    checkIn = List<num>.from(json["checkIn"]);
    checkOut = List<num>.from(json["checkOut"]);
    orgDetails = OrgDetails(json["orgDetails"]);
    details = Details(json["details"]);
    associatedDoctors = AssociatedDoctors(json["associatedDoctors"]);
  }
}
