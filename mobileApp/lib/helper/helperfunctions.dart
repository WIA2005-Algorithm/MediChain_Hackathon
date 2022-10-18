import 'package:medichain/constants.dart';
import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:dio/dio.dart';

class LoginAccess {
  final String accessToken;
  final String refreshToken;
  static String organizationID = "";
  static int isOnBehalf = -1;

  const LoginAccess({required this.accessToken, required this.refreshToken});

  factory LoginAccess.fromJson(Map<String, dynamic> json) {
    ApiConstants.accessToken = json['session']['accessToken'];
    ApiConstants.refreshToken = json['session']['refreshToken'];
    ApiConstants.orgranizationID = json['org'] ?? "";
    ApiConstants.isOnBehalf = json['isOnBehalf'];

    return LoginAccess(
      accessToken: json['session']['accessToken'],
      refreshToken: json['session']['refreshToken'],
    );
  }
}









// /// More examples see https://github.com/flutterchina/dio/tree/master/example
// void main() async {
//   var dio = Dio();
//   var URL = "http://172.27.238.53:8080/api/superuser/login";
//   Map<String, String> customHeaders = {"content-type": "application/json"};
//   String BODY = jsonEncode(
//       <String, String>{"username": "SuperAdmin", "password": "SuperAdminpw"});

//   http
//       .post(Uri.parse(URL), headers: customHeaders, body: BODY)
//       .then((response) {
//     print('Response : ${response}');
//     print('Response Body : ${jsonDecode(response.body)}');
//     print('Response Code : ${response.statusCode}');
//   }).catchError((onError) {
//     print('Error : ${onError.toString()}');
//   });
// }

// // add check user login type later
// Future fetchLoginInfo(String username, String password) async {
//   var URL = "http://172.27.238.53:8080/api/superuser/login";

//   Map<String, String> customHeaders = {"content-type": "application/json"};
//   String BODY = jsonEncode(
//       <String, String>{"username": "SuperAdmin", "password": "SuperAdminpw"});

//   print('Attemp to post');
//   return http.post(Uri.parse(URL), headers: customHeaders, body: BODY);
// }