import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/doctor/models/notifications.dart';
import 'package:medichain/screens/doctor/models/patients.dart';
import 'package:medichain/screens/doctor/pages/notificationPage.dart';
import 'package:medichain/screens/doctor/pages/patientDetails.dart';
import 'package:medichain/screens/doctor/pages/requestsPage.dart';
import '../../constants.dart';
import '../welcome/welcome_screen.dart';
import 'package:jwt_decode/jwt_decode.dart';

class DoctorScreen extends StatefulWidget {
  const DoctorScreen({super.key});

  @override
  State<DoctorScreen> createState() => _DoctorScreenState();
}

class _DoctorScreenState extends State<DoctorScreen> {
  bool _inProgress = false;
  TextStyle optionStyle = TextStyle(fontSize: 30, fontWeight: FontWeight.bold);
  DoctorDetailsAPIResponse? doctorInfo;

  List<int> currentIndex = [];
  int listLength = 0;
  DoctorDetailsAPIResponse? selectedOrg;
  List<String> organizations = [];
  String? selectedOrganization;
  TextEditingController patientIDcontroller = TextEditingController();
  Map<String, dynamic> payload = Jwt.parseJwt(ApiConstants.accessToken);

  @override
  void initState() {
    // TODO: implement initState
    getDoctorInfo();
    getOrganizationList();
    super.initState();
  }

