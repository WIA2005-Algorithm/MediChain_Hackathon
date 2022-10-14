import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:flutter/src/widgets/framework.dart';
import 'package:medichain/screens/superAdmin/models/network_info.dart';

import '../../../constants.dart';

class HospitalCard extends StatelessWidget {
  const HospitalCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(5),
      child: Container(
        color: kPrimaryColor,
        child: Padding(
          padding: const EdgeInsets.all(15),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // const Text(
              //   'Network Name',
              //   style: TextStyle(
              //       fontWeight: FontWeight.normal,
              //       color: Colors.white,
              //       fontSize: 14,
              //       fontFamily: 'Inter'),
              // ),
              Text(
                // Change to hospital Name
                NetworkInfo.networkName,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    fontSize: 15,
                    fontFamily: 'Inter'),
              ),
              SizedBox(height: 10),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Text(
                  NetworkInfo.createdAt,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: 13,
                      fontFamily: 'Inter'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
