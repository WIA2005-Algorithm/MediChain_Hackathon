import 'dart:collection';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/models/patients.dart';
import 'package:medichain/screens/admin/pages/patientTile.dart';

import '../../../constants.dart';

class DoctorPage extends StatefulWidget {
  const DoctorPage({super.key});

  @override
  State<DoctorPage> createState() => _DoctorPageState();
}

class _DoctorPageState extends State<DoctorPage> {
  int categoryButtonNumber = 1;
  String category = 'Watched';
  List<String> activeList = [
    "Watched",
    "Waiting For Discharge",
    "Waiting To Be Assigned",
    "Not Patient"
  ];

  List<Patient> patientsList = [];
  List<Patient> currentList = [];

  int listLength = 0;

  Future<void> runApplication() async {
    setState(() {});
    await AdminConstants.sendGET(
        AdminConstants.getAllPatientData, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        List tempPatients = jsonDecode(response.body);
        int i = 0;
        currentList = [];
        listLength = 0;
        for (var iteration in tempPatients) {
          patientsList.add(Patient(iteration));
          if (patientsList[i].active == activeList[categoryButtonNumber]) {
            currentList.add(patientsList[i]);
            listLength++;
          }
          i++;
        }

        setState(() {});
      } else {
        throw Exception('Failed to GT ${response.statusCode}');
      }
    }).catchError((onError) {
      setState(() {});
      print('Error in GET Partients API: ${onError.toString()}');
    });
  }

  void getCategoryList(String categories) {
    setState(() {});
  }

  @override
  void initState() {
    // TODO: implement initState
    runApplication();
    super.initState();
  }

  Widget patientList() {
    return SingleChildScrollView(
      child: Column(
        children: [
          Container(
            padding: EdgeInsets.all(defaultPadding),
            child: ListView.builder(
                shrinkWrap: true,
                itemCount: currentList.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: EdgeInsets.only(bottom: defaultPadding),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: Colors.white70,
                      ),
                      child: ListTile(
                        title: Text("currentList[index].details",
                            style: TextStyle(color: kPrimaryColor)),
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => PatientTile()));
                        },
                      ),
                    ),
                  );
                }),
          ),
        ],
      ),
    );
  }

  Widget categoryHeaders() {
    return SingleChildScrollView(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        child: Column(
          children: [
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                // mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  const SizedBox(width: defaultPadding / 2),
                  InkWell(
                    child: Container(
                      child: Text(activeList[0]),
                      padding: const EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: categoryButtonNumber == 0
                            ? kSecondaryColor
                            : Colors.white70,
                        border: Border.all(color: Colors.black26),
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onTap: () {
                      setState(() {
                        categoryButtonNumber = 0;
                        category = 'Watched';
                      });
                      runApplication();
                    },
                  ),
                  const SizedBox(width: defaultPadding / 2),
                  InkWell(
                    child: Container(
                      child: Text(activeList[1]),
                      padding: const EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: categoryButtonNumber == 1
                            ? kSecondaryColor
                            : Colors.white70,
                        border: Border.all(color: Colors.black26),
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onTap: () {
                      setState(() {
                        categoryButtonNumber = 1;
                        category = 'waiting_discharge';
                      });
                      runApplication();
                    },
                  ),
                  const SizedBox(width: defaultPadding / 2),
                  InkWell(
                    child: Container(
                      child: Text(activeList[2]),
                      padding: const EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: categoryButtonNumber == 2
                            ? kSecondaryColor
                            : Colors.white70,
                        border: Border.all(color: Colors.black26),
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onTap: () {
                      setState(() {
                        categoryButtonNumber = 2;
                        category = 'waiting_assigned';
                      });
                      runApplication();
                    },
                  ),
                  const SizedBox(width: defaultPadding / 2),
                  InkWell(
                    child: Container(
                      child: Text(activeList[3]),
                      padding: const EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: categoryButtonNumber == 3
                            ? kSecondaryColor
                            : Colors.white70,
                        border: Border.all(color: Colors.black26),
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onTap: () {
                      setState(() {
                        categoryButtonNumber = 3;
                        category = 'not_patient';
                      });
                      runApplication();
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Patients"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(2),
          child: Text(
            '',
            style: TextStyle(color: Colors.white60),
          ),
        ),
        //   actions: [
        //     IconButton(
        //         icon: const Icon(
        //           Icons.notifications,
        //           color: Colors.white,
        //         ),
        //         tooltip: 'Login/Registration',
        //         onPressed: () {
        //           Navigator.push(context,
        //               MaterialPageRoute(builder: (context) => Container()));
        //         })
        //   ],
      ),
      body: Container(
        child: Column(
          children: [
            categoryHeaders(),
            const Divider(
              height: 20,
              thickness: 3,
              indent: defaultPadding,
              endIndent: defaultPadding,
              color: Colors.white70,
            ),
            patientList(),
          ],
        ),
      ),
    );
  }
}
