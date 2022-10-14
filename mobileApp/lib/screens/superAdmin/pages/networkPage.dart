import 'package:flutter/material.dart';
import 'package:medichain/screens/superAdmin/pages/create_hospital.dart';
import 'package:medichain/screens/superAdmin/pages/hospitalCard.dart';
import 'package:expandable/expandable.dart';

import '../../../constants.dart';
import '../models/network_info.dart';

class NetworkPage extends StatefulWidget {
  const NetworkPage({super.key});

  @override
  State<NetworkPage> createState() => _NetworkPageState();
}

class _NetworkPageState extends State<NetworkPage> {
  String networkStatus = 'Not Started';
  Color statusButtonColor = kSecondaryColor;
  bool _inProgress = false;
  bool _isStarted = false;

  Future startNetwork() async {
    setState(() {
      _inProgress = true;
      statusButtonColor = Colors.grey;
      networkStatus = "Starting Network";
    });
    await Future.delayed(Duration(seconds: 3));
    if (networkStatus != "Failed to Start") {
      await SuperAdminConstants.sendGET(SuperAdminConstants.startNetwork,
              <String, String>{"networkName": NetworkInfo.networkName})
          .then((response) {
        if (response.statusCode == 200) {
          setState(() {
            statusButtonColor = Colors.green;
            networkStatus = "Success";
            _isStarted = true;
          });
        } else {
          throw Exception('Failed to starting network');
        }
      }).catchError((onError) {
        setState(() {
          statusButtonColor = Colors.red;
          networkStatus = "Failed to Start";
        });
        print('Error in Start Network API: ${onError.toString()}');
      });
    }
    setState(() {
      _inProgress = false;
    });
  }

  Future stopNetwork() async {
    setState(() {
      _inProgress = true;
      statusButtonColor = Colors.grey;
      networkStatus = "Stopping Network";
    });
    await Future.delayed(Duration(seconds: 3));
    if (networkStatus != "Failed to Start") {
      await SuperAdminConstants.sendGET(SuperAdminConstants.stopNetwork,
              <String, String>{"networkName": NetworkInfo.networkName})
          .then((response) {
        if (response.statusCode == 200) {
          setState(() {
            _isStarted = false;
            statusButtonColor = kSecondaryColor;
            networkStatus = "Not Started";
          });
        } else {
          throw Exception('Failed to stop');
        }
      }).catchError((onError) {
        setState(() {
          statusButtonColor = Colors.red;
          networkStatus = "Failed to Start";
        });
        print('Error in Start Network API: ${onError.toString()}');
      });
    }
    setState(() {
      _inProgress = false;
    });
  }

  Future deleteOrganization() async {
    setState(() {
      // _inProgress = true;
      // statusButtonColor = Colors.grey;
      // networkStatus = "Stopping Network";
    });
    await Future.delayed(Duration(seconds: 3));
    await SuperAdminConstants.sendDELETE(
      SuperAdminConstants.deleteOrganization,
    ).then((response) {
      if (response.statusCode == 200) {
        setState(() {
          // _isStarted = false;
          // statusButtonColor = kSecondaryColor;
          // networkStatus = "Not Started";
        });
      } else {
        throw Exception('Failed to Delete');
      }
    }).catchError((onError) {
      setState(() {
        // statusButtonColor = Colors.red;
        // networkStatus = "Failed to Start";
      });
      print('Error in Delete Network API: ${onError.toString()}');
    });

    setState(() {
      // _inProgress = false;
    });
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  void dispose() {
    // TODO: implement dispose
    networkStatus = 'Not Started';
    statusButtonColor = kSecondaryColor;
    _inProgress = false;
    _isStarted = false;
    startNetwork();
    stopNetwork();
    super.dispose();
  }

  Widget expanedContent() {
    return Column(
      children: [
        // Other Hospital Details
        SizedBox(height: defaultPadding / 2),
        deleteButton(),
        SizedBox(height: defaultPadding * 1.5),
      ],
    );
  }

  Widget deleteButton() {
    return Container(
      width: 150,
      height: 30,
      padding: EdgeInsets.only(left: 30),
      child: ElevatedButton(
        onPressed: () {
          showDialog<String>(
            context: context,
            builder: (BuildContext context) => AlertDialog(
              title: const Text('Delete Organisation'),
              content: const Text('AlertDialog description'),
              actions: <Widget>[
                TextButton(
                  onPressed: () => Navigator.pop(context, 'Cancel'),
                  child: const Text('Cancel'),
                ),
                TextButton(
                  onPressed: () => Navigator.pop(context, 'OK'),
                  child: const Text('OK'),
                ),
              ],
            ),
          );
        },
        style: ElevatedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            primary: Colors.red,
            elevation: 0),
        child: Text(
          "Delete Organization".toUpperCase(),
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.black, fontSize: 12),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    var width = MediaQuery.of(context).size.width;
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text("${NetworkInfo.networkName}"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(2),
          child: Text(
            'Add new hospitals or enroll/delete hospital',
            style: TextStyle(color: Colors.white60),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.all(defaultPadding),
              child: Text(
                "Network Status",
                style: TextStyle(
                    fontSize: 20,
                    fontFamily: "Inter",
                    color: Colors.white70,
                    fontWeight: FontWeight.bold),
              ),
            ),
            // Insert Interactable button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: defaultPadding),
              child: ElevatedButton(
                onPressed: () {
                  _isStarted ? stopNetwork() : startNetwork();
                },
                style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                    primary: statusButtonColor,
                    elevation: 0),
                child: Text(
                  networkStatus.toUpperCase(),
                  style: TextStyle(color: Colors.black),
                ),
              ),
            ),
            ListView.builder(
              shrinkWrap: true,
              physics: ScrollPhysics(),
              itemCount: NetworkInfo.hospitalCount,
              padding: const EdgeInsets.all(20.0),
              itemBuilder: ((context, index) {
                return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Container(
                    color: kPrimaryColor,
                    child: ExpandablePanel(
                      header: HospitalCard(),
                      collapsed: Container(),
                      expanded: expanedContent(),
                    ),
                  ),
                );

                // return GestureDetector(
                //   child: HospitalCard(),
                //   onTap: () {
                //     // Navigator.push(context,
                //     //     MaterialPageRoute(builder: (context) => NetworkPage()));
                //   },
                // );
              }),
            ),

            // Hospital Listbuilder
            // ListView.builder(itemBuilder: itemBuilder),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(context,
              MaterialPageRoute(builder: (context) => CreateHospital()));
        },
        label: const Text(
          'Add Hospital',
          style: TextStyle(color: kPrimaryColor),
        ),
        icon: const Icon(
          Icons.add,
          color: kPrimaryColor,
        ),
        backgroundColor: kSecondaryColor,
      ),
    );
  }
}
