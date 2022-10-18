import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';

import 'screens/superAdmin/models/network_info.dart';

const kBackgroundColor = Color.fromARGB(255, 1, 30, 59);
const kSecondaryColor = Color.fromARGB(255, 253, 179, 0);
const kPrimaryColor = Color.fromARGB(255, 11, 25, 42);
const kAppBarColor = Color.fromARGB(255, 40, 53, 66);
const kPrimaryTextColor = Colors.black;
const kTextColor = Colors.white;
const kSecondaryTextColor = Colors.white70;
const kCustomBlue = Color.fromARGB(255, 1, 155, 239);

const kFontFamily = "Inter";
const kTextStyle = TextStyle(
    fontWeight: FontWeight.normal,
    color: Colors.white,
    fontSize: 40,
    fontFamily: 'Inter');
const kSectionTextStyle = TextStyle(
    fontWeight: FontWeight.bold,
    color: Colors.white,
    fontSize: 20,
    fontFamily: 'Inter');

const String kApibaseURL = "http://172.27.231.239:8080/api";

// const kPrimaryColor = Color(0xFF6F35A5);
const kPrimaryLightColor = Color(0xFFF1E6FF);

const double defaultPadding = 16.0;

class ApiConstants {
  // Login details constants
  static String userName = '';
  static String accessToken = '';
  static String refreshToken = '';
  static int isOnBehalf = -1;
  static String orgranizationID = '';

  static String baseURL = kApibaseURL;
  static Map<String, String> getHeaders() {
    return <String, String>{
      "content-type": "application/json",
      "Authorization": accessToken // GET Authorization token from the local d
    };
  }

  static Future sendPOST(String URL, Map<String, String> body) {
    print("Sending Post request to : $URL");
    Map<String, String> headers = getHeaders();
    print("Sending POST request to : $URL");
    print("With headers ${headers.toString()}");
    print("With body ${body.toString()}");
    return http.post(Uri.parse("$URL"),
        headers: headers, body: jsonEncode(body));
  }

  static Future sendGET(String URL, Map<String, String> queryParams) {
    String params = "?";
    if (queryParams.keys.isNotEmpty) {
      queryParams.forEach((key, value) {
        params += "$key=$value";
      });
    }
    print("Sending GET request to : $URL");
    Map<String, String> headers = ApiConstants.getHeaders();
    print("Sending GET request to : $URL");
    print("With headers ${headers.toString()}");
    print("With Query Parameters ${queryParams.toString()}");
    return http.get(Uri.parse("$URL${queryParams.keys.isEmpty ? "" : params}"),
        headers: headers);
  }

  static Future sendDELETE(String URL) {
    print("Sending DELETE request to : $URL");
    Map<String, String> headers = ApiConstants.getHeaders();
    print("Sending DELETE request to : $URL");
    print("With headers ${headers.toString()}");
    return http.delete(Uri.parse("$URL"), headers: headers);
  }
}

class SuperAdminConstants {
  static String SuperAdminBase = "${ApiConstants.baseURL}/superuser/";
  static String loginAuth = "login";
  static String createNetwork = "create/network";
  static String createOrganisation = "create/organization";
  static String startNetwork = "network/start";
  static String stopNetwork = "network/stop";
  static String NetworkCount = "network/count";
  static String AllNetworks = "network/all";
  static String NetworkStatus = "network/status";
  static String NetworkExists = "network/exists";
  static String deleteOrganization = "organizations";
  static String enrollAdmin = "organizations/enroll";

  static Future sendPOST(String URL, Map<String, String> body) {
    return ApiConstants.sendPOST("$SuperAdminBase$URL", body);
  }

  static Future sendGET(String URL, Map<String, String> queryParams) {
    return ApiConstants.sendGET("$SuperAdminBase$URL", queryParams);
  }

  static Future sendDELETE(String URL) {
    return ApiConstants.sendDELETE("$SuperAdminBase$URL");
  }
}

class DoctorConstants {
  static String AdminBase = "${ApiConstants.baseURL}/doctor/";
  static String loginAuth = "login";
  //
  static String getHospitalsEnrolled = "getEnrolledHospitals";
  static String addNewPatientOrDoctorAPI = "addNewPatient/onBehalf";
  static String loginOnBehalfOF = "addNewPatient/onBehalf/Change";
  static String patientLoginAuth = "network/stop";
  static String doctorLoginAuth = "login";
  static String getAllPatientData = "getAllPatients";
  static String getAllDoctorData = "getAllDoctors";
  static String CheckInPatient = "checkInPatient";
  static String AssignDoctor = "assignPatient";
  static String Discharge = "checkOutPatient";
  static String PatientDataStatsCheckInCheckOut =
      "getPatientCheckInCheckOutStats";
  static String getPatientDetails = "getPatientDetails";
  static String acceptExternalDoctorRequest = "acceptExternalDoctorRequest";
  static String denyExternalDoctorRequest = "denyExternalDoctorRequest";
  static String getPatientDataStatsTimeLine = "getPatientDataStatsTimeLine";

  static Future sendPOST(String URL, Map<String, String> body) {
    return ApiConstants.sendPOST("$AdminBase$URL", body);
  }

  static Future sendGET(String URL, Map<String, String> queryParams) {
    return ApiConstants.sendGET("$AdminBase$URL", queryParams);
  }

  static Future sendDELETE(String URL) {
    return ApiConstants.sendDELETE("$AdminBase$URL");
  }
}

class AdminConstants {
  static String AdminBase = "${ApiConstants.baseURL}/entity/";
  static String loginAuth = "login";
  static String getHospitalsEnrolled = "getEnrolledHospitals";
  static String addNewPatientOrDoctorAPI = "addNewPatient/onBehalf";
  static String loginOnBehalfOF = "addNewPatient/onBehalf/Change";
  static String patientLoginAuth = "login";
  static String doctorLoginAuth = "login";
  static String getAllPatientData = "getAllPatients";
  static String getAllDoctorData = "getAllDoctors";
  static String CheckInPatient = "checkInPatient";
  static String AssignDoctor = "assignPatient";
  static String Discharge = "checkOutPatient";
  static String PatientDataStatsCheckInCheckOut =
      "getPatientCheckInCheckOutStats";
  static String getPatientDetails = "getPatientDetails";
  static String acceptExternalDoctorRequest = "acceptExternalDoctorRequest";
  static String denyExternalDoctorRequest = "denyExternalDoctorRequest";
  static String getPatientDataStatsTimeLine = "getPatientDataStatsTimeLine";

  static Future sendPOST(String URL, Map<String, String> body) {
    return ApiConstants.sendPOST("$AdminBase$URL", body);
  }

  static Future sendGET(String URL, Map<String, String> queryParams) {
    return ApiConstants.sendGET("$AdminBase$URL", queryParams);
  }

  static Future sendDELETE(String URL) {
    return ApiConstants.sendDELETE("$AdminBase$URL");
  }
}
