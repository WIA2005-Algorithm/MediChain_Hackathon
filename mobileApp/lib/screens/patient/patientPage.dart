import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/patient/models/patients.dart';

import '../../constants.dart';
import '../welcome/welcome_screen.dart';

class PatientPage extends StatefulWidget {
  const PatientPage({super.key});

  @override
  State<PatientPage> createState() => _PatientPageState();
}

class _PatientPageState extends State<PatientPage> {
  bool _inProgress = false;

  Patient? patientInfo;

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
        patientInfo = Patient(jsonDecode(response.body));
      } else {
        throw Exception('Failed to GET ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Partients API: ${onError.toString()}');
    });
    setState(() {
      _inProgress = false;
    });
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
            const Divider(
              height: 20,
              thickness: 3,
              indent: defaultPadding,
              endIndent: defaultPadding,
              color: Colors.white70,
            ),
            ListTile(
                leading: Icon(Icons.contact_mail, color: kTextColor),
                title: Text(
                  'Take Action',
                  style: TextStyle(color: kTextColor),
                ),
                onTap: () {}),
          ],
        ),
      ),
      body: _inProgress
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
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
                            "First Name: ${patientInfo!.firstName}",
                            style: kParagaphTextStyle,
                          ),
                          // widget.patient.middleName == "UNDEFINED"
                          //     ? SizedBox()
                          // :
                          Text(
                            "Middle Name: ${patientInfo!.middleName}",
                            style: kParagaphTextStyle,
                          ),
                          Text(
                            "Last Name:  ${patientInfo!.lastName}",
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
                          Text("Main:  ${patientInfo!.mobile}",
                              style: kParagaphTextStyle),
                          Text("Whatsapp:  ${patientInfo!.whatsapp}",
                              style: kParagaphTextStyle),
                          Text("Alternate:  ${patientInfo!.otherNumber}",
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
                              " ${patientInfo!.street1}",
                              style: kParagaphTextStyle,
                              textAlign: TextAlign.left,
                            ),
                            Text(
                              " ${patientInfo!.street2}",
                              style: kParagaphTextStyle,
                              textAlign: TextAlign.left,
                            ),
                            Text(
                              " ${patientInfo!.city}",
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
                  // widget.patient.associatedDoctors.toString() == "{}"
                  //     ?
                  Text(
                    "Doctor has not been assigned \nto this patient",
                    style: kParagaphTextStyle,
                  )
                  // : Expanded(
                  //     child: ListView.builder(
                  //       shrinkWrap: true,
                  //       physics: const NeverScrollableScrollPhysics(),
                  //       itemBuilder: (context, index) {
                  //         return Container(
                  //           padding: EdgeInsets.symmetric(
                  //               vertical: defaultPadding / 3),
                  //           child: Row(
                  //               mainAxisAlignment: MainAxisAlignment.start,
                  //               children: [
                  //                 SizedBox(width: defaultPadding),
                  //                 Icon(
                  //                   Icons.medical_information,
                  //                   size: 40,
                  //                   color: Colors.white,
                  //                 ),
                  //                 SizedBox(width: defaultPadding),
                  //                 Column(
                  //                   crossAxisAlignment: CrossAxisAlignment.start,
                  //                   children: [
                  //                     Text(
                  //                         "Name: ${availableDoctors[index].fullName}",
                  //                         style: kParagaphTextStyle),
                  //                     // Text(
                  //                     //     "Assignation date: ${widget.patient.checkIn}",
                  //                     //     style: kParagaphTextStyle),
                  //                     Text(
                  //                         "Department: ${availableDoctors[index].department}",
                  //                         style: kParagaphTextStyle),
                  //                     Text(
                  //                         "Hospital: ${availableDoctors[index].org}",
                  //                         style: kParagaphTextStyle),
                  //                   ],
                  //                 ),
                  //               ]),
                  //         );
                  //       },
                  //       itemCount: 2,
                  //     ),
                  //   ),
                ],
              ),
            ),
    );
  }
}
