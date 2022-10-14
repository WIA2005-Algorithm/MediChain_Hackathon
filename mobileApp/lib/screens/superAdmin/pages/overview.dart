import 'package:flutter/material.dart';
import 'package:medichain/constants.dart';
import 'package:medichain/screens/superAdmin/models/network_info.dart';
import 'package:medichain/screens/superAdmin/pages/create_network.dart';
import 'package:medichain/screens/superAdmin/pages/networkDetails.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../components/custom_widget.dart';
import '../models/framework.dart';

class SuperAdminOverview extends StatefulWidget {
  const SuperAdminOverview({super.key});

  @override
  State<SuperAdminOverview> createState() => _SuperAdminOverviewState();
}

class _SuperAdminOverviewState extends State<SuperAdminOverview> {
  final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

  // String? value = await ApiConstants.getSharedValue("accessToken");

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    // use shared access or create a constant class to store the access token widely
  }

  Stream? chatRoomsStream;

  @override
  Widget build(BuildContext context) {
    return ApiConstants.accessToken.isEmpty
        ? const CircularProgressIndicator()
        //       : StreamBuilder(
        //           stream: chatRoomsStream,
        //           builder: ((context, NetworkInfo) {
        //             return ListView.builder(
        //               itemCount: NetworkInfo.data?.docs[''],
        //               itemBuilder: ((context, index) {
        //                 return snapshot.data?.docs != null
        //                     ? ChatRoomTile(
        //                         userName: snapshot.data!.docs[index]
        //                             .data()['chatroomId']
        //                             .toString()
        //                             .replaceAll("_", "")
        //                             .replaceAll(Constant.myName, ""),
        //                         chatRoomId: snapshot.data!.docs[index]['chatroomId'],
        //                       )
        //                     : CircularProgressIndicator();
        //               }),
        //             );
        //           }),
        //         );

        : Scaffold(
            appBar: AppBar(
              centerTitle: true,
              title: const Text("Available Networks"),
              elevation: 0,
              backgroundColor: kBackgroundColor,
              bottom: const PreferredSize(
                preferredSize: Size.fromHeight(2),
                child: Text(
                  'Create a new network or clock on available network',
                  style: TextStyle(color: Colors.white60),
                ),
              ),
            ),
            body: NetworkDetails(),
            floatingActionButton: FloatingActionButton.extended(
              onPressed: () {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => CreateNetwork()));
              },
              label: const Text(
                'Create',
                style: TextStyle(color: kPrimaryColor),
              ),
              icon: const Icon(
                Icons.add,
                color: kPrimaryColor,
              ),
              backgroundColor: kSecondaryColor,
            ),
            // Align(
            //   alignment: Alignment.bottomCenter,
            //   child: Container(
            //     padding: const EdgeInsets.symmetric(
            //         horizontal: 30, vertical: 30),
            //     child: SingleChildScrollView(
            //       child: Column(
            //         mainAxisAlignment: MainAxisAlignment.end,
            //         children: [
            //           ElevatedButton(
            //             onPressed: () {
            //               Navigator.push(
            //                   context,
            //                   MaterialPageRoute(
            //                       builder: (context) => CreateNetwork()));
            //             },
            //             style: ElevatedButton.styleFrom(
            //                 primary: kSecondaryColor, elevation: 0),
            //             child: Text(
            //               "Create new Network".toUpperCase(),
            //               style: const TextStyle(color: Colors.black),
            //             ),
            //           ),
            //         ],
            //       ),
            //     ),
            //   ),
            // ),
          );
  }
}
