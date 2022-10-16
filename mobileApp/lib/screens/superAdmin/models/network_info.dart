import 'dart:convert';

import 'package:intl/intl.dart';

class NetworkInfo {
  static String id = '';
  static String networkName = '';
  static String networkID = '';
  static String netAddress = '';
  static List<Organisations> organizations = [];

  static int networkCount = 0;
  static int networkCode = 0;
  static String networkMessage = '';
  static String createdAt = '';
  static String networkDescription = '';

  static int hospitalCount = 0;

  static void getCount(Map<String, dynamic> json) {
    networkCount = json['count'];
    // print('Network count: $networkCount');
  }

  static fromJson(Map<String, dynamic> json) {
    List<dynamic> orgs = json['Organizations'];
    final tempDate = DateTime.parse(json['createdAt']);
    id = json['_id'];
    networkName = json['Name'];
    networkID = json['NetID'];
    netAddress = json['Address'];
    networkCode = json['Status']['code'];
    networkMessage = json['Status']['message'];
    networkDescription = json['Status']['description'];
    createdAt =
        "${DateFormat.MMMM().format(tempDate)} ${tempDate.day}, ${tempDate.year}";
    hospitalCount = organizations.length;
    organizations = [];
    for (var hospital in orgs) {
      organizations.add(Organisations(hospital));
    }
    // print(organizations.map((value) {
    //   print("Value: $value");
    //   Organisations.fromJson(value);
    // }));
    // print(Organisations.orgFullName);
  }
}

class Organisations {
  String orgId = '';
  String orgFullName = '';
  String orgName = '';
  String adminID = '';
  String adminpassword = '';

  String country = '';
  String state = '';
  String location = '';
  String orgType = '';
  int enrolled = 0;
  String createdAt = '';
  String updatedAt = '';

  //correct the variables for json organisation
  Organisations(Map<String, dynamic> json) {
    orgId = json['_id'] ?? 'null';
    orgFullName = json['FullName'] ?? 'null';
    orgName = json['Name'] ?? 'null';
    adminID = json['AdminID'] ?? 'null';
    adminpassword = json['Password'] ?? 'null';

    country = json['Country'] ?? 'null';
    state = json['State'] ?? 'null';
    location = json['Location'] ?? 'null';
    orgType = json['OrganizationType'] ?? 'null';
    enrolled = json['Enrolled'] ?? 0;

    createdAt = json['createdAt'] ?? 'null';
    updatedAt = json['updatedAt'] ?? 'null';
  }
}

class AllBlockChainNetworksResponse {
  static String _id = '';
  static String networkName = '';
  static String networkID = '';
  static String netAddress = '';
  static int networkCode = 0;
  static String networkMessage = '';
  static String createdAt = '';
  static String networkDescription = '';
  static int hospitalCount = 0;
  static int networkCount = 0;

  static void getCount(Map<String, dynamic> json) {
    networkCount = json['count'];
    // print('Network count: $networkCount');
  }

  static fromJson(Map<String, dynamic> json) {
    final tempDate = DateTime.parse(json['createdAt']);
    _id = json['_id'];
    networkName = json['Name'];
    networkID = json['NetID'];
    netAddress = json['Address'];
    networkCode = json['Status']['code'];
    networkMessage = json['Status']['message'];
    networkDescription = json['Status']['description'];
    createdAt =
        "${DateFormat.MMMM().format(tempDate)} ${tempDate.day}, ${tempDate.year}";
    hospitalCount = json["Organizations"].length;
  }
}
