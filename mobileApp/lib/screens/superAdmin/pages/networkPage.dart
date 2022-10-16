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
  String networkStatus = 'Not Started';
  Color statusButtonColor = kSecondaryColor;
  Color buttonTextColor = kPrimaryColor;
  bool _inProgress = false;
  bool _inProgressList = false;
  bool _isStarted = false;
  bool _customTileExpanded = false;
  static Timer t = Timer(const Duration(seconds: 10), () {});

  Future startNetwork() async {
    setState(() {
      _inProgress = true;
      statusButtonColor = Colors.grey;
      networkStatus = "Starting Network";
    });
    await Future.delayed(Duration(seconds: 3));
    if (networkStatus != "Failed to Start") {
      await SuperAdminConstants.sendPOST(
          SuperAdminConstants.startNetwork, <String, String>{
        "networkName": AllBlockChainNetworksResponse.networkName
      }).then((response) {
        if (response.statusCode == 200) {
          setState(() {
            statusButtonColor = Colors.green;
            networkStatus = "Success";
            _isStarted = true;
            buttonTextColor = Colors.white;
          });
        } else {
          throw Exception('Failed to starting network');
        }
      }).catchError((onError) {
        setState(() {
          statusButtonColor = Colors.red;
          buttonTextColor = Colors.white;
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
    await Future.delayed(Duration(seconds: 2));
    if (networkStatus != "Failed to Start") {
      await SuperAdminConstants.sendPOST(SuperAdminConstants.stopNetwork,
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
          buttonTextColor = Colors.white;
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
    await Future.delayed(Duration(seconds: 2));
    await SuperAdminConstants.sendDELETE(
      SuperAdminConstants.deleteOrganization,
    ).then((response) {
      if (response.statusCode == 200) {
        getNetworkOrgDetails();
      } else {
        throw Exception('Failed to Delete');
      }
    }).catchError((onError) {
      print('Error in Delete Network API: ${onError.toString()}');
    });
    setState(() {
      // _inProgress = false;
    });
  }

  Future getNetworkOrgDetails() async {
    setState(() {
      _inProgress = true;
    });
    await SuperAdminConstants.sendGET(
        SuperAdminConstants.NetworkExists, <String, String>{
      "networkName": AllBlockChainNetworksResponse.networkName
    }).then((response) {
      if (response.statusCode == 200) {
        NetworkInfo.fromJson(jsonDecode(response.body));
        print(
            'WE HAVE SUCCEEDED : ${NetworkInfo.organizations[0].orgFullName}');
        if (NetworkInfo.networkMessage == "Success") {
          print(
              "Network message ${NetworkInfo.networkMessage} ${NetworkInfo.networkCode}");
          setState(() {
            _isStarted = true;
            statusButtonColor = Colors.green;
            networkStatus = "Success";
          });
        } else {
          setState(() {
            _isStarted = false;
            statusButtonColor = kSecondaryColor;
            networkStatus = "Not Started";
          });
        }
      } else {
        throw Exception('Failed to GET ORGANIZATIONS');
      }
    }).catchError((onError) {
      print('Error in GET ORGANIZATIONS API: ${onError.toString()}');
    });
    setState(() {
      _inProgress = false;
    });
  }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getNetworkOrgDetails();
  }

  @override
  void dispose() {
    // TODO: implement dispose
    networkStatus = 'Not Started';
    statusButtonColor = kSecondaryColor;
    _inProgress = false;
    _isStarted = false;
    super.dispose();
  }

  Widget expanedContent(int index) {
    return Column(
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
        const SizedBox(height: defaultPadding * 1.5),
        deleteButton(index),
        const SizedBox(height: defaultPadding * 1.5),
      ],
    );
  }

  Widget deleteButton(int index) {
    return Container(
      width: 150,
      height: 30,
      padding: EdgeInsets.only(left: 30),
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
                    deleteOrganization();
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
            primary: Colors.white,
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
    print("Hospital Count ${AllBlockChainNetworksResponse.hospitalCount}");
    var width = MediaQuery.of(context).size.width;
    return Scaffold(
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
      body: AllBlockChainNetworksResponse.hospitalCount != 0
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
                        print("Network Message ${NetworkInfo.networkMessage}");
                        _isStarted == true ? stopNetwork() : startNetwork();
                      },
                      style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          primary: statusButtonColor,
                          elevation: 0),
                      child: Text(
                        networkStatus.toUpperCase(),
                        style: TextStyle(color: buttonTextColor),
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
                        padding: const EdgeInsets.all(defaultPadding * 0.5),
                        child: Container(
                          color: kPrimaryColor,
                          child: ExpansionTile(
                            backgroundColor: kPrimaryColor,
                            childrenPadding: EdgeInsets.all(10),
                            title: HospitalCard(index: index),
                            children: [expanedContent(index)],
                            trailing: ImageIcon(
                              AssetImage(_customTileExpanded
                                  ? "assets/icons/icon_up.png"
                                  : "assets/icons/icon_down.png"),
                              size: 24,
                              color: kCustomBlue,
                            ),
                            onExpansionChanged: (bool expanded) {
                              setState(() => _customTileExpanded = expanded);
                            },
                          ),
                          // child: ExpandablePanel(
                          //   header: HospitalCard(index: index),
                          //   collapsed: Container(),
                          //   expanded: expanedContent(index),
                          // ),
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
