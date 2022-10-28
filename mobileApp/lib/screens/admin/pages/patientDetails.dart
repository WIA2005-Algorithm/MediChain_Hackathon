// ignore_for_file: unnecessary_string_interpolations

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/models/doctors.dart';
import 'package:medichain/screens/admin/pages/patientPage.dart';
import '../../../constants.dart';
import '../models/patients.dart';

class PatientDetails extends StatefulWidget {
  final Patient patient;
  final int index;
  final List<String> activeList;

  PatientDetails(
      {super.key,
      required this.index,
      required this.patient,
      required this.activeList});

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
        // actions: [
        //   IconButton(
        //       icon: const Icon(
        //         Icons.notifications,
        //         color: Colors.white,
        //       ),
        //       tooltip: 'Login/Registration',
        //       onPressed: () {
        //         Navigator.push(context,
        //             MaterialPageRoute(builder: (context) => Container()));
        //       })
        // ],
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
    print("${widget.patient.firstName} ${widget.patient.active}");
    if (widget.patient.active == widget.activeList[0]) {
      text = "Assign More Doctors";
    } else if (widget.patient.active == widget.activeList[1]) {
      text = "Discharge Patient";
    } else if (widget.patient.active == widget.activeList[2]) {
      text = "Assign Doctor";
    } else if (widget.patient.active == widget.activeList[3]) {
      text = "Check In Patient";
    }
    return Text(
      text,
      style: TextStyle(color: kPrimaryColor),
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

  Doctor? selectedDoctor;

  // List<DropdownMenuItem<String>> get doctorItems {
  //   List<DropdownMenuItem<String>> menuItems = [];
  //   int index = 0;
  //   for (var doctor in availableDoctors) {
  //     print("Loop ${index} ${doctor.firstName}");
  //     menuItems.add(DropdownMenuItem(
  //         value: "${doctor.fullName}", child: Text("${doctor.fullName}")));
  //     index++;
  //   }
  //   print("Pass doctorItems ${menuItems.length}");
  //   return menuItems;
  // }

  void onPressedDynamic(BuildContext context) async {
    if (widget.patient.active == widget.activeList[0]) {
      // get doctors list, show alert and ask for selection
      // else cancel operation
      await getDoctorData();
      // Alertbox
      showDialog<String>(
          context: context,
          builder: (BuildContext context) => AlertDialog(
                backgroundColor: kBackgroundColor,
                title: const Text('Assign To Doctor',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        fontSize: 17,
                        fontFamily: 'Inter')),
                // ${NetworkInfo.organizations[index].adminID}
                content: const Text(
                    'Choose from list below to assign new doctor\'s',
                    style: TextStyle(
                        fontWeight: FontWeight.normal,
                        color: Colors.white70,
                        fontSize: 15,
                        fontFamily: 'Inter')),
                actions: <Widget>[
                  DropdownButtonFormField<Doctor>(
                      hint: const Text("Doctor List"),
                      decoration: InputDecoration(
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        // filled: true,
                      ),
                      // validator: (value) =>
                      //     value == null ? "Select a doctor" : null,
                      value: selectedDoctor,
                      items: availableDoctors
                          .map((e) => DropdownMenuItem<Doctor>(
                              value: e,
                              child: Text(
                                "${e.fullName}-[${e.department}]",
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold),
                              )))
                          .toList(),
                      onChanged: (newValue) {
                        setState(() {
                          selectedDoctor = newValue;
                        });
                      }),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        selectedDoctor = null;
                        availableDoctors = [];
                      });
                      return Navigator.pop(context, 'Cancel');
                    },
                    child: const Text('Cancel',
                        style: TextStyle(
                            fontWeight: FontWeight.normal,
                            color: Colors.white70,
                            fontSize: 15,
                            fontFamily: 'Inter')),
                  ),
                  TextButton(
                    onPressed: () async {
                      await AdminConstants.sendPOST(
                          AdminConstants.AssignDoctor, <String, String>{
                        "patientID": widget.patient.passport,
                        "doctorID": selectedDoctor!.passport
                      }).then((response) {
                        if (response.statusCode == 200) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text('Doctor Assigned Successful')));
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => PatientPage()));
                        } else {
                          throw Exception(
                              'Failed to Post ${response.statusCode}');
                        }
                      }).catchError((onError) {
                        ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Doctor Assigned Failed')));
                        print(
                            'Error in POST Assign Doctor API: ${onError.toString()}');
                      });
                    },
                    child: const Text('OK',
                        style: TextStyle(
                            fontWeight: FontWeight.normal,
                            color: Colors.white70,
                            fontSize: 15,
                            fontFamily: 'Inter')),
                  ),
                ],
              ));
    } else if (widget.patient.active == widget.activeList[1]) {
      await AdminConstants.sendPOST(AdminConstants.Discharge, <String, String>{
        "patientID": widget.patient.passport,
      }).then((response) {
        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Patient Discharge Successful')));
          Navigator.push(
              context, MaterialPageRoute(builder: (context) => PatientPage()));
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Patient Discharge Failed')));
          throw Exception('Failed to GT ${response.statusCode}');
        }
      }).catchError((onError) {
        print('Error in GET Partients API: ${onError.toString()}');
      });
    } else if (widget.patient.active == widget.activeList[2]) {
      // get doctors list, show alert and ask for selection
      // else cancel operation
      await getDoctorData();
      // Alertbox
      showDialog<String>(
          context: context,
          builder: (BuildContext context) => AlertDialog(
                backgroundColor: kBackgroundColor,
                title: const Text('Assign To Doctor',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        fontSize: 17,
                        fontFamily: 'Inter')),
                // ${NetworkInfo.organizations[index].adminID}
                content: const Text(
                    'Choose from list below to assign new doctor\'s',
                    style: TextStyle(
                        fontWeight: FontWeight.normal,
                        color: Colors.white70,
                        fontSize: 15,
                        fontFamily: 'Inter')),
                actions: <Widget>[
                  DropdownButtonFormField<Doctor>(
                      hint: const Text("Doctor List"),
                      decoration: InputDecoration(
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        // filled: true,
                      ),
                      // validator: (value) =>
                      //     value == null ? "Select a doctor" : null,
                      value: selectedDoctor,
                      items: availableDoctors
                          .map((e) => DropdownMenuItem<Doctor>(
                              value: e,
                              child: Text(
                                "${e.fullName}-[${e.department}]",
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold),
                              )))
                          .toList(),
                      onChanged: (newValue) {
                        setState(() {
                          selectedDoctor = newValue;
                        });
                      }),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        selectedDoctor = null;
                        availableDoctors = [];
                      });
                      return Navigator.pop(context, 'Cancel');
                    },
                    child: const Text('Cancel',
                        style: TextStyle(
                            fontWeight: FontWeight.normal,
                            color: Colors.white70,
                            fontSize: 15,
                            fontFamily: 'Inter')),
                  ),
                  TextButton(
                    onPressed: () async {
                      await AdminConstants.sendPOST(
                          AdminConstants.AssignDoctor, <String, String>{
                        "patientID": widget.patient.passport,
                        "doctorID": selectedDoctor!.passport
                      }).then((response) {
                        if (response.statusCode == 200) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              content: Text('Doctor Assigned Successful')));
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => PatientPage()));
                        } else {
                          throw Exception(
                              'Failed to Post ${response.statusCode}');
                        }
                      }).catchError((onError) {
                        ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Doctor Assigned Failed')));
                        print(
                            'Error in POST Assign Doctor API: ${onError.toString()}');
                      });
                    },
                    child: const Text('OK',
                        style: TextStyle(
                            fontWeight: FontWeight.normal,
                            color: Colors.white70,
                            fontSize: 15,
                            fontFamily: 'Inter')),
                  ),
                ],
              ));
    } else if (widget.patient.active == widget.activeList[3]) {
      await AdminConstants.sendPOST(
          AdminConstants.CheckInPatient, <String, String>{
        "patientID": widget.patient.passport,
      }).then((response) {
        if (response.statusCode == 200) {
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
