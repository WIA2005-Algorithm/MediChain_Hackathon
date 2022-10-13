import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/framework.dart';

class AdminOverview extends StatefulWidget {
  const AdminOverview({super.key});

  @override
  State<AdminOverview> createState() => _AdminOverviewState();
}

class _AdminOverviewState extends State<AdminOverview> {
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

  // String? value = await ApiConstants.getSharedValue("accessToken");

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    // use shared access or create a constant class to store the access token widely
  }

  @override
  Widget build(BuildContext context) {
    print(
        "\nAccess token : ${ApiConstants.accessToken} \nRefresh token : ${ApiConstants.refreshToken}");

    return ApiConstants.accessToken.isEmpty
        ? CircularProgressIndicator()
        : Container(
            padding: EdgeInsets.all(8.0),
            child: Text(ApiConstants.accessToken),
          );
  }
}
