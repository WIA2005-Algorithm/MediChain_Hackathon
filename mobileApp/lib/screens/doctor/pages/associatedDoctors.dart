import 'package:flutter/material.dart';
import 'package:medichain/screens/doctor/models/doctors.dart';
import '../../../constants.dart';

class AssociatedDocPage extends StatefulWidget {
  final List<EachDoctor> doctorDetails;
  AssociatedDocPage({super.key, required this.doctorDetails});

  @override
  State<AssociatedDocPage> createState() => _AssociatedDocPageState();
}

class _AssociatedDocPageState extends State<AssociatedDocPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Associated Doctors"),
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
        child: Column(
          children: [
            widget.doctorDetails.isEmpty
                // ignore: prefer_const_constructors
                ? Text(
                    "Doctor has not been assigned \nto this patient",
                    style: kParagaphTextStyle,
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemBuilder: (context, index) {
                      return Container(
                        padding: EdgeInsets.symmetric(vertical: defaultPadding),
                        child: Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              SizedBox(width: defaultPadding),
                              Icon(
                                Icons.medical_information,
                                size: 40,
                                color: Colors.white,
                              ),
                              SizedBox(width: defaultPadding),
                              // Create New page for doctors list
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "Name: ${widget.doctorDetails[index].name}",
                                      style: kParagaphTextStyle,
                                      softWrap: true,
                                      maxLines: 2,
                                      overflow: TextOverflow.fade,
                                    ),
                                    Text(
                                      "Assigned On: ${widget.doctorDetails[index].assignedOn}",
                                      style: kParagaphTextStyle,
                                      softWrap: true,
                                      maxLines: 2,
                                      overflow: TextOverflow.fade,
                                    ),
                                    widget.doctorDetails[index].deAssigned != ''
                                        ? Text(
                                            "Discharged On: ${widget.doctorDetails[index].deAssigned}",
                                            style: kParagaphTextStyle,
                                            softWrap: true,
                                            maxLines: 2,
                                            overflow: TextOverflow.fade,
                                          )
                                        : Container(),
                                    Text(
                                      "Department: ${widget.doctorDetails[index].department}",
                                      style: kParagaphTextStyle,
                                      softWrap: true,
                                      maxLines: 2,
                                      overflow: TextOverflow.fade,
                                    ),
                                    Text(
                                      "Note: ${widget.doctorDetails[index].note}",
                                      style: kParagaphTextStyle,
                                      softWrap: true,
                                      maxLines: 2,
                                      overflow: TextOverflow.fade,
                                    ),
                                  ],
                                ),
                              ),
                            ]),
                      );
                    },
                    itemCount: widget.doctorDetails.length,
                  ),
          ],
        ),
      ),
    );
  }
}
