import 'dart:convert';

import 'package:intl/intl.dart';

class NotificationData {
  String patientID = '';
  String patientOrg = '';
  String FromDoc = '';
  String FromOrg = '';
  String FromName = '';
  String UID = '';

  NotificationData();
  NotificationData.getJson(Map<String, dynamic> json) {
    patientID = json['PatientID'] ?? "";
    patientOrg = json['PatientOrg'] ?? "";
    FromDoc = json['FromDoc'] ?? "";
    FromOrg = json['FromOrg'] ?? "";
    FromName = json['FromName'] ?? "";
    UID = json['UID'] ?? "";
  }

  Map<String, dynamic> toJson() {
    return {
      "patientID": patientID,
      "patientOrg": patientOrg,
      "FromDoc": FromDoc,
      "FromOrg": FromOrg,
      "FromName": FromName,
      "UID": UID,
    };
  }
}

class NotificationResponseAPI {
  String From = '';
  String NotificationAccept = '';
  String NotificationDeny = '';
  String NotificationString = '';
  bool Read = false;
  String To = '';
  String createdAt = '';
  NotificationData? Data;
  String id = '';
  String selectedEMR = '';

  NotificationResponseAPI(Map<String, dynamic> json) {
    id = json["_id"];
    final temp = DateTime.parse(json["createdAt"]).toLocal();
    From = json['From'] != "null"
        ? "${json['From'].toString().split("#")[0]}, ${json['From'].toString().split("#")[1]}"
        : "Web System";
    print("hello -- 1234");
    NotificationAccept = json['NotificationAccept'] ?? "";
    print("hello -- 12345");
    NotificationDeny = json['NotificationDeny'];
    print("hello -- 123456");
    NotificationString = json['NotificationString'] ?? "";
    print("hello -- 1234567");
    Read = json['Read'] ?? false;
    print("hello -- 12345678");
    To = json['To'] ?? "";
    print("hello -- 123456789");
    createdAt =
        "${DateFormat.MMMM().format(temp)} ${temp.day}, ${temp.year} at ${DateFormat.jm().format(temp)}";
    print("hello -- 12345678910");
    // How to check if data exists or not?
    // Data.FromDoc == '' ? isEmpty : isNotEmpty
    try {
      Data = NotificationData.getJson(jsonDecode(json['Data']));
    } catch (error) {
      print("Error Encountered which is ignored :- $error");
    }
    print("hello -- DONE");
    selectedEMR = json["selectedEMR"] ?? '';
  }

  Map<String, dynamic> toJson() {
    return {
      "From": From,
      "NotificationAccept": NotificationAccept,
      "NotificationDeny": NotificationDeny,
      "NotificationString": NotificationString,
      "Read": Read.toString().toLowerCase() == 'true',
      "To": To,
      "createdAt": createdAt,
      "Data": jsonEncode(Data),
      "_id": id,
      "selectedEMR": selectedEMR
    };
  }
}

class Requests {
  NotificationData? Data = NotificationData();
  String CommentToAccessOrDeny = '';
  String note = '';
  String RID = '';
  String Status = '';
  String createdAt = '';
  String id = '';

  Requests(Map<String, dynamic> json) {
    id = json["_id"];
    final temp = DateTime.parse(json["createdAt"]).toLocal();
    try {
      Data = NotificationData.getJson(jsonDecode(json['Data']));
    } catch (error) {
      print("Error Encountered which is ignored :- $error");
    }
    CommentToAccessOrDeny = json['CommentToAccessOrDeny'] ?? '';
    note = json['note'] ?? '';
    RID = json['RID'] ?? '';
    Status = json['Status'] ?? '';
    print("pass 3");

    createdAt =
        "${DateFormat.MMMM().format(temp)} ${temp.day}, ${temp.year} at ${DateFormat.jm().format(temp)}";
  }
}
