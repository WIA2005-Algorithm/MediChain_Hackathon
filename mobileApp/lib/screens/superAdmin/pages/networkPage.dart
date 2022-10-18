import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:medichain/screens/superAdmin/pages/create_hospital.dart';
import 'package:medichain/screens/superAdmin/pages/hospitalCard.dart';
import '../../../constants.dart';
import '../models/network_info.dart';

class NetworkPage extends StatefulWidget {
  const NetworkPage({super.key});

  @override
  State<NetworkPage> createState() => _NetworkPageState();
}

class _NetworkPageState extends State<NetworkPage> {
  String networkStatus = 'Loading';
  Color statusButtonColor = Colors.grey;
  Color buttonTextColor = Colors.black;
  bool _inProgress = false;
  int _isStarted = 300;
  bool _customTileExpanded = false;
  late Timer t;
  int hospitalCount = 0;

  List<String> orgName = [];
  List<String> createdAt = [];

  Future startNetwork() async {
    setState(() {
      buttonTextColor = Colors.black;
      statusButtonColor = Colors.grey;
      networkStatus = "Starting Network";
    });
    await SuperAdminConstants.sendPOST(
        SuperAdminConstants.startNetwork, <String, String>{
      "networkName": AllBlockChainNetworksResponse.networkName
    }).then((response) {
      if (response.statusCode == 200) {
        checkNetworkStatus();
      } else {
        throw Exception('Failed to starting network');
      }
    }).catchError((onError) {
      setState(() {
        statusButtonColor = Colors.red;
        buttonTextColor = Colors.white;
        networkStatus = "Failed to Start the network";
        _isStarted = 500;
      });
      print('Error in Start Network API: ${onError.toString()}');
    });
  }

  Future stopNetwork() async {
    setState(() {
      buttonTextColor = Colors.black;
      statusButtonColor = Colors.grey;
      networkStatus = "Stopping Network";
    });
    // await Future.delayed(Duration(seconds: 2));
    await SuperAdminConstants.sendPOST(SuperAdminConstants.stopNetwork,
            <String, String>{"networkName": NetworkInfo.networkName})
        .then((response) {
      if (response.statusCode == 200) {
        checkNetworkStatus();
      } else {
        throw Exception('Failed to stop');
      }
    }).catchError((onError) {
      setState(() {
        statusButtonColor = Colors.red;
        buttonTextColor = Colors.white;
        networkStatus = "Failed to Stop the network";
        _isStarted = 400;
      });
      print('Error in Start Network API: ${onError.toString()}');
    });
  }

  void setColor(int code) {
    switch (code) {
      // Success
      case 200:
        setState(() {
          statusButtonColor = Colors.green;
          buttonTextColor = Colors.white;
        });
        break;
      // Not Startedd
      case 0:
        setState(() {
          statusButtonColor = kSecondaryColor;
          buttonTextColor = Colors.black;
        });
        break;
      // Failed to Stop Network
      case 400:
      // Failed to Start Network
      case 500:
        setState(() {
          statusButtonColor = Colors.red;
          buttonTextColor = Colors.white;
        });
        break;
      // Starting or Stopping : Pending
      case 300:
        setState(() {
          statusButtonColor = Colors.grey;
          // buttonTextColor = Colors.black;
        });
        break;
    }
  }

