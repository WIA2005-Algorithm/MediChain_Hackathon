import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiConstants {
  // Login details constants
  static String userName = '';
  static String accessToken = '';
  static String refreshToken = '';

  static String baseURL = "http://172.27.237.56:8080/api";
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
    if (queryParams.keys.isEmpty) {
      queryParams.forEach((key, value) {
        params += "$key=$value";
      });
    }
    // print("Sending GET request to : $URL");
    Map<String, String> headers = ApiConstants.getHeaders();
    // print("Sending GET request to : $URL");
    // print("With headers ${headers.toString()}");
    // print("With Query Parameters ${queryParams.toString()}");
    return http.get(Uri.parse("$URL${queryParams.keys.isEmpty ? "" : params}"),
        headers: headers);
  }

  static Future sendDELETE(String URL) {
    //   print("Sending DELETE request to : $URL");
    Map<String, String> headers = ApiConstants.getHeaders();
    //   print("Sending DELETE request to : $URL");
    //   print("With headers ${headers.toString()}");
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
