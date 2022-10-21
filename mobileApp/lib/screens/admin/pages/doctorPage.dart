import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/models/doctors.dart';
import 'package:medichain/screens/admin/pages/doctorDetails.dart';

import '../../../constants.dart';

class DoctorPage extends StatefulWidget {
  const DoctorPage({super.key});

  @override
  State<DoctorPage> createState() => _DoctorPageState();
}

class _DoctorPageState extends State<DoctorPage> {
  int categoryButtonNumber = 0;
  String category = 'Watched';
  List<String> activeList = [
    "Occupied",
    "Unoccupied",
  ];

  List<Doctor> doctorsList = [];
  List<Doctor> currentList = [];
  List<int> currentIndex = [];
  bool _inProgress = false;
  int listLength = 0;

  Future<void> runApplication() async {
    setState(() {
      _inProgress = true;
    });
    await AdminConstants.sendGET(
        AdminConstants.getAllDoctorData, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        List tempDoctors = jsonDecode(response.body);
        int i = 0;
        currentList = [];
        currentIndex = [];
        listLength = 0;
        for (var iteration in tempDoctors) {
          setState(() {
            doctorsList.add(Doctor(iteration));
          });
          if (doctorsList[i].active[1] == activeList[categoryButtonNumber]) {
            setState(() {
              currentList.add(doctorsList[i]);
              currentIndex.add(i);
            });
            listLength++;
          }
          i++;
        }
        print("Current $currentIndex");
      } else {
        throw Exception('Failed to GT ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in GET Doctor API: ${onError.toString()}');
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
    return _inProgress
        ? CircularProgressIndicator()
        : Column(
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
                          padding:
                              const EdgeInsets.only(bottom: defaultPadding),
                          child: Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(10),
                              color: Colors.white70,
                            ),
                            child: ListTile(
                              title: Text(
                                  "${currentList[index].firstName} ${currentList[index].middleName} ${currentList[index].lastName}",
                                  style: TextStyle(color: kPrimaryColor)),
                              onTap: () {
                                Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                        builder: (context) => DoctorDetails(
                                              index: index,
                                              doctor: doctorsList[
                                                  currentIndex[index]],
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
                    // child: Text("${doctorsList[0].active[0]} - ${doctorsList[0].active[0]}"),
                    child: Text("Active - ${activeList[0]}"),
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
                      category = activeList[0];
                    });
                    runApplication();
                  },
                ),
                const SizedBox(width: defaultPadding / 2),
                InkWell(
                  child: Container(
                    child: Text("Active - ${activeList[1]}"),
                    padding: const EdgeInsets.all(8.0),
                    decoration: BoxDecoration(
                      color: categoryButtonNumber == 1
                          ? kSecondaryColor
                          : Colors.white70,
                      border: Border.all(color: Colors.black26),
                      borderRadius: BorderRadius.circular(20),
                    ),
                  ),
                  onTap: () async {
                    setState(() {
                      categoryButtonNumber = 1;
                      category = activeList[1];
                    });
                    await runApplication();
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
        title: const Text("Doctors"),
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
            patientList(),
          ],
        ),
      ),
    );
  }
}
