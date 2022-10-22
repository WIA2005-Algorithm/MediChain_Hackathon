// ignore_for_file: unnecessary_string_interpolations

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/models/doctors.dart';
import 'package:medichain/screens/doctor/models/doctors.dart';
import '../../../constants.dart';
import '../models/patients.dart';

class PatientDetails extends StatefulWidget {
  final PatientDetailsAPIResponse? patient;
  final int index;

  PatientDetails({super.key, required this.index, required this.patient});

  @override
  State<PatientDetails> createState() => _PatientDetailsState();
}

class _PatientDetailsState extends State<PatientDetails> {
  @override
  void initState() {
    // TODO: implement initState
    print(widget.patient!.checkIn);
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
                      "First Name: ${widget.patient!.details!.firstName}",
                      style: kParagaphTextStyle,
                    ),
                    widget.patient!.details!.middleName == "UNDEFINED"
                        ? SizedBox()
                        : Text(
                            "Middle Name: ${widget.patient!.details!.middleName}",
                            style: kParagaphTextStyle,
                          ),
                    Text(
                      "Last Name: ${widget.patient!.details!.lastName}",
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
                    Text("Main: ${widget.patient!.details!.mobile}",
                        style: kParagaphTextStyle),
                    Text("Whatsapp: ${widget.patient!.details!.whatsapp}",
                        style: kParagaphTextStyle),
                    Text("Alternate: ${widget.patient!.details!.otherNumber}",
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
                        "${widget.patient!.details!.street1}",
                        style: kParagaphTextStyle,
                        textAlign: TextAlign.left,
                      ),
                      Text(
                        "${widget.patient!.details!.street2}",
                        style: kParagaphTextStyle,
                        textAlign: TextAlign.left,
                      ),
                      Text(
                        "${widget.patient!.details!.city}",
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
            // widget.patient!.associatedDoctors.toString() == "{}"
            //     ? Text(
            //         "Doctor has not been assigned \nto this patient",
            //         style: kParagaphTextStyle,
            //       )
            //     : Expanded(
            //         child: ListView.builder(
            //           shrinkWrap: true,
            //           physics: const NeverScrollableScrollPhysics(),
            //           itemBuilder: (context, index) {
            //             return Container(
            //               padding: EdgeInsets.symmetric(
            //                   vertical: defaultPadding / 3),
            //               child: Row(
            //                   mainAxisAlignment: MainAxisAlignment.start,
            //                   children: [
            //                     SizedBox(width: defaultPadding),
            //                     Icon(
            //                       Icons.medical_information,
            //                       size: 40,
            //                       color: Colors.white,
            //                     ),
            //                     SizedBox(width: defaultPadding),
            //                     // Create New page for doctors list
            //                     Column(
            //                       crossAxisAlignment: CrossAxisAlignment.start,
            //                       children: [
            //                         Text(
            //                             "Name: ${widget.patient.details}",
            //                             style: kParagaphTextStyle),
            //                         // Text(
            //                         //     "Assignation date: ${widget.patient.checkIn}",
            //                         //     style: kParagaphTextStyle),
            //                         Text(
            //                             "Department: ${widget.patient.details.doctors}",
            //                             style: kParagaphTextStyle),
            //                         Text(
            //                             "Hospital: ${availableDoctors[index].org}",
            //                             style: kParagaphTextStyle),
            //                       ],
            //                     ),
            //                   ]),
            //             );
            //           },
            //           itemCount: availableDoctors.length,
            //         ),
            //       ),
          ],
        ),
      ),
    );
  }
}
