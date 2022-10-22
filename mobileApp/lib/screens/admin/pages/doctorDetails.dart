import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/models/doctors.dart';
import 'package:medichain/screens/admin/models/patients.dart';

import '../../../constants.dart';

class DoctorDetails extends StatefulWidget {
  final Doctor doctor;
  final int index;
  final List<String> activeList;
  DoctorDetails(
      {super.key,
      required this.doctor,
      required this.index,
      required this.activeList});

  @override
  State<DoctorDetails> createState() => _DoctorDetailsState();
}

class _DoctorDetailsState extends State<DoctorDetails> {
  List<Patient> availablePatients = [];

  @override
  void initState() {
    // TODO: implement initState
    getPatientData();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Doctor Details"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(2),
          child: Text(
            '',
            style: TextStyle(color: Colors.white60),
          ),
        ),
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
                      "First Name: ${widget.doctor.firstName}",
                      style: kParagaphTextStyle,
                    ),
                    widget.doctor.middleName == "UNDEFINED"
                        ? SizedBox()
                        : Text(
                            "Middle Name: ${widget.doctor.middleName}",
                            style: kParagaphTextStyle,
                          ),
                    Text(
                      "Last Name: ${widget.doctor.lastName}",
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
                    Text("Main: ${widget.doctor.mobile}",
                        style: kParagaphTextStyle),
                    Text("Whatsapp: ${widget.doctor.whatsapp}",
                        style: kParagaphTextStyle),
                    Text("Alternate: ${widget.doctor.otherNumber}",
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
                        "${widget.doctor.street1},",
                        style: kParagaphTextStyle,
                        textAlign: TextAlign.left,
                      ),
                      Text(
                        "${widget.doctor.street2},",
                        style: kParagaphTextStyle,
                        textAlign: TextAlign.left,
                      ),
                      Text(
                        "${widget.doctor.city}.",
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
            const Text("Associated Patients", style: kSectionTextStyle),
            const SizedBox(height: defaultPadding),
            widget.doctor.associatedPatients.toString() == "{}"
                ? Text(
                    "Patient has not been assigned \nto this doctor",
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
                                        "Name: ${availablePatients[index].fullName}",
                                        style: kParagaphTextStyle),
                                    // Text(
                                    //     "Assignation date: ${widget.patient.checkIn}",
                                    //     style: kParagaphTextStyle),
                                    Text(
                                        "Department: ${availablePatients[index].department}",
                                        style: kParagaphTextStyle),
                                    Text(
                                        "Hospital: ${availablePatients[index].org}",
                                        style: kParagaphTextStyle),
                                  ],
                                ),
                              ]),
                        );
                      },
                      itemCount: availablePatients.length,
                    ),
                  ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          // onPressedDynamic(context);
        },
        label: Text(
          "Discharge Patient",
          style: TextStyle(color: Colors.black),
        ),
        icon: const Icon(
          Icons.add,
          color: kPrimaryColor,
        ),
        backgroundColor: kSecondaryColor,
      ),
    );
  }

  Future<void> getPatientData() async {
    await AdminConstants.sendGET(
        AdminConstants.getAllPatientData, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        List<dynamic> tempPatient = jsonDecode(response.body);
        List<Patient> patients = [];
        for (var patients in tempPatient) {
          print(patients);
          patients.add(Patient(patients));
        }
        setState(() {
          availablePatients = patients;
        });
      } else {
        throw Exception('Failed to GT ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Doctor API: ${onError.toString()}');
    });
  }
}
