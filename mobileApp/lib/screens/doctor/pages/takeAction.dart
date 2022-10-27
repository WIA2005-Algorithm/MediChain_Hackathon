import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:jwt_decode/jwt_decode.dart';
import 'package:medichain/screens/doctor/models/doctors.dart';
import '../../../constants.dart';
import '../models/notifications.dart';
import '../models/patients.dart';

class TakeAction extends StatefulWidget {
  final NotificationResponseAPI notification;
  final DoctorDetailsAPIResponse? doctor;
  final PatientDetailsAPIResponse? patient;

  TakeAction(
      {super.key, required this.notification, this.doctor, this.patient});

  @override
  State<TakeAction> createState() => _TakeActionState();
}

class _TakeActionState extends State<TakeAction> {
  Object? selected;
  Object? selectedDoctor;

  bool _ischeckBox1 = false;
  List<bool> _checkBoxes = [];
  Map<String, EachDoctor> availableDoctors = {};
  PatientDetailsAPIResponse? allDoctorsList;

  TextEditingController noteController = TextEditingController();

  Map<String, dynamic> payload = Jwt.parseJwt(ApiConstants.accessToken);
  String userID = '';
  String userRole = '';
  String selectedEMR = "";

  // List<String> _texts = [
  //   "InduceSmile.com",
  //   "Flutter.io",
  //   "google.com",
  //   "youtube.com",
  //   "yahoo.com",
  //   "gmail.com"
  // ];
  // List<bool> _isChecked = [false, false, false, false, false];

