import 'package:flutter/material.dart';

import '../../../constants.dart';

class TakeAction extends StatefulWidget {
  final String patientId;
  final String doctorId;

  const TakeAction(
      {super.key, required this.patientId, required this.doctorId});

  @override
  State<TakeAction> createState() => _TakeActionState();
}

class _TakeActionState extends State<TakeAction> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Take Action"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(2),
          child: Text(
            '',
            style: TextStyle(color: Colors.white60),
          ),
        ),
        leading: Builder(builder: (context) {
          return GestureDetector(
            child: IconButton(
              icon: const Icon(Icons.settings),
              onPressed: () => Scaffold.of(context).openDrawer(),
            ),
          );
        }),
        actions: [
          IconButton(
              icon: const Icon(
                Icons.logout,
                color: Colors.white,
              ),
              tooltip: 'Login/Registration',
              onPressed: () {
                Navigator.pop(context);
              })
        ],
      ),
      body: Container(
        child: Column(
          children: [
            const Text("Access Request Permit Sharing of Records",
                style: kSectionTextStyle),
            const SizedBox(height: defaultPadding * 2),
            Text(
                "The hospital is requesting your access to share the data of the patient with ID: ${widget.patientId} with external doctor of ${widget.doctorId}",
                style: kSectionTextStyle),
          ],
        ),
      ),
    );
  }
}