  Future checkNetworkStatus() async {
    setState(() {
      // _inProgress = true;
    });
    await SuperAdminConstants.sendGET(
        SuperAdminConstants.NetworkStatus, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        Map<String, dynamic> responseData = jsonDecode(response.body);
        print(responseData.toString());
        setState(() {
          _isStarted = responseData["code"];
          networkStatus = "${responseData["message"]}";
          // _inProgress = false;
          setColor(responseData["code"]);
        });
      } else {
        throw Exception('Failed to stop');
      }
    }).catchError((onError) {
      setState(() {
        statusButtonColor = Colors.red;
        buttonTextColor = Colors.white;
        networkStatus = "Failed to Start";
        // _inProgress = false;
      });
      print('Error in Check Network API: ${onError.toString()}');
    });
  }

  Future enrollAdmin(String orgName) async {
    setState(() {
      _inProgress = true;
    });
    print(orgName);
    await SuperAdminConstants.sendPOST(
            SuperAdminConstants.enrollAdmin + "/$orgName", <String, String>{})
        .then((response) {
      print(response.statusCode);
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Admin Enrolled successfully')));
        setState(() {
          _inProgress = false;
        });
      } else {
        throw Exception('Failed to Enrollment');
      }
    }).catchError((onError) {
      print('Error in Admin Enrollment API: ${onError.toString()}');

      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(onError.toString())));
    });
    getNetworkOrgDetails();

    setState(() {
      _inProgress = false;
    });
  }

  Future deleteOrganization(int i) async {
    await SuperAdminConstants.sendDELETE(
      SuperAdminConstants.deleteOrganization +
          "/${NetworkInfo.networkName}/${NetworkInfo.organizations[i].orgId}/${NetworkInfo.organizations[i].adminID}",
    ).then((response) {
      print(response.body);

      if (response.statusCode == 200) {
        getNetworkOrgDetails();
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Deleted Organization successfully')));
      } else {
        throw Exception('Failed to Delete');
      }
    }).catchError((onError) {
      print('Error in Delete Network API: ${onError.toString()}');
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(onError.toString())));
    });
    getNetworkOrgDetails();
  }

  Future getNetworkOrgDetails() async {
    print("Api run");
    setState(() {
      _inProgress = true;
      hospitalCount = 0;
    });
    orgName = [];
    createdAt = [];
    await SuperAdminConstants.sendGET(
        SuperAdminConstants.NetworkExists, <String, String>{
      "networkName": AllBlockChainNetworksResponse.networkName
    }).then((response) {
      if (response.statusCode == 200) {
        NetworkInfo.fromJson(jsonDecode(response.body));
        // orgName.add(NetworkInfo.)
        // print(
        //     'WE HAVE SUCCEEDED : ${NetworkInfo.organizations[0].orgFullName} $_inProgress');
        // print(NetworkInfo.networkName);
        setState(() {
          _inProgress = false;
          hospitalCount = NetworkInfo.hospitalCount;
        });
      } else {
        throw Exception('Failed to GET ORGANIZATIONS');
      }
    }).catchError((onError) {
      print('Error in GET ORGANIZATIONS API: ${onError.toString()}');
    });
    // print(
    //     "Hospital Count ${AllBlockChainNetworksResponse.hospitalCount} $_inProgress");
    setState(() {
      _inProgress = false;
    });
  }

  @override
  void initState() {
    // TODO: implement initState
    checkNetworkStatus();
    super.initState();
    getNetworkOrgDetails();
    t = Timer(const Duration(seconds: 5), getNetworkOrgDetails);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    networkStatus = 'Loading';
    statusButtonColor = Colors.grey;
    _isStarted = 300;
    _inProgress = false;
    t.cancel();
    super.dispose();
  }

  Widget expanedContent(int index) {
    return Container(
      padding: EdgeInsets.all(defaultPadding),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            // Change to hospital Name
            "Admin Credentials",
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
                decoration: TextDecoration.underline,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 15,
                fontFamily: 'Inter'),
          ),
          const SizedBox(height: defaultPadding / 2),
          const Text(
            // Change to hospital Name
            "Admin ID",
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
                fontWeight: FontWeight.normal,
                color: Colors.white70,
                fontSize: 13,
                fontFamily: 'Inter'),
          ),
          Text(
            // Change to hospital Name
            NetworkInfo.organizations[index].adminID,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 14,
                fontFamily: 'Inter'),
          ),
          const SizedBox(height: defaultPadding / 2),
          const Text(
            // Change to hospital Name
            "Admin Password",
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
                fontWeight: FontWeight.normal,
                color: Colors.white70,
                fontSize: 13,
                fontFamily: 'Inter'),
          ),
          Text(
            // Change to hospital Name
            NetworkInfo.organizations[index].adminpassword,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 14,
                fontFamily: 'Inter'),
          ),
          const SizedBox(height: defaultPadding),
          const Text(
            // Change to hospital Name
            "Certificate Authority",
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
                decoration: TextDecoration.underline,
                fontWeight: FontWeight.bold,
                color: Color(0xFFFFFFFF),
                fontSize: 15,
                fontFamily: 'Inter'),
          ),
          const SizedBox(height: defaultPadding / 2),
          const Text(
            // Change to hospital Name
            "State",
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
                fontWeight: FontWeight.normal,
                color: Colors.white70,
                fontSize: 13,
                fontFamily: 'Inter'),
          ),
          Text(
            // Change to hospital Name
            NetworkInfo.organizations[index].state,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 14,
                fontFamily: 'Inter'),
          ),
          const SizedBox(height: defaultPadding / 2),
          const Text(
            // Change to hospital Name
            "Country",
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
                fontWeight: FontWeight.normal,
                color: Colors.white70,
                fontSize: 13,
                fontFamily: 'Inter'),
          ),
          Text(
            // Change to hospital Name
            NetworkInfo.organizations[index].country,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white,
                fontSize: 14,
                fontFamily: 'Inter'),
          ),
          const SizedBox(height: defaultPadding),
          enrollButton(index),
          deleteButton(index),
          const SizedBox(height: defaultPadding),
        ],
      ),
    );
  }

  Widget enrollButton(int index) {
    return Container(
      // width: 150,
      height: 60,
      padding: EdgeInsets.only(top: defaultPadding),
      child: ElevatedButton(
        onPressed: () {
          showDialog<String>(
            context: context,
            builder: (BuildContext context) => AlertDialog(
              backgroundColor: kBackgroundColor,
              title: const Text('Enroll Admins',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: 17,
                      fontFamily: 'Inter')),
              // ${NetworkInfo.organizations[index].adminID}
              content: Text(
                  'Are you sure you want to enroll ${NetworkInfo.organizations[index].adminID} of ${NetworkInfo.networkName}?',
                  style: TextStyle(
                      fontWeight: FontWeight.normal,
                      color: Colors.white70,
                      fontSize: 15,
                      fontFamily: 'Inter')),
              actions: <Widget>[
                TextButton(
                  onPressed: () => Navigator.pop(context, 'Cancel'),
                  child: const Text('Cancel',
                      style: TextStyle(
                          fontWeight: FontWeight.normal,
                          color: Colors.white70,
                          fontSize: 15,
                          fontFamily: 'Inter')),
                ),
                TextButton(
                  onPressed: () {
                    enrollAdmin(NetworkInfo.organizations[index].orgName);
                    Navigator.pop(context, 'OK');
                  },
                  child: const Text('OK',
                      style: TextStyle(
                          fontWeight: FontWeight.normal,
                          color: Colors.white70,
                          fontSize: 15,
                          fontFamily: 'Inter')),
                ),
              ],
            ),
          );
        },
        style: ElevatedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            primary: kSecondaryColor,
            elevation: 0),
        child: Text(
          // NetworkInfo.organizations[index].enrolled == 0
          //     ?
          "Enroll Admins".toUpperCase(),
          // : "Admins Enrolled".toUpperCase(),
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.black, fontSize: 12),
        ),
      ),
    );
  }

  Widget deleteButton(int index) {
    return Container(
      // width: 150,
      height: 60,
      padding: EdgeInsets.only(top: defaultPadding),
      child: ElevatedButton(
        onPressed: () {
          showDialog<String>(
            context: context,
            builder: (BuildContext context) => AlertDialog(
              backgroundColor: kBackgroundColor,
              title: const Text('Delete Organisation',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: 17,
                      fontFamily: 'Inter')),
              content: Text(
                  'Are you sure you want to delete ${NetworkInfo.organizations[index].orgFullName} from ${NetworkInfo.networkName}?',
                  style: TextStyle(
                      fontWeight: FontWeight.normal,
                      color: Colors.white70,
                      fontSize: 15,
                      fontFamily: 'Inter')),
              actions: <Widget>[
                TextButton(
                  onPressed: () => Navigator.pop(context, 'Cancel'),
                  child: const Text('Cancel',
                      style: TextStyle(
                          fontWeight: FontWeight.normal,
                          color: Colors.white70,
                          fontSize: 15,
                          fontFamily: 'Inter')),
                ),
                TextButton(
                  onPressed: () {
                    deleteOrganization(index);
                    Navigator.pop(context, 'OK');
                  },
                  child: const Text('OK',
                      style: TextStyle(
                          fontWeight: FontWeight.normal,
                          color: Colors.red,
                          fontSize: 15,
                          fontFamily: 'Inter')),
                ),
              ],
            ),
          );
        },
        style: ElevatedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10),
            ),
            primary: Colors.white70,
            elevation: 0),
        child: Text(
          "Delete Organization".toUpperCase(),
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.white, fontSize: 12),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return _inProgress == true
        ? Center(child: CircularProgressIndicator())
        : Scaffold(
            appBar: AppBar(
              centerTitle: true,
              title: Text("${AllBlockChainNetworksResponse.networkName}"),
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
            body: hospitalCount != 0
                ? SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Padding(
                          padding: EdgeInsets.all(defaultPadding * 2),
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
                          padding: const EdgeInsets.symmetric(
                              horizontal: defaultPadding * 2),
                          child: ElevatedButton(
                            onPressed: () {
                              print(
                                  "Network Message ${NetworkInfo.networkMessage}");
                              switch (_isStarted) {
                                case 200:
                                case 400:
                                  stopNetwork();
                                  break;
                                case 0:
                                case 500:
                                  startNetwork();
                                  break;
                                case 300:
                                  break;
                              }
                              // _isStarted == true
                              //     ? stopNetwork()
                              //     : startNetwork();
                            },
                            style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                primary: statusButtonColor,
                                elevation: 0),
                            child: _isStarted == 300
                                ? CircularProgressIndicator(
                                    color: kSecondaryColor)
                                : Text(
                                    networkStatus.toUpperCase(),
                                    style: TextStyle(color: buttonTextColor),
                                  ),
                          ),
                        ),
                        ListView.builder(
                          shrinkWrap: true,
                          physics: ScrollPhysics(),
                          itemCount: hospitalCount,
                          padding: const EdgeInsets.all(20.0),
                          itemBuilder: ((context, index) {
                            return Padding(
                              padding:
                                  const EdgeInsets.all(defaultPadding * 0.5),
                              child: Container(
                                color: kPrimaryColor,
                                child: ExpansionTile(
                                  backgroundColor: kPrimaryColor,
                                  childrenPadding: EdgeInsets.all(10),
                                  title: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        // Change to hospital Name
                                        NetworkInfo
                                            .organizations[index].orgFullName,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,
                                            fontSize: 15,
                                            fontFamily: 'Inter'),
                                      ),
                                      SizedBox(height: 10),
                                      Text(
                                        NetworkInfo
                                            .organizations[index].createdAt,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: Colors.white,
                                            fontSize: 13,
                                            fontFamily: 'Inter'),
                                      ),
                                    ],
                                  ),
                                  children: [expanedContent(index)],
                                  trailing: ImageIcon(
                                    AssetImage(_customTileExpanded
                                        ? "assets/icons/icon_up.png"
                                        : "assets/icons/icon_down.png"),
                                    size: 24,
                                    color: kCustomBlue,
                                  ),
                                  onExpansionChanged: (bool expanded) {
                                    setState(
                                        () => _customTileExpanded = expanded);
                                  },
                                ),
                              ),
                            );
                          }),
                        ),
                      ],
                    ),
                  )
                : Container(
                    child: Center(
                      child: Column(
                        children: [
                          const SizedBox(height: 100),
                          Image.asset(
                            "assets/images/empty_blockchain.png",
                            height: 200,
                            width: 200,
                          ),
                          const SizedBox(height: 5),
                          const Text(
                            "No Hospitals Available Yet",
                            style: TextStyle(
                                fontSize: 22,
                                fontFamily: "Inter",
                                color: Colors.white70,
                                fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 5),
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 30),
                            child: Text(
                              "Try adding a new hospital into the network using the button below",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                  fontSize: 15,
                                  fontFamily: "Inter",
                                  color: Colors.white54),
                            ),
                          ),
                        ],
                      ),
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
