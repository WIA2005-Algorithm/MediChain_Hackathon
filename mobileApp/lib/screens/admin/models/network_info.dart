import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:http/http.dart';

// network == 'Medi_Chain'
Future<NetworkInfo> fetchNetwork(String network) async {
  final response = await http.get(Uri.parse(
      'http://localhost:8080/api/superuser/network/exists?networkName=${network}'));

  if (response.statusCode == 200) {
    // If the server did return a 200 OK response,
    // then parse the JSON.
    return NetworkInfo.fromJson(jsonDecode(response.body), response);
  } else {
    // If the server did not return a 200 OK response,
    // then throw an exception.
    throw Exception('Failed to load network details');
  }
}

class NetworkInfo {
  final String id;
  final String networkName;
  final String networkID;
  final String netAddress;

  final int networkCode;
  final String networkMessage;
  final String networkDescription;

  factory NetworkInfo.fromJson(Map<String, dynamic> json, Response response) {
    return NetworkInfo(
      id: json['_id'],
      networkName: json['Name'],
      networkID: json['NetID'],
      netAddress: json['Address'],
      // Find how to code the status json
      networkCode: response.statusCode,
      networkMessage: json['description'],
      networkDescription: json['description'],
    );
  }

  NetworkInfo({
    required this.id,
    required this.networkName,
    required this.networkID,
    required this.netAddress,
    required this.networkCode,
    required this.networkMessage,
    required this.networkDescription,
  });
}

class Organisations {
  final String orgId = '';
  final String orgFullName = '';
  final String orgName = '';
  final String adminID = '';
  final String adminpassword = '';

  final String country = '';
  final String state = '';
  final String location = '';
  final String orgType = '';
  final int enrolled = 0;
  final String createdAt = '';
  final String updatedAt = '';
  final String POPORT = '';
  final String CAPORT = '';
}
