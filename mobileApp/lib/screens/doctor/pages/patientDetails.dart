// ignore_for_file: unnecessary_string_interpolations

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/models/doctors.dart';
import '../../../constants.dart';
import '../models/patients.dart';

class PatientDetails extends StatefulWidget {
  final Patient patient;
  final int index;

  PatientDetails({super.key, required this.index, required this.patient});

  @override
  State<PatientDetails> createState() => _PatientDetailsState();
}

class _PatientDetailsState extends State<PatientDetails> {
  List<Doctor> availableDoctors = [];

  @override
  void initState() {
    // TODO: implement initState
    print(widget.patient.checkIn);
    getDoctorData();
    super.initState();
  }

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
                      "First Name: ${widget.patient.firstName}",
                      style: kParagaphTextStyle,
                    ),
                    widget.patient.middleName == "UNDEFINED"
                        ? SizedBox()
                        : Text(
                            "Middle Name: ${widget.patient.middleName}",
                            style: kParagaphTextStyle,
                          ),
                    Text(
                      "Last Name: ${widget.patient.lastName}",
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
                    Text("Main: ${widget.patient.mobile}",
                        style: kParagaphTextStyle),
                    Text("Whatsapp: ${widget.patient.whatsapp}",
                        style: kParagaphTextStyle),
                    Text("Alternate: ${widget.patient.otherNumber}",
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
                        "${widget.patient.street1}",
                        style: kParagaphTextStyle,
                        textAlign: TextAlign.left,
                      ),
                      Text(
                        "${widget.patient.street2}",
                        style: kParagaphTextStyle,
                        textAlign: TextAlign.left,
                      ),
                      Text(
                        "${widget.patient.city}",
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
            widget.patient.associatedDoctors.toString() == "{}"
                ? Text(
                    "Doctor has not been assigned \nto this patient",
                    style: kParagaphTextStyle,
                  )
                : Expanded(
                    child: ListView.builder(
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
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                        "Name: ${availableDoctors[index].fullName}",
                                        style: kParagaphTextStyle),
                                    // Text(
                                    //     "Assignation date: ${widget.patient.checkIn}",
                                    //     style: kParagaphTextStyle),
                                    Text(
                                        "Department: ${availableDoctors[index].department}",
                                        style: kParagaphTextStyle),
                                    Text(
                                        "Hospital: ${availableDoctors[index].org}",
                                        style: kParagaphTextStyle),
                                  ],
                                ),
                              ]),
                        );
                      },
                      itemCount: availableDoctors.length,
                    ),
                  ),
          ],
        ),
      ),
    );
  }

  Future<void> getDoctorData() async {
    await AdminConstants.sendGET(
        AdminConstants.getAllDoctorData, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        List<dynamic> tempDoctors = jsonDecode(response.body);
        List<Doctor> doctors = [];
        for (var doctor in tempDoctors) {
          doctors.add(Doctor(doctor));
        }

        print("${doctors[0].fullName} ${doctors[0].activeList}");
        setState(() {
          availableDoctors = doctors;
        });
      } else {
        throw Exception('Failed to GT ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Doctor API: ${onError.toString()}');
    });

    print("Success in api call");
  }
}