  Future<void> getAssociatedDoctors() async {
    print("PATIENT ID IS " + widget.notification.Data!.patientID);
    await AdminConstants.sendGET(AdminConstants.getAllSelectedEMRDoctors,
            <String, String>{"patientID": widget.notification.Data!.patientID})
        .then((response) {
      if (response.statusCode == 200) {
        print("Response ${response.body}");
        setState(() {
          selectedEMR = response.body;
        });
      } else {
        throw Exception('Failed to GT ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Doctor API: ${onError.toString()}');
    });
    print("Success in api call");

    print(selectedEMR);
  }

  Future<void> getPatientData() async {
    // print("patient id ${widget.notification.Data!.patientID}");
    await AdminConstants.sendGET(AdminConstants.getPatientDetails,
            <String, String>{"ID": widget.notification.Data!.patientID})
        .then((response) {
      if (response.statusCode == 200) {
        print(response.body);
        PatientDetailsAPIResponse tempPatient =
            PatientDetailsAPIResponse(jsonDecode(response.body));

        setState(() {
          if (tempPatient.associatedDoctors!.doctors.isNotEmpty) {
            availableDoctors = tempPatient.associatedDoctors!.doctors;
            allDoctorsList = tempPatient;
          }
          print(availableDoctors);
        });
      } else {
        throw Exception('Failed to GT ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Doctor API: ${onError.toString()}');
    });
    print("Success in api call");
  }

  // Future<void> getDoctorData() async {
  //   await AdminConstants.sendGET(
  //       AdminConstants.getAllDoctorData, <String, String>{}).then((response) {
  //     if (response.statusCode == 200) {
  //       List<dynamic> tempDoctors = jsonDecode(response.body);
  //       List<Doctor> doctors = [];
  //       for (var doctor in tempDoctors) {
  //         doctors.add(Doctor(doctor));
  //         print(tempDoctors[0]);
  //       }

  //       print("Doctor Name: ${doctors[0].fullName} ${doctors[0].activeList}");
  //       setState(() {
  //         availableDoctors = doctors;
  //       });
  //     } else {
  //       throw Exception('Failed to GT ${response.statusCode}');
  //     }
  //   }).catchError((onError) {
  //     print('Error in GET Doctor API: ${onError.toString()}');
  //   });

  //   print("Success in api call");
  // }

  @override
  void initState() {
    // TODO: implement initState
    userID = payload["username"];
    userRole = payload["role"];
    // getDoctorData();

    if (userRole == "admin") {
      getAssociatedDoctors();
    }
    getPatientData();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Take Action"),
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
                Icons.logout,
                color: Colors.white,
              ),
              tooltip: 'Login/Registration',
              onPressed: () {
                Navigator.pop(context);
              })
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(defaultPadding),
        child: Column(
          children: [
            const SizedBox(height: defaultPadding * 2),
            const Text("Access Request Permit Sharing of Records",
                textAlign: TextAlign.center, style: kSectionTextStyle),
            const SizedBox(height: defaultPadding * 2),
            Padding(
              padding: const EdgeInsets.all(defaultPadding),
              child: Text(widget.notification.NotificationString,
                  style: kParagaphTextStyle),
            ),
            const SizedBox(height: defaultPadding * 2),
            ListTile(
              title: Text(widget.notification.NotificationAccept,
                  textAlign: TextAlign.justify, style: kParagaphTextStyle),
              leading: Radio(
                fillColor:
                    MaterialStateColor.resolveWith((states) => Colors.white70),
                value: true,
                groupValue: selected,
                onChanged: (value) {
                  setState(() {
                    selected = value;
                  });
                },
              ),
            ),
            selected == true && userRole == "admin"
                ? Padding(
                    padding: const EdgeInsets.only(left: defaultPadding * 2),
                    child: Column(
                      children: [
                        CheckboxListTile(
                          activeColor: kAppBarColor,
                          checkColor: kSecondaryColor,
                          title: const Text("Associated Doctors",
                              style: kParagaphTextStyle),
                          value: _ischeckBox1,
                          onChanged: (newValue) {
                            setState(() {
                              _ischeckBox1 = newValue!;
                            });
                          },
                          controlAffinity: ListTileControlAffinity
                              .leading, //  <-- leading Checkbox
                        ),
                        // availableDoctors.isEmpty
                        //     ? Text(
                        //         "No Associated Doctors",
                        //         style: kParagaphTextStyle,
                        //       )
                        //     : ListView.builder(
                        //         shrinkWrap: true,
                        //         itemCount: availableDoctors.length,
                        //         itemBuilder: (context, index) {
                        //           print(_checkBoxes[index]);
                        //           return Expanded(
                        //             child: CheckboxListTile(
                        //               title: Text(
                        //                   "${availableDoctors.values.toList()[index].name} - ${availableDoctors.values.toList()[index].department}",
                        //                   style: kParagaphTextStyle),
                        //               value: _checkBoxes[index],
                        //               onChanged: (val) {
                        //                 setState(() {
                        //                   _checkBoxes[index] = val!;
                        //                 });
                        //               },
                        //               controlAffinity:
                        //                   ListTileControlAffinity.leading,
                        //             ),
                        //           );
                        //         }),
                      ],
                    ),
                  )
                : Container(),
            ListTile(
              title: Text(widget.notification.NotificationDeny,
                  style: kParagaphTextStyle),
              leading: Radio(
                value: false,
                fillColor:
                    MaterialStateColor.resolveWith((states) => Colors.white70),
                groupValue: selected,
                onChanged: (value) {
                  setState(() {
                    selected = value;
                  });
                },
              ),
            ),
            SizedBox(height: defaultPadding),
            selected == false
                ? Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: defaultPadding * 2),
                    child: TextFormField(
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      cursorColor: kPrimaryColor,
                      controller: noteController,
                      decoration: const InputDecoration(
                        hintText: "Add Note",
                        prefixIcon: Padding(
                          padding: EdgeInsets.all(defaultPadding),
                          child: Icon(Icons.edit),
                        ),
                      ),
                    ),
                  )
                : Container(),
            SizedBox(height: defaultPadding * 3),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: defaultPadding),
              child: ElevatedButton(
                onPressed: () {
                  if (selected == true) {
                    acceptRequest();
                  } else {
                    denyRequest();
                  }
                },
                style: ElevatedButton.styleFrom(
                    primary: kSecondaryColor, elevation: 0),
                child: Text(
                  "Submit response".toUpperCase(),
                  style: TextStyle(color: Colors.black),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void acceptRequest() async {
    Map<String, dynamic> data = {
      "PatientID": widget.notification.Data!.patientID,
      "PatientOrg": widget.notification.Data!.patientOrg,
      "FromDoc": widget.notification.Data!.FromDoc,
      "FromName": widget.notification.Data!.FromName,
      "FromOrg": widget.notification.Data!.FromOrg,
      "UID": widget.notification.Data!.UID
    };
    if (userRole == "admin") {
      await getAssociatedDoctors();

      await AdminConstants.sendPOST(
          AdminConstants.acceptExternalDoctorRequest, <String, dynamic>{
        "selectedEMR": jsonDecode(selectedEMR),
        "data": data,
        "notifObj": widget.notification,
      }).then((response) async {
        print("Response code: ${response.statusCode}");
        print("Response ${response.body}");

        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Request accepted successfully')));
          Navigator.pop(context);
        } else {
          throw Exception('Failed accepting request');
        }
      }).catchError((onError) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(onError.toString())));
        print('Error : ${onError.toString()}');
      });
    } else if (userRole == "doctor") {
      EachDoctor? doctorDetails;
      String ID = '';

      availableDoctors.values.forEach((element) {
        if (element.email == widget.doctor!.details!.email) {
          doctorDetails = element;
          ID = widget.doctor!.details!.passport;
          print("ID: $ID, ${doctorDetails!.EMRID}, ${doctorDetails!.name}");
        }
      });

      Map<String, dynamic> doctor = {
        "EMRID": doctorDetails!.EMRID,
        "ID": ID,
        "name": doctorDetails!.name,
      };

      await DoctorConstants.sendPOST(
          DoctorConstants.acceptRequestToFromAdmin, <String, dynamic>{
        "data": data,
        "doctor": doctor,
        "notifObj": widget.notification,
      }).then((response) async {
        print("Response code: ${response.statusCode}");

        if (response.statusCode == 200) {
          print("Success in accepting ...");
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Request accepted successfully')));
          Navigator.pop(context);
        } else {
          throw Exception('Failed accepting request');
        }
      }).catchError((onError) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(onError.toString())));
        print('Error : ${onError.toString()}');
      });
    } else if (userRole == "patient") {
      // String name = "";
      // widget.patient!.details!.middleName != ""
      //     ? name = "${widget.patient!.details!.firstName}" +
      //         " ${widget.patient!.details!.middleName}" +
      //         " ${widget.patient!.details!.lastName}"
      //     : name = "${widget.patient!.details!.firstName}" +
      //         " ${widget.patient!.details!.lastName}";

      await PatientConstants.sendPOST(
          PatientConstants.acceptRequestToFromDoctors, <String, dynamic>{
        "data": data,
        "name": payload["fullOrg"],
        "notifObj": widget.notification,
      }).then((response) async {
        print("Response code: ${response.statusCode}");

        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Request accepted successfully')));
          Navigator.pop(context);
        } else {
          throw Exception('Failed accepting request');
        }
      }).catchError((onError) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(onError.toString())));
        print('Error : ${onError.toString()}');
      });
    }
    Navigator.pop(context);
  }

  void denyRequest() async {
    // check user
    Map<String, dynamic> data = {
      "PatientID": widget.notification.Data!.patientID,
      "PatientOrg": widget.notification.Data!.patientOrg,
      "FromDoc": widget.notification.Data!.FromDoc,
      "FromName": widget.notification.Data!.FromName,
      "FromOrg": widget.notification.Data!.FromOrg,
      "UID": widget.notification.Data!.UID
    };
    if (userRole == "admin") {
      await AdminConstants.sendPOST(
          AdminConstants.denyExternalDoctorRequest, <String, dynamic>{
        "selectedEMR": jsonDecode(selectedEMR),
        "data": data,
        "note": noteController.text,
        "notifObj": widget.notification,
      }).then((response) async {
        print("Response code: ${response.statusCode}");

        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Request denied successfully')));
          Navigator.pop(context);
        } else {
          throw Exception('Failed Denying Request');
        }
      }).catchError((onError) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(onError.toString())));
        print('Error : ${onError.toString()}');
      });
    } else if (userRole == "doctor") {
      EachDoctor? doctorDetails;
      String ID = '';

      availableDoctors.values.forEach((element) {
        if (element.email == widget.doctor!.details!.email) {
          doctorDetails = element;
          ID = widget.doctor!.details!.passport;
          print("ID: $ID, ${doctorDetails!.EMRID}, ${doctorDetails!.name}");
        }
      });

      Map<String, dynamic> doctor = {
        "EMRID": doctorDetails!.EMRID,
        "ID": ID,
        "name": doctorDetails!.name,
      };

      await DoctorConstants.sendPOST(
          DoctorConstants.denyRequestToFromAdmin, <String, dynamic>{
        "data": data,
        "others": doctor,
        "note": noteController.text,
        "notifObj": widget.notification,
      }).then((response) async {
        print("Response code: ${response.statusCode}");

        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Request denied successfully')));
          Navigator.pop(context);
        } else {
          throw Exception('Failed Denying Request');
        }
      }).catchError((onError) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(onError.toString())));
        print('Error : ${onError.toString()}');
      });
    } else if (userRole == "patient") {
      await PatientConstants.sendPOST(
          PatientConstants.denyRequestToFromDoctors, <String, dynamic>{
        "data": data,
        "name": payload["fullOrg"],
        "note": noteController.text,
        "notifObj": widget.notification,
      }).then((response) async {
        print("Response code: ${response.statusCode}");

        if (response.statusCode == 200) {
          ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Request denied successfully')));
          Navigator.pop(context);
        } else {
          throw Exception('Failed Denying Request');
        }
      }).catchError((onError) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(onError.toString())));
        print('Error : ${onError.toString()}');
      });
    }
    Navigator.pop(context);
  }
}
