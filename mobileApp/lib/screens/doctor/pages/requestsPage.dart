import 'package:flutter/material.dart';
import 'package:medichain/screens/doctor/models/notifications.dart';
import 'package:medichain/screens/doctor/models/patients.dart';
import 'package:medichain/screens/doctor/pages/takeAction.dart';

import '../../../constants.dart';

class RequestsPage extends StatefulWidget {
  final List<Requests> requests;
  final DoctorDetailsAPIResponse doctor;
  RequestsPage({super.key, required this.doctor, required this.requests});

  @override
  State<RequestsPage> createState() => _RequestsPageState();
}

class _RequestsPageState extends State<RequestsPage> {
  bool _isRead = false;
  Object? selectedButton;

  Future postRequest(int index) async {
    // await ApiConstants.sendPOST(ApiConstants.markNotificationRead,
    //         <String, String>{"_id": widget.doctor.details!.passport})
    //     .then((response) {
    //   if (response.statusCode == 200) {
    //     // print(response.body);
    //     setState(() {
    //       // _isRead = widget.requests.toList()[index].Status;
    //     });
    //     Navigator.push(
    //         context,
    //         MaterialPageRoute(
    //             builder: (context) => TakeAction(
    //                   doctorId: widget.doctor.details!.passport,
    //                   patientId: widget
    //                       .doctor.associatedPatients!.patients.values
    //                       .toList()[index]
    //                       .patientData!
    //                       .details!
    //                       .passport
    //                       .toString(),
    //                   notification: widget.notification[index],
    //                 )));
    //   } else {
    //     throw Exception('Failed to POST ${response.statusCode}');
    //   }
    // }).catchError((onError) {
    //   print('Error in POST READ Notification API: ${onError.toString()}');
    // });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Access Request"),
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
              ListView.builder(
                shrinkWrap: true,
                itemCount: widget.requests.length,
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
                          widget.requests[index].Data != null ||
                                  widget.requests[index].Data != "null"
                              ? Icon(Icons.radio_button_checked,
                                  color: kSecondaryColor)
                              : Icon(Icons.radio_button_unchecked,
                                  color: kSecondaryColor),
                          SizedBox(width: defaultPadding / 2),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  "${widget.requests[index].CommentToAccessOrDeny}",
                                  style: TextStyle(
                                      fontWeight: FontWeight.normal,
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontFamily: 'Inter'),
                                  textAlign: TextAlign.left,
                                ),
                                SizedBox(height: defaultPadding),
                                Text(
                                  "From: Web System",
                                  style: const TextStyle(
                                      fontWeight: FontWeight.normal,
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontFamily: 'Inter'),
                                  textAlign: TextAlign.left,
                                ),
                                Text(
                                  widget.requests[index].createdAt,
                                  style: const TextStyle(
                                      fontWeight: FontWeight.normal,
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontFamily: 'Inter'),
                                  textAlign: TextAlign.left,
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                    onTap: () {
                      // Send read message
                      widget.requests[index].Data!.UID != ""
                          ? postRequest(index)
                          : null;

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
