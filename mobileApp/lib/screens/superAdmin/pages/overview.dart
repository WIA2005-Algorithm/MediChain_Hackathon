import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/constants.dart';
import 'package:medichain/screens/superAdmin/pages/create_network.dart';
import 'package:medichain/screens/superAdmin/pages/networkDetails.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../models/network_info.dart';

class SuperAdminOverview extends StatefulWidget {
  const SuperAdminOverview({super.key});

  @override
  State<SuperAdminOverview> createState() => _SuperAdminOverviewState();
}

class _SuperAdminOverviewState extends State<SuperAdminOverview> {
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    // use shared access or create a constant class to store the access token widely
  }

  @override
  Widget build(BuildContext context) {
    return ApiConstants.accessToken.isEmpty
        ? const CircularProgressIndicator()
        : Scaffold(
            appBar: AppBar(
              centerTitle: true,
              title: const Text("Available Networks"),
              elevation: 0,
              backgroundColor: kBackgroundColor,
              bottom: const PreferredSize(
                preferredSize: Size.fromHeight(2),
                child: Text(
                  'Create a new network or clock on available network',
                  style: TextStyle(color: Colors.white60),
                ),
              ),
            ),
            body: const NetworkDetails(),
            floatingActionButton: FloatingActionButton.extended(
              onPressed: () {
                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => const CreateNetwork()));
              },
              label: const Text(
                'Create',
                style: TextStyle(color: kPrimaryColor),
              ),
              icon: const Icon(
                Icons.add,
                color: kPrimaryColor,
              ),
              backgroundColor: kSecondaryColor,
            ),
          );
  }
}
