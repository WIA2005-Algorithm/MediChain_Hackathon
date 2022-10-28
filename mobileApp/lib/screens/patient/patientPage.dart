import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:jwt_decode/jwt_decode.dart';
import 'package:medichain/screens/doctor/models/doctors.dart';

import '../../constants.dart';
import '../doctor/models/notifications.dart';
import '../doctor/pages/notificationPage.dart';
import '../welcome/welcome_screen.dart';

class PatientPage extends StatefulWidget {
  const PatientPage({super.key});

  @override
  State<PatientPage> createState() => _PatientPageState();
}

class _PatientPageState extends State<PatientPage> {
  bool _inProgress = false;

  // Patient? patientInfo;
  PatientDetailsAPIResponse? patientDetails;

  Future<void> getPatientInfo() async {
    setState(() {
      _inProgress = true;
    });
    // print(patientInfo!.passport);
    await PatientConstants.sendGET(
        PatientConstants.getPatientInfo, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        print(response.body);
        // Work on getting the patient ID
        setState(() {
          // patientInfo = Patient(jsonDecode(response.body));
          patientDetails = PatientDetailsAPIResponse(jsonDecode(response.body));
        });
      } else {
        throw Exception('Failed to GET ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Partients API: ${onError.toString()}');
    });
    setState(() {
      _inProgress = false;
    });

    print(
        "First name: ${patientDetails!.details!.firstName} ${patientDetails!.associatedDoctors!.doctors.values.toList().length}");
  }

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
                    patient: patientDetails)));
      } else {
        throw Exception('Failed to POST ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Notification API: ${onError.toString()}');
    });

    print("notification ${notifications.length}");
  }

  @override
  void initState() {
    // TODO: implement initState
    getPatientInfo();
    super.initState();
  }

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Patient's Dashboard"),
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
                  'Profile',
                  style: TextStyle(color: kTextColor),
                ),
                onTap: () {}),
            ListTile(
                leading: Icon(Icons.notifications, color: kTextColor),
                title: Text(
                  'Notifications',
                  style: TextStyle(color: kTextColor),
                ),
                onTap: () {
                  getNotifications();
                }),
            const Divider(
              height: 20,
              thickness: 3,
              indent: defaultPadding,
              endIndent: defaultPadding,
              color: Colors.white70,
            ),
          ],
        ),
      ),
      body: _inProgress
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: EdgeInsets.all(defaultPadding),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      SizedBox(width: defaultPadding),
                      Icon(
                        Icons.person,
                        size: 40,
                        color: Colors.white,
                      ),
                      SizedBox(width: defaultPadding),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "First Name: ${patientDetails!.details!.firstName}",
                            style: kParagaphTextStyle,
                          ),
                          patientDetails!.details!.middleName == "UNDEFINED"
                              ? SizedBox()
                              : Text(
                                  "Middle Name: ${patientDetails!.details!.middleName}",
                                  style: kParagaphTextStyle,
                                ),
                          Text(
                            "Last Name:  ${patientDetails!.details!.lastName}",
                            style: kParagaphTextStyle,
                          ),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(height: defaultPadding),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      SizedBox(width: defaultPadding),
                      Icon(
                        Icons.phone,
                        size: 40,
                        color: Colors.white,
                      ),
                      SizedBox(width: defaultPadding),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text("Main:  ${patientDetails!.details!.mobile}",
                              style: kParagaphTextStyle),
                          Text(
                              "Whatsapp:  ${patientDetails!.details!.whatsapp}",
                              style: kParagaphTextStyle),
                          Text(
                              "Alternate:  ${patientDetails!.details!.otherNumber}",
                              style: kParagaphTextStyle),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(height: defaultPadding),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      SizedBox(width: defaultPadding),
                      Icon(
                        Icons.gps_fixed,
                        size: 40,
                        color: Colors.white,
                      ),
                      SizedBox(width: defaultPadding),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "${patientDetails!.details!.street1},",
                              style: kParagaphTextStyle,
                              textAlign: TextAlign.left,
                            ),
                            Text(
                              "${patientDetails!.details!.street2},",
                              style: kParagaphTextStyle,
                              textAlign: TextAlign.left,
                            ),
                            Text(
                              "${patientDetails!.details!.city}.",
                              style: kParagaphTextStyle,
                              textAlign: TextAlign.left,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: defaultPadding),
                  const Divider(
                    height: 20,
                    thickness: 3,
                    indent: defaultPadding,
                    endIndent: defaultPadding,
                    color: Colors.white70,
                  ),
                  SizedBox(height: defaultPadding),
                  const Text("Associated Doctor", style: kSectionTextStyle),
                  const SizedBox(height: defaultPadding),
                  patientDetails!.associatedDoctors!.doctors.values
                              .toList()
                              .length ==
                          "{}"
                      ? Text(
                          "Doctor has not been assigned \nto this patient",
                          style: kParagaphTextStyle,
                        )
                      : Column(
                          children: [
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemBuilder: (context, index) {
                                return Container(
                                  padding: EdgeInsets.symmetric(
                                      vertical: defaultPadding / 3),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.start,
                                    children: [
                                      SizedBox(width: defaultPadding),
                                      Icon(
                                        Icons.medical_information,
                                        size: 40,
                                        color: Colors.white,
                                      ),
                                      SizedBox(width: defaultPadding),
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            "Name: ${patientDetails!.associatedDoctors!.doctors.values.toList()[index].name}",
                                            style: kParagaphTextStyle,
                                            textAlign: TextAlign.start,
                                          ),
                                          // Text(
                                          //     "Assignation date: ${widget.patient.checkIn}",
                                          //     style: kParagaphTextStyle),
                                          Text(
                                            "Department: ${patientDetails!.associatedDoctors!.doctors.values.toList()[index].department}",
                                            style: kParagaphTextStyle,
                                            textAlign: TextAlign.start,
                                          ),
                                          Text(
                                            "Status: ${patientDetails!.associatedDoctors!.doctors.values.toList()[index].active[0]} and ${patientDetails!.associatedDoctors!.doctors.values.toList()[index].active[1]}",
                                            style: kParagaphTextStyle,
                                            textAlign: TextAlign.start,
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                );
                              },
                              itemCount: patientDetails!
                                  .associatedDoctors!.doctors.values
                                  .toList()
                                  .length,
                            ),
                          ],
                        ),
                ],
              ),
            ),
    );
  }
}