  Future<void> getDoctorInfo() async {
    setState(() {
      _inProgress = true;
    });

    await DoctorConstants.sendGET(
        DoctorConstants.getDoctorInfo, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        print("Json body: ${response.body}");
        // STOPPED HERE
        setState(() {
          doctorInfo = DoctorDetailsAPIResponse(jsonDecode(response.body));
        });
        // print(
        //     "Doctor info: ${doctorInfo!.associatedPatients!.patients.values.toList()[index]}");
      } else {
        throw Exception('Failed to GET ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Doctor API: ${onError.toString()}');
    });
    setState(() {
      _inProgress = false;
    });
  }

  Future getOrganizationList() async {
    List<String> newItems = [];
    await AdminConstants.sendGET(
            AdminConstants.getHospitalsEnrolled, <String, String>{})
        .then((response) async {
      if (response.statusCode == 200) {
        Map<String, dynamic> payload = Jwt.parseJwt(ApiConstants.accessToken);
        List<String> orgList =
            (jsonDecode(response.body) as List<dynamic>).cast<String>();
        orgList.removeWhere((item) => item.contains(payload['org']));
        setState(() {
          organizations = orgList;
        });
        print("Organization state -- ${organizations}");
      } else {
        throw Exception('Failed to Patient Checked In');
      }
    }).catchError((onError) {});
  }

  Future<void> requestExternalPatientData() async {
    setState(() {
      _inProgress = true;
    });

    await DoctorConstants.sendPOST(
            DoctorConstants.requestExternalPatient, <String, String>{})
        .then((response) {
      if (response.statusCode == 200) {
        // print(response.body);
        setState(() {});
      } else {
        throw Exception('Failed to GET ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Doctor API: ${onError.toString()}');
    });
    setState(() {
      _inProgress = false;
    });
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
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => NotificationPage(
                      notification: notifications,
                      doctor: doctorInfo,
                      ID: doctorInfo!.details!.passport,
                    )));
      } else {
        throw Exception('Failed to POST ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Notification API: ${onError.toString()}');
    });

    print("notification ${notifications.length}");
  }

  List<Requests> accessRequests = [];

  Future getAccessRequests() async {
    await ApiConstants.sendGET(ApiConstants.getRequestData, <String, String>{})
        .then((response) {
      if (response.statusCode == 200) {
        print(response.body);
        setState(() {
          accessRequests = [];
          for (var requests
              in (List<dynamic>.from(jsonDecode(response.body)))) {
            print("Requests $requests");
            accessRequests.add(Requests(requests));
          }
        });
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => RequestsPage(
                      doctor: doctorInfo!,
                      requests: accessRequests,
                    )));
      } else {
        throw Exception('Failed to POST ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Notification API: ${onError.toString()}');
    });

    print("accessRequests ${accessRequests.length}");
  }

  void alertBox() {
    showDialog<String>(
        context: context,
        builder: (BuildContext context) => AlertDialog(
              backgroundColor: kBackgroundColor,
              title: const Text('Request Patient Data',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: 17,
                      fontFamily: 'Inter')),
              content: Text(
                'The following form will send a broadcast to hospital admin of the patient to request EMR record(s). On acceptance, the data will be available via notification channel. On denial, a polite note will be delivered to you stating the obvious reasons via the notification channel.\n\nThe following below button will discharge the patient. UMMC will not be included in this list',
                style: TextStyle(
                    fontWeight: FontWeight.normal,
                    color: Colors.white70,
                    fontSize: 13,
                    fontFamily: 'Inter'),
                textAlign: TextAlign.justify,
              ),
              actions: <Widget>[
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.all(defaultPadding / 2),
                    child: DropdownButtonFormField<String>(
                        hint: const Text("Hospital Organization"),
                        decoration: InputDecoration(
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                          // filled: true,
                        ),
                        // validator: (value) =>
                        //     value == null ? "Select a doctor" : null,
                        value: selectedOrganization,
                        items: organizations
                            .map((e) => DropdownMenuItem<String>(
                                value: e,
                                child: Text(
                                  e,
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                      overflow: TextOverflow.clip),
                                )))
                            .toList(),
                        onChanged: (newValue) {
                          setState(() {
                            selectedOrganization = newValue;
                          });
                        }),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(defaultPadding / 2),
                  child: TextFormField(
                    keyboardType: TextInputType.streetAddress,
                    textInputAction: TextInputAction.next,
                    cursorColor: kPrimaryColor,
                    controller: patientIDcontroller,
                    decoration: const InputDecoration(
                      hintText: "Patient ID/Passport",
                    ),
                  ),
                ),
                TextButton(
                  onPressed: () {
                    // send

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
                    print(<String, String>{
                      "docName": payload["username"],
                      "PTID": patientIDcontroller.text,
                      "PTORG": selectedOrganization.toString().split(' - ')[1]
                    });

                    print("Access tooken -- ${ApiConstants.accessToken}");
                    await DoctorConstants.sendPOST(
                        DoctorConstants.requestExternalPatient,
                        <String, String>{
                          "docName": payload["username"],
                          "PTID": patientIDcontroller.text,
                          "PTORG":
                              selectedOrganization.toString().split(' - ')[1]
                        }).then((response) {
                      if (response.statusCode == 200) {
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                            content: Text('Doctor Assigned Successful')));
                        return Navigator.pop(context, 'Ok');
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
  }

  Widget patientList() {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(defaultPadding),
          child: ListView.builder(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: doctorInfo!.associatedPatients!.patients.length,
              itemBuilder: (context, index) {
                return SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: defaultPadding),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: Colors.white70,
                      ),
                      child: ListTile(
                        title: Text(
                            doctorInfo!.associatedPatients!.patients.values
                                .toList()[index]
                                .name,
                            style: TextStyle(color: kPrimaryColor)),
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => PatientDetails(
                                        index: index,
                                        patient: doctorInfo!
                                            .associatedPatients!.patients.values
                                            .toList()[index],
                                      )));
                        },
                      ),
                    ),
                  ),
                );
              }),
        ),

        // SizedBox(height: 1000),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return ApiConstants.accessToken.isNotEmpty && doctorInfo != null
        ? Scaffold(
            appBar: AppBar(
              centerTitle: true,
              title: const Text("Doctor's Dashboard"),
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
                    icon: const Icon(
                      Icons.logout,
                      color: Colors.white,
                    ),
                    tooltip: 'Login/Registration',
                    onPressed: () {
                      Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(
                              builder: (context) => WelcomeScreen()));
                    })
              ],
            ),
            drawer: Drawer(
              backgroundColor: kBackgroundColor,
              child: ListView(
                padding: EdgeInsets.zero,
                children: <Widget>[
                  SizedBox(
                    height: 160,
                    child: DrawerHeader(
                      decoration: BoxDecoration(
                        color: kSecondaryColor,
                      ),
                      child: Text(
                        "Notifications\n${doctorInfo!.details!.passport}",
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
                        'Notification',
                        style: TextStyle(color: kTextColor),
                      ),
                      onTap: () {
                        getNotifications();
                      }),
                  ListTile(
                      leading: Icon(Icons.account_circle, color: kTextColor),
                      title: Text(
                        'Access Request',
                        style: TextStyle(color: kTextColor),
                      ),
                      onTap: () {
                        getAccessRequests();
                      }),
                  ListTile(
                      leading: Icon(Icons.contact_mail, color: kTextColor),
                      title: Text(
                        'Request External Patient Record',
                        style: TextStyle(color: kTextColor),
                      ),
                      onTap: () {
                        alertBox();
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
            body: SingleChildScrollView(
              child: Column(
                children: [
                  const Divider(
                    height: 20,
                    thickness: 3,
                    indent: defaultPadding,
                    endIndent: defaultPadding,
                    color: Colors.white70,
                  ),
                  _inProgress
                      ? Center(child: CircularProgressIndicator())
                      : patientList(),
                ],
              ),
            ),
          )
        : Center(child: CircularProgressIndicator());
  }
}
