import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/helper/helperfunctions.dart';
import 'package:medichain/screens/admin/pages/patientPage.dart';
import '../../../constants.dart';
import '../models/patients.dart';

class PatientDetails extends StatelessWidget {
  final Patient patient;
  final int index;
  final List<String> activeList;

  PatientDetails(
      {super.key,
      required this.index,
      required this.patient,
      required this.activeList});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Patient Details"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(2),
          child: Text(
            '',
            style: TextStyle(color: Colors.white60),
          ),
        ),
        actions: [
          IconButton(
              icon: const Icon(
                Icons.notifications,
                color: Colors.white,
              ),
              tooltip: 'Login/Registration',
              onPressed: () {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => Container()));
              })
        ],
      ),
      body: Container(
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
                      "First Name: ${patient.firstName}",
                      style: kParagaphTextStyle,
                    ),
                    Text(
                      "Middle Name: ${patient.middleName}",
                      style: kParagaphTextStyle,
                    ),
                    Text(
                      "Last Name: ${patient.lastName}",
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
                    Text("Main: ${patient.mobile}", style: kParagaphTextStyle),
                    Text("Whatsapp: ${patient.whatsapp}",
                        style: kParagaphTextStyle),
                    Text("Alternate: ${patient.otherNumber}",
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
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("${patient.street1}", style: kParagaphTextStyle),
                    Text("${patient.street2}", style: kParagaphTextStyle),
                    Text("${patient.city}", style: kParagaphTextStyle),
                  ],
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
            Row(
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
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                        "${patient.associatedDoctors.toString() == "{}" ? "Doctor has not been assigned \nto the patient" : patient.associatedDoctors.entries}",
                        style: kParagaphTextStyle),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          onPressedDynamic(context);
        },
        label: buttonText(),
        icon: const Icon(
          Icons.add,
          color: kPrimaryColor,
        ),
        backgroundColor: kSecondaryColor,
      ),
    );
  }

  Widget buttonText() {
    String text = "";
    print("${patient.firstName} ${patient.active}");
    if (patient.active == activeList[0]) {
      text = "Assign More Doctors";
    } else if (patient.active == activeList[1]) {
      text = "Discharge Patient";
    } else if (patient.active == activeList[2]) {
      text = "Assign Doctor";
    } else if (patient.active == activeList[3]) {
      text = "Check In Patient";
    }
    return Text(
      text,
      style: TextStyle(color: kPrimaryColor),
    );
  }

  void onPressedDynamic(BuildContext context) async {
    if (patient.active == activeList[0]) {
      await AdminConstants.sendPOST(
          AdminConstants.AssignDoctor, <String, String>{
        "patientID": patient.passport,
        // "doctorID": patient.passport,
      }).then((response) {
        if (response.statusCode == 200) {
          var tempPatients = jsonDecode(response.body);

          Navigator.push(
              context, MaterialPageRoute(builder: (context) => PatientPage()));
        } else {
          throw Exception('Failed to GT ${response.statusCode}');
        }
      }).catchError((onError) {
        print('Error in GET Partients API: ${onError.toString()}');
      });
    } else if (patient.active == activeList[1]) {
      await AdminConstants.sendPOST(AdminConstants.Discharge, <String, String>{
        "patientID": patient.passport,
      }).then((response) {
        if (response.statusCode == 200) {
          var tempPatients = jsonDecode(response.body);
          Navigator.push(
              context, MaterialPageRoute(builder: (context) => PatientPage()));
        } else {
          throw Exception('Failed to GT ${response.statusCode}');
        }
      }).catchError((onError) {
        print('Error in GET Partients API: ${onError.toString()}');
      });
    } else if (patient.active == activeList[2]) {
      // get doctors list, show alert and ask for selection
      // else cancel operation

      await AdminConstants.sendPOST(
          AdminConstants.AssignDoctor, <String, String>{
        "patientID": patient.passport,
        "doctorID": ApiConstants.userName
      }).then((response) {
        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Doctor Assigned Successful')));
          Navigator.push(
              context, MaterialPageRoute(builder: (context) => PatientPage()));
        } else {
          throw Exception('Failed to Post ${response.statusCode}');
        }
      }).catchError((onError) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Doctor Assigned Error')));
        print('Error in POST Assign Doctor API: ${onError.toString()}');
      });
    } else if (patient.active == activeList[3]) {
      await AdminConstants.sendPOST(
          AdminConstants.CheckInPatient, <String, String>{
        "patientID": patient.passport,
      }).then((response) {
        if (response.statusCode == 200) {
          var tempPatients = jsonDecode(response.body);
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Patient Checked In Successful')));
          Navigator.push(
              context, MaterialPageRoute(builder: (context) => PatientPage()));
        } else {
          throw Exception('Failed to Post ${response.statusCode}');
        }
      }).catchError((onError) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Patient Checked In Error')));
        print('Error in Check In Patient API: ${onError.toString()}');
      });
    }
  }
}
