import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/models/doctors.dart';

class DoctorDetails extends StatelessWidget {
  final Doctor doctor;
  final int index;
  final List<String> activeList;
  DoctorDetails(
      {super.key,
      required this.doctor,
      required this.index,
      required this.activeList});

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
