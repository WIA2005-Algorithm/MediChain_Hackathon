import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/models/patients.dart';
import 'package:medichain/screens/admin/pages/patientDetails.dart';

import '../../../constants.dart';

class PatientPage extends StatefulWidget {
  const PatientPage({super.key});

  @override
  State<PatientPage> createState() => _PatientPageState();
}

class _PatientPageState extends State<PatientPage> {
  int categoryButtonNumber = 0;
  List<String> activeList = [
    "Actively Watched",
    "Waiting For Discharge",
    "Waiting To Be Assigned",
    "Not Patients"
  ];

  List<Patient> patientsList = [];
  List<Patient> currentList = [];
  List<int> currentIndex = [];
  bool _inProgress = false;
  int listLength = 0;

  Future<void> runApplication() async {
    setState(() {
      _inProgress = true;
    });
    await AdminConstants.sendGET(
        AdminConstants.getAllPatientData, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        int i = 0;
        setState(() {
          patientsList = [];
          currentList = [];
          currentIndex = [];
          listLength = 0;
        });
        List tempPatients = jsonDecode(response.body);

        for (var iteration in tempPatients) {
          setState(() {
            patientsList.add(Patient(iteration));
          });
          if (patientsList[i].active == activeList[categoryButtonNumber]) {
            setState(() {
              currentList.add(patientsList[i]);
              currentIndex.add(i);
              listLength++;
            });
          }
          i++;
        }
        print("Current $currentIndex");
      } else {
        throw Exception('Failed to GT ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Partients API: ${onError.toString()}');
    });
    setState(() {
      _inProgress = false;
    });
  }

  @override
  void initState() {
    // TODO: implement initState
    runApplication();
    super.initState();
  }

  Widget patientList() {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(defaultPadding),
          child: ListView.builder(
              physics: const NeverScrollableScrollPhysics(),
              shrinkWrap: true,
              itemCount: currentList.length,
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
                            "${currentList[index].firstName == "UNDEFINED" ? "" : currentList[index].firstName} ${currentList[index].middleName == "UNDEFINED" ? "" : currentList[index].middleName} ${currentList[index].lastName == "UNDEFINED" ? "" : currentList[index].lastName}",
                            style: TextStyle(color: kPrimaryColor)),
                        onTap: () {
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => PatientDetails(
                                        index: index,
                                        patient:
                                            patientsList[currentIndex[index]],
                                        activeList: activeList,
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

  Widget categoryHeaders() {
    return Container(
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
                    });
                    runApplication();
                  },
                ),
              ],
            ),
          ),
        ],
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
      ),
      body: SingleChildScrollView(
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
            _inProgress
                ? Center(child: CircularProgressIndicator())
                : patientList(),
          ],
        ),
      ),
    );
  }
}
