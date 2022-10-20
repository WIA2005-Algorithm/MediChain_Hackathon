import 'package:intl/intl.dart';

class NetworkInfo {
  String id = '';
  String networkName = '';
  String networkID = '';
  String netAddress = '';
  List<Organisations> organizations = [];
  int networkCode = 0;
  String networkMessage = '';
  String createdAt = '';
  String networkDescription = '';

  static int hospitalCount = 0;

  NetworkInfo(Map<String, dynamic> json) {
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
    organizations = [];
    for (var hospital in orgs) {
      organizations.add(Organisations(hospital));
    }
    hospitalCount = organizations.length;
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
    final tempDate = DateTime.parse(json['createdAt']);

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
    createdAt =
        "${DateFormat.MMMM().format(tempDate)} ${tempDate.day}, ${tempDate.year}";
    updatedAt = json['updatedAt'] ?? 'null';
  }
}

class AllBlockChainNetworksResponse {
  String _id = '';
  String networkName = '';
  String networkID = '';
  String netAddress = '';
  int networkCode = 0;
  String networkMessage = '';
  String createdAt = '';
  String networkDescription = '';
  int hospitalCount = 0;

  AllBlockChainNetworksResponse(Map<String, dynamic> json) {
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
