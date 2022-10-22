import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/models/doctors.dart';
import 'package:medichain/screens/doctor/models/doctors.dart';
import 'package:medichain/screens/doctor/models/patients.dart';
import 'package:medichain/screens/doctor/pages/patientDetails.dart';
import 'package:medichain/screens/doctor/pages/takeAction.dart';
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
  // List<Patient> currentList = [];
  DoctorDetailsAPIResponse? doctorInfo;
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
    super.initState();
  }

  Future<void> getDoctorInfo() async {
    setState(() {
      _inProgress = true;
    });

    await DoctorConstants.sendGET(
        DoctorConstants.getDoctorInfo, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        print(response.body);
        DoctorDetailsAPIResponse d =
            DoctorDetailsAPIResponse(jsonDecode(response.body));
        // STOPPED HERE
        setState(() {
          doctorInfo = DoctorDetailsAPIResponse(jsonDecode(response.body));
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
                                            .toList()[index]
                                            .patientData,
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
                      onTap: () {
                        // TakeAction();
                      }),
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
