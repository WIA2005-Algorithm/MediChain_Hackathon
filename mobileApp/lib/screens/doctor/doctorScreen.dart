import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/models/doctors.dart';
import 'package:medichain/screens/doctor/models/patients.dart';
import 'package:medichain/screens/doctor/pages/patientDetails.dart';
import '../../constants.dart';
import '../welcome/welcome_screen.dart';

class DoctorScreen extends StatefulWidget {
  const DoctorScreen({super.key});

  @override
  State<DoctorScreen> createState() => _DoctorScreenState();
}

class _DoctorScreenState extends State<DoctorScreen> {
  // int _selectedIndex = 0;
  // List _widgetOptions = [];
  bool _inProgress = false;
  TextStyle optionStyle = TextStyle(fontSize: 30, fontWeight: FontWeight.bold);

  List<Patient> patientsList = [];
  List<Patient> currentList = [];
  Doctor doctorInfo = Doctor(<String, String>{});
  List<int> currentIndex = [];
  int listLength = 0;

  // void _onItemTapped(int index) {
  //   setState(() {
  //     _selectedIndex = index;
  //   });
  // }

  @override
  void initState() {
    // TODO: implement initState
    getDoctorInfo();
    getPatientInfo();
    super.initState();
  }

  Future<void> getPatientInfo() async {
    setState(() {
      _inProgress = true;
    });

    await DoctorConstants.sendGET(
        "${DoctorConstants.getPatientInfo}/ptID=${doctorInfo.passport}",
        <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        // print(response.body);
        int i = 0;
        setState(() {
          patientsList = [];
          listLength = 0;
        });
        List tempPatients = jsonDecode(response.body);

        for (var iteration in tempPatients) {
          setState(() {
            patientsList.add(Patient(iteration));
          });
          i++;
        }
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

  Future<void> getDoctorInfo() async {
    setState(() {
      _inProgress = true;
    });

    await DoctorConstants.sendGET(
        DoctorConstants.getDoctorInfo, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        // print(response.body);
        setState(() {
          doctorInfo = Doctor(jsonDecode(response.body));
        });
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

  Widget patientList() {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(defaultPadding),
          child: ListView.builder(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: patientsList.length,
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
                            "${patientsList[index].firstName == "UNDEFINED" ? "" : patientsList[index].firstName} ${patientsList[index].middleName == "UNDEFINED" ? "" : patientsList[index].middleName} ${currentList[index].lastName == "UNDEFINED" ? "" : patientsList[index].lastName}",
                            style: TextStyle(color: kPrimaryColor)),
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => PatientDetails(
                                        index: index,
                                        patient:
                                            patientsList[currentIndex[index]],
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
    return ApiConstants.accessToken.isNotEmpty
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
                      leading: Icon(Icons.account_circle, color: kTextColor),
                      title: Text(
                        'Take Action',
                        style: TextStyle(color: kTextColor),
                      ),
                      onTap: () {}),
                  ListTile(
                      leading: Icon(Icons.contact_mail, color: kTextColor),
                      title: Text(
                        'Request Patient Data',
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
