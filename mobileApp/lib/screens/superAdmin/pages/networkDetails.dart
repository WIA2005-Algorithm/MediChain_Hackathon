import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:medichain/constants.dart';
import 'package:medichain/screens/superAdmin/models/framework.dart';
import 'package:medichain/screens/superAdmin/models/network_info.dart';
import 'package:medichain/screens/superAdmin/pages/networkCard.dart';
import 'package:medichain/screens/superAdmin/pages/networkPage.dart';

class NetworkDetails extends StatefulWidget {
  const NetworkDetails({super.key});

  @override
  State<NetworkDetails> createState() => _NetworkDetailsState();
}

class _NetworkDetailsState extends State<NetworkDetails> {
  bool _inProgress = false;
  int currentCount = 0;

  Future getNetworkDetails() async {
    setState(() {
      _inProgress = true;
    });
    await SuperAdminConstants.sendGET(
        SuperAdminConstants.NetworkCount, <String, String>{}).then((response) {
      currentCount = NetworkInfo.networkCount;
      if (response.statusCode == 200) {
        NetworkInfo.getCount(jsonDecode(response.body));
        // print("API Network Count: ${NetworkInfo.networkCount}");
        if (NetworkInfo.networkCount > 0) {
          SuperAdminConstants.sendGET(
                  SuperAdminConstants.AllNetworks, <String, String>{})
              .then((response) {
            if (response.statusCode == 200) {
              NetworkInfo.fromJson(jsonDecode(response.body));
            } else {
              throw Exception('Failed to GET all networks');
            }
          }).catchError((onError) {
            print('Error in All Network API: ${onError.toString()}');
          });
        }
      } else {
        throw Exception('Failed to GET count');
      }
    }).catchError((onError) {
      print('Error in Count API: ${onError.toString()}');
    });
    setState(() {
      _inProgress = false;
    });
  }

  @override
  void initState() {
    // TODO: implement initState
    getNetworkDetails();
    super.initState();
  }

  // Create network details class - store network details

  @override
  Widget build(BuildContext context) {
    // Future.delayed(Duration(seconds: 10)).then((value) => getNetworkDetails());

    // print("Boolean ${NetworkInfo.networkCount != currentCount}");

    return _inProgress == true && currentCount != NetworkInfo.networkCount
        // ||
        // NetworkInfo.networkName == ''
        ? Center(child: CircularProgressIndicator())
        : NetworkInfo.networkCount > 0
            ? SingleChildScrollView(
                child: ListView.builder(
                  shrinkWrap: true,
                  physics: ScrollPhysics(),
                  itemCount: NetworkInfo.networkCount,
                  padding: const EdgeInsets.all(20.0),
                  itemBuilder: ((context, index) {
                    return GestureDetector(
                      child: NetworkCard(),
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => NetworkPage()));
                      },
                    );
                  }),
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
              );
  }
}
