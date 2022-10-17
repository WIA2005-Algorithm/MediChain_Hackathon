import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:medichain/screens/superAdmin/pages/networkCard.dart';
import 'package:medichain/screens/superAdmin/pages/networkPage.dart';

import '../../../constants.dart';
import '../models/network_info.dart';

class NetworkDetails extends StatefulWidget {
  const NetworkDetails({super.key});

  @override
  State<NetworkDetails> createState() => _NetworkDetailsState();
}

class _NetworkDetailsState extends State<NetworkDetails> {
  bool _inProgress = false;
  int currentCount = 0;
  // static Timer t = Timer(const Duration(seconds: 5), () {});

  Future getNetworkDetails() async {
    setState(() {
      _inProgress = true;
    });
    await SuperAdminConstants.sendGET(
        SuperAdminConstants.NetworkCount, <String, String>{}).then((response) {
      currentCount = AllBlockChainNetworksResponse.networkCount;
      if (response.statusCode == 200) {
        AllBlockChainNetworksResponse.getCount(jsonDecode(response.body));
        if (AllBlockChainNetworksResponse.networkCount > 0 &&
            currentCount != AllBlockChainNetworksResponse.networkCount) {
          SuperAdminConstants.sendGET(
                  SuperAdminConstants.AllNetworks, <String, String>{})
              .then((response) {
            if (response.statusCode == 200) {
              AllBlockChainNetworksResponse.fromJson(jsonDecode(response.body));
              print("Network Info:$AllBlockChainNetworksResponse");
              setState(() {
                _inProgress = false;
              });
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
    // t = Timer(const Duration(seconds: 5), getNetworkDetails);
    super.initState();
  }

  // Create network details class - store network details

  @override
  Widget build(BuildContext context) {
    return _inProgress == true
        ? Center(child: CircularProgressIndicator())
        : AllBlockChainNetworksResponse.networkCount > 0
            ? SingleChildScrollView(
                child: ListView.builder(
                  shrinkWrap: true,
                  physics: ScrollPhysics(),
                  itemCount: AllBlockChainNetworksResponse.networkCount,
                  padding: const EdgeInsets.all(20.0),
                  itemBuilder: ((context, index) {
                    return GestureDetector(
                      child: NetworkCard(),
                      onTap: () {
                        // t.cancel();
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
