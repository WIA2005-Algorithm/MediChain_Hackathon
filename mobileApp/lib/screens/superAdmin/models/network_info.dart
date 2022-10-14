import 'package:intl/intl.dart';

class NetworkInfo {
  static String id = '';
  static String networkName = '';
  static String networkID = '';
  static String netAddress = '';
  static List organizations = [];
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

  static void fromJson(Map<String, dynamic> json) {
    final tempDate = DateTime.parse(json['createdAt']);
    id = json['_id'];
    networkName = json['Name'];
    networkID = json['NetID'];
    netAddress = json['Address'];
    organizations = json['Organizations'];
    networkCode = json['Status']['code'];
    networkMessage = json['Status']['message'];
    networkDescription = json['Status']['description'];
    createdAt =
        "${DateFormat.MMMM().format(tempDate)} ${tempDate.day}, ${tempDate.year}";
    hospitalCount = organizations.length;
  }
}

class Organisations {
  static String orgId = '';
  static String orgFullName = '';
  static String orgName = '';
  static String adminID = '';
  static String adminpassword = '';

  static String country = '';
  static String state = '';
  static String location = '';
  static String orgType = '';
  static int enrolled = 0;
  static String createdAt = '';
  static String updatedAt = '';
  static String POPORT = '';
  static String CAPORT = '';

  //correct the variables for json organisation
  static void fromJson(Map<String, dynamic> json) {
    orgId = json['_id'];
    orgFullName = json['Name'];
    orgName = json['NetID'];
    adminID = json['Address'];
    adminpassword = json['Organizations'];

    country = json['_id'];
    state = json['Name'];
    location = json['NetID'];
    orgType = json['Address'];
    enrolled = json['Organizations'];

    createdAt = json['_id'];
    updatedAt = json['Name'];
    orgName = json['NetID'];
    POPORT = json['Address'];
    CAPORT = json['Organizations'];
  }
}
