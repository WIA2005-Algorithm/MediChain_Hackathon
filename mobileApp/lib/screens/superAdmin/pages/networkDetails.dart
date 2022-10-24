import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:medichain/screens/superAdmin/pages/networkCard.dart';
import 'package:medichain/screens/superAdmin/pages/hospitalPage.dart';
import '../../../constants.dart';
import '../models/network_info.dart';

class NetworkDetails extends StatefulWidget {
  const NetworkDetails({super.key});

  @override
  State<NetworkDetails> createState() => _NetworkDetailsState();
}

class _NetworkDetailsState extends State<NetworkDetails> {
  Timer? _timer;
  bool _inProgress = false;
  int networkCount = 0;
  AllBlockChainNetworksResponse? allNetworksResponse;
  String networkName = "";

  Future getNetworkDetails() async {
    setState(() {
      _inProgress = true;
    });
    await SuperAdminConstants.sendGET(
        SuperAdminConstants.NetworkCount, <String, String>{}).then((response) {
      if (response.statusCode == 200) {
        int tempCountVar = jsonDecode(response.body)["count"];
        setState(() {
          networkCount = tempCountVar;
        });
        if (tempCountVar > 0) {
          SuperAdminConstants.sendGET(
                  SuperAdminConstants.AllNetworks, <String, String>{})
              .then((response) {
            if (response.statusCode == 200) {
              setState(() {
                allNetworksResponse =
                    AllBlockChainNetworksResponse(jsonDecode(response.body));
              });
              setState(() {
                networkName = allNetworksResponse!.networkName;
              });
              print("Network Info: ${networkName}");
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
    getNetworkDetails();
    _timer =
        Timer.periodic(const Duration(seconds: 15), (_) => getNetworkDetails());
    super.initState();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  bool loopTimer = true;

  @override
  Widget build(BuildContext context) {
    return _inProgress == true
        ? Center(child: CircularProgressIndicator())
        : networkCount > 0
            ? SingleChildScrollView(
                child: ListView.builder(
                  shrinkWrap: true,
                  physics: ScrollPhysics(),
                  itemCount: networkCount,
                  padding: const EdgeInsets.all(20.0),
                  itemBuilder: ((context, index) {
                    return allNetworksResponse == null
                        ? CircularProgressIndicator()
                        : GestureDetector(
                            child: NetworkCard(
                                networkDetails: allNetworksResponse),
                            onTap: () {
                              // print("PRINTING --$allNetworksResponse");
                              Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                      builder: (context) => NetworkPage(
                                            networkName: networkName,
                                          )));
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
                        "No Network Available Yet",
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
                          "Try adding a new network using the button below",
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
