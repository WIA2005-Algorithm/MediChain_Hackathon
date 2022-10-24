import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:jwt_decode/jwt_decode.dart';
import 'package:medichain/screens/admin/pages/create_patient.dart';
import 'package:medichain/screens/welcome/welcome_screen.dart';
import '../../../constants.dart';
import '../../doctor/models/notifications.dart';
import '../../doctor/pages/notificationPage.dart';

class AdminOverview extends StatefulWidget {
  const AdminOverview({super.key});

  @override
  State<AdminOverview> createState() => _AdminOverviewState();
}

class _AdminOverviewState extends State<AdminOverview> {
  final GlobalKey<ScaffoldState> _scaffoldKey = new GlobalKey<ScaffoldState>();

  List<NotificationResponseAPI> notifications = [];

  Future getNotifications() async {
    await ApiConstants.sendGET(
        ApiConstants.getNotificationData, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        // print(response.body);
        setState(() {
          notifications = [];
          for (var notification
              in (List<dynamic>.from(jsonDecode(response.body)))) {
            notifications.add(NotificationResponseAPI(notification));
          }
        });
        Map<String, dynamic> payload = Jwt.parseJwt(ApiConstants.accessToken);
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => NotificationPage(
                      notification: notifications,
                      ID: payload["username"],
                    )));
      } else {
        throw Exception('Failed to POST ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Notification API: ${onError.toString()}');
    });

    print("notification ${notifications.length}");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Admin's Dashboard"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(2),
          child: Text(
            '',
            style: TextStyle(color: Colors.white60),
          ),
        ),
        leading: Builder(builder: (context) {
          return GestureDetector(
            child: IconButton(
              icon: const Icon(Icons.settings),
              onPressed: () => Scaffold.of(context).openDrawer(),
            ),
          );
        }),
        actions: [
          IconButton(
              icon: Icon(
                Icons.logout,
                color: Colors.white,
              ),
              tooltip: 'Login/Registration',
              onPressed: () {
                Navigator.pushReplacement(context,
                    MaterialPageRoute(builder: (context) => WelcomeScreen()));
              })
        ],
      ),
      drawer: Drawer(
        backgroundColor: kBackgroundColor,
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            const SizedBox(
              height: 150,
              child: DrawerHeader(
                decoration: BoxDecoration(
                  color: kSecondaryColor,
                ),
                child: Text(
                  'Notifications',
                  style: TextStyle(
                    color: kBackgroundColor,
                    fontSize: 24,
                  ),
                ),
              ),
            ),
            ListTile(
              leading: Icon(Icons.notifications, color: kTextColor),
              title: Text(
                'Notifications',
                style: TextStyle(color: kTextColor),
              ),
              onTap: () {
                getNotifications();
              },
            ),
            const ListTile(
              leading: Icon(Icons.account_circle, color: kTextColor),
              title: Text(
                'Profile',
                style: TextStyle(color: kTextColor),
              ),
            ),
            const ListTile(
              leading: Icon(Icons.contact_mail, color: kTextColor),
              title: Text(
                'Contact SuperAdmin',
                style: TextStyle(color: kTextColor),
              ),
            ),
          ],
        ),
      ),
      body: OverviewBody(),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (context) => CreatePatient(
                        onBehalf: true,
                        type: 'patient',
                      )));
        },
        label: const Text(
          'Register Patient',
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

class OverviewBody extends StatefulWidget {
  const OverviewBody({super.key});

  @override
  State<OverviewBody> createState() => OverviewBodyState();
}

class OverviewBodyState extends State<OverviewBody> {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        OverviewDetails(),
      ],
    );
  }

  Row OverviewDetails() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Padding(
          padding: const EdgeInsets.all(defaultPadding / 2),
          child: Container(
            width: 170,
            padding: EdgeInsets.all(defaultPadding),
            color: kPrimaryColor,
            child: Row(
              children: [
                Icon(
                  Icons.medication,
                  color: kSecondaryColor,
                ),
                Padding(
                  padding: EdgeInsets.only(left: defaultPadding / 2),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "130",
                        textAlign: TextAlign.left,
                        style: TextStyle(
                            color: Colors.white,
                            fontFamily: kFontFamily,
                            fontSize: 15),
                      ),
                      Text(
                        "Total Patients",
                        style: TextStyle(
                            color: Colors.white,
                            fontFamily: kFontFamily,
                            fontSize: 15),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        Padding(
          padding: const EdgeInsets.all(defaultPadding),
          child: Container(
            width: 170,
            padding: EdgeInsets.all(defaultPadding),
            color: kPrimaryColor,
            child: Row(
              children: [
                Icon(
                  Icons.medical_services,
                  color: kSecondaryColor,
                ),
                Padding(
                  padding: EdgeInsets.only(left: defaultPadding / 2),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "20",
                        textAlign: TextAlign.left,
                        style: TextStyle(
                            color: Colors.white,
                            fontFamily: kFontFamily,
                            fontSize: 15),
                      ),
                      Text(
                        "Total Staff",
                        style: TextStyle(
                            color: Colors.white,
                            fontFamily: kFontFamily,
                            fontSize: 15),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
