// ignore_for_file: unnecessary_string_interpolations

import 'package:flutter/material.dart';
import 'package:medichain/screens/doctor/pages/associatedDoctors.dart';
import '../../../constants.dart';
import '../models/patients.dart';

class PatientDetails extends StatefulWidget {
  final EachPatient patient;
  final int index;

  PatientDetails({super.key, required this.index, required this.patient});

  @override
  State<PatientDetails> createState() => _PatientDetailsState();
}

class _PatientDetailsState extends State<PatientDetails> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    print("TESTING --- ${widget.patient.patientData!.active}");
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
      ),
      body: SingleChildScrollView(
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
                      "Name: ${widget.patient.name}",
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
                    Text("Main: ${widget.patient.patientData!.details!.mobile}",
                        style: kParagaphTextStyle),
                    Text(
                        "Whatsapp: ${widget.patient.patientData!.details!.whatsapp}",
                        style: kParagaphTextStyle),
                    Text(
                        "Alternate: ${widget.patient.patientData!.details!.otherNumber}",
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
                        "${widget.patient.patientData!.details!.street1}",
                        style: kParagaphTextStyle,
                        textAlign: TextAlign.left,
                      ),
                      Text(
                        "${widget.patient.patientData!.details!.street2}",
                        style: kParagaphTextStyle,
                        textAlign: TextAlign.left,
                      ),
                      Text(
                        "${widget.patient.patientData!.details!.city}",
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
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemBuilder: (context, index) {
                return Container(
                  padding: EdgeInsets.symmetric(vertical: defaultPadding),
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
                        // Create New page for doctors list
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Name: ${widget.patient.patientData!.associatedDoctors!.doctors.values.toList()[index].name}",
                                style: kParagaphTextStyle,
                                softWrap: true,
                                maxLines: 2,
                                overflow: TextOverflow.fade,
                              ),
                              Text(
                                "Assigned On: ${widget.patient.patientData!.associatedDoctors!.doctors.values.toList()[index].assignedOn}",
                                style: kParagaphTextStyle,
                                softWrap: true,
                                maxLines: 2,
                                overflow: TextOverflow.fade,
                              ),
                              widget.patient.patientData!.associatedDoctors!
                                          .doctors.values
                                          .toList()[index]
                                          .deAssigned !=
                                      ''
                                  ? Text(
                                      "Discharged On: ${widget.patient.patientData!.associatedDoctors!.doctors.values.toList()[index].deAssigned}",
                                      style: kParagaphTextStyle,
                                      softWrap: true,
                                      maxLines: 2,
                                      overflow: TextOverflow.fade,
                                    )
                                  : Container(),
                              Text(
                                "Department: ${widget.patient.patientData!.associatedDoctors!.doctors.values.toList()[index].department}",
                                style: kParagaphTextStyle,
                                softWrap: true,
                                maxLines: 2,
                                overflow: TextOverflow.fade,
                              ),
                              Text(
                                "Note: ${widget.patient.patientData!.associatedDoctors!.doctors.values.toList()[index].note}",
                                style: kParagaphTextStyle,
                                softWrap: true,
                                maxLines: 2,
                                overflow: TextOverflow.fade,
                              ),
                            ],
                          ),
                        ),
                      ]),
                );
              },
              itemCount: widget.patient.patientData!.associatedDoctors!.doctors
                  .values.length,
            ),
            // AssociatedDocPage(
            //     doctorDetails: widget
            //         .patient.patientData!.associatedDoctors!.doctors.values
            //         .toList()),
            // ElevatedButton(
            //   style: ElevatedButton.styleFrom(
            //     shape: RoundedRectangleBorder(
            //       borderRadius: BorderRadius.circular(10),
            //     ),
            //     backgroundColor: kSecondaryColor,
            //   ),
            //   onPressed: () {
            //     Navigator.push(
            //         context,
            //         MaterialPageRoute(
            //             builder: (context) => AssociatedDocPage(
            //                 doctorDetails: widget.patient.patientData!
            //                     .associatedDoctors!.doctors.values
            //                     .toList())));
            //   },
            //   child: Text(
            //     "View Associated Doctors".toUpperCase(),
            //     style: TextStyle(
            //         color: kPrimaryTextColor, fontWeight: FontWeight.bold),
            //   ),
            // ),
          ],
        ),
      ),
    );
  }
}
