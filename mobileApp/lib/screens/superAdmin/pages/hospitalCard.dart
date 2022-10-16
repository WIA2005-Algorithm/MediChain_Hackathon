import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/superAdmin/models/network_info.dart';

import '../../../constants.dart';

class HospitalCard extends StatefulWidget {
  final int index;
  const HospitalCard({super.key, required this.index});

  @override
  State<HospitalCard> createState() => _HospitalCardState();
}

class _HospitalCardState extends State<HospitalCard> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          // Change to hospital Name
          NetworkInfo.organizations[widget.index].orgFullName,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontSize: 15,
              fontFamily: 'Inter'),
        ),
        SizedBox(height: 10),
        Text(
          NetworkInfo.createdAt,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontSize: 13,
              fontFamily: 'Inter'),
        ),
      ],
    );
  }
}
