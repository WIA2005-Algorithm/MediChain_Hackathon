import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/pages/create_hospital.dart';

import '../../../constants.dart';
import '../models/network_info.dart';

class NetworkPage extends StatefulWidget {
  const NetworkPage({super.key});

  @override
  State<NetworkPage> createState() => _NetworkPageState();
}

class _NetworkPageState extends State<NetworkPage> {
  String networkStatus = 'Offine';
  Color statusButtonColor = kSecondaryColor;

  // Future startNetwork() async {
  //   await ;
  // }

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
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
      body: Column(
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
          ElevatedButton(
            onPressed: () {},
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

          // Hospital Listbuilder
          ListView.builder(itemBuilder: itemBuilder),
        ],
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
