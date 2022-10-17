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
  int catagoryButtonNumber = 1;
  String category = 'Watc hed';

  List<dynamic> patients = [];

  Future<void> runApplication() async {
    setState(() {});
    await AdminConstants.sendGET(
        AdminConstants.getAllPatientData, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        List tempPatients = jsonDecode(response.body);
        print(tempPatients[0]);
        for (var i in tempPatients) {
          Patient.fromJson(jsonDecode(tempPatients[i]));
          print("Iterations $i : ${tempPatients[i]}");
          // patients.add(Patient);
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
                itemCount: 2,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: EdgeInsets.only(bottom: defaultPadding),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: Colors.white70,
                      ),
                      child: ListTile(
                        title: Text('Patient Name',
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
                      child: const Text('Watched'),
                      padding: const EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: catagoryButtonNumber == 1
                            ? kSecondaryColor
                            : Colors.white70,
                        border: Border.all(color: Colors.black26),
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onTap: () {
                      setState(() {
                        catagoryButtonNumber = 1;
                        category = 'Watched';
                      });
                      runApplication();
                    },
                  ),
                  const SizedBox(width: defaultPadding / 2),
                  InkWell(
                    child: Container(
                      child: const Text('Waiting for discharge'),
                      padding: const EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: catagoryButtonNumber == 2
                            ? kSecondaryColor
                            : Colors.white70,
                        border: Border.all(color: Colors.black26),
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onTap: () {
                      setState(() {
                        catagoryButtonNumber = 2;
                        category = 'waiting_discharge';
                      });
                      runApplication();
                    },
                  ),
                  const SizedBox(width: defaultPadding / 2),
                  InkWell(
                    child: Container(
                      child: const Text('Waiting to be assigned'),
                      padding: const EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: catagoryButtonNumber == 3
                            ? kSecondaryColor
                            : Colors.white70,
                        border: Border.all(color: Colors.black26),
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onTap: () {
                      setState(() {
                        catagoryButtonNumber = 3;
                        category = 'waiting_assigned';
                      });
                      runApplication();
                    },
                  ),
                  const SizedBox(width: defaultPadding / 2),
                  InkWell(
                    child: Container(
                      child: const Text('Not Patient'),
                      padding: const EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: catagoryButtonNumber == 4
                            ? kSecondaryColor
                            : Colors.white70,
                        border: Border.all(color: Colors.black26),
                        borderRadius: BorderRadius.circular(20),
                      ),
                    ),
                    onTap: () {
                      setState(() {
                        catagoryButtonNumber = 4;
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
