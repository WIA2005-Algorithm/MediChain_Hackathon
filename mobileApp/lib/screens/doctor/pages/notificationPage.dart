import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/doctor/models/doctors.dart';
import 'package:medichain/screens/doctor/models/notifications.dart';
import 'package:medichain/screens/doctor/models/patients.dart';
import 'package:medichain/screens/doctor/pages/takeAction.dart';

import '../../../constants.dart';

class NotificationPage extends StatefulWidget {
  final List<NotificationResponseAPI> notification;
  final DoctorDetailsAPIResponse? doctor;
  final PatientDetailsAPIResponse? patient;
  final String ID;
  const NotificationPage(
      {super.key,
      required this.notification,
      this.doctor,
      required this.ID,
      this.patient});

  @override
  State<NotificationPage> createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  bool _isRead = false;
  Object? selectedButton;

  Future getNotifications(int index) async {
    await ApiConstants.sendPOST(ApiConstants.markNotificationRead,
            <String, String>{"_id": widget.notification[index].id})
        .then((response) {
      if (response.statusCode == 200) {
        print(response.body);
        setState(() {
          _isRead = widget.notification[index].Read;
        });
        Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => TakeAction(
                      notification: widget.notification[index],
                      doctor: widget.doctor,
                      patient: widget.patient,
                    )));
      } else {
        throw Exception('Failed to POST ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in POST READ Notification API: ${onError.toString()}');
    });
  }

  Future markNotificationsAsRead(int index) async {
    await ApiConstants.sendPOST(ApiConstants.markNotificationRead,
            <String, String>{"_id": widget.notification[index].id})
        .then((response) {
      if (response.statusCode == 200) {
        print(response.body);
        setState(() {
          _isRead = widget.notification[index].Read;
        });
      } else {
        throw Exception('Failed to POST ${response.statusCode}');
      }
    }).catchError((onError) {
      print('Error in POST READ Notification API: ${onError.toString()}');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Notifications"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(2),
          child: Text(
            '',
            style: TextStyle(color: Colors.white60),
          ),
        ),
      ),
      body: Container(
        padding: EdgeInsets.all(defaultPadding),
        child: SingleChildScrollView(
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.radio_button_checked, color: kSecondaryColor),
                  Text("Read Messages", style: kParagaphTextStyle),
                  SizedBox(width: defaultPadding / 2),
                  Icon(Icons.radio_button_unchecked, color: kSecondaryColor),
                  Text("Unread Messages", style: kParagaphTextStyle),
                ],
              ),
              SizedBox(height: defaultPadding),
              widget.notification.length == 0
                  ? Container(
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
                              "No Notification Available Yet",
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
                                "",
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
                    )
                  : ListView.builder(
                      shrinkWrap: true,
                      itemCount: widget.notification.length,
                      physics: const NeverScrollableScrollPhysics(),
                      itemBuilder: (context, index) {
                        return GestureDetector(
                          child: Container(
                            decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(10),
                                color: kPrimaryColor),
                            margin: EdgeInsets.all(defaultPadding / 2),
                            padding: EdgeInsets.all(defaultPadding),
                            child: Row(
                              children: [
                                widget.notification[index].Read || _isRead
                                    ? Icon(Icons.radio_button_checked,
                                        color: kSecondaryColor)
                                    : Icon(Icons.radio_button_unchecked,
                                        color: kSecondaryColor),
                                SizedBox(width: defaultPadding / 2),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        widget.notification[index]
                                            .NotificationString,
                                        style: TextStyle(
                                            fontWeight: FontWeight.normal,
                                            color: Colors.white,
                                            fontSize: 16,
                                            fontFamily: 'Inter'),
                                        textAlign: TextAlign.left,
                                      ),
                                      SizedBox(height: defaultPadding),
                                      // widget.notification[index].NotificationAccept !=
                                      //         "null"
                                      //     ? Text(
                                      //         "From: ${widget.notification[index].NotificationAccept}",
                                      //         style: kParagaphTextStyle,
                                      //         textAlign: TextAlign.left,
                                      //       )
                                      //     : Container(),
                                      // widget.notification[index].NotificationDeny !=
                                      //         "null"
                                      //     ? Text(
                                      //         "From: ${widget.notification[index].NotificationAccept}",
                                      //         style: kParagaphTextStyle,
                                      //         textAlign: TextAlign.left,
                                      //       )
                                      //     : Container(),

                                      Text(
                                        "From: ${widget.notification[index].From}",
                                        style: const TextStyle(
                                            fontWeight: FontWeight.normal,
                                            color: Colors.white,
                                            fontSize: 14,
                                            fontFamily: 'Inter'),
                                        textAlign: TextAlign.left,
                                      ),
                                      Text(
                                        widget.notification[index].createdAt,
                                        style: const TextStyle(
                                            fontWeight: FontWeight.normal,
                                            color: Colors.white,
                                            fontSize: 14,
                                            fontFamily: 'Inter'),
                                        textAlign: TextAlign.left,
                                      ),

                                      widget.notification[index]
                                                  .NotificationAccept !=
                                              "null"
                                          ? Text(
                                              "Click to open more",
                                              style: TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  color: kSecondaryColor,
                                                  fontSize: 14,
                                                  fontFamily: 'Inter'),
                                              textAlign: TextAlign.left,
                                            )
                                          : Container(),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          ),
                          onTap: () {
                            // Send read message
                            widget.notification[index].NotificationAccept !=
                                    "null"
                                ? getNotifications(index)
                                : markNotificationsAsRead(index);

                            // Next page
                          },
                        );
                      },
                    ),
            ],
          ),
        ),
      ),
    );
  }
}
