import "package:flutter/material.dart";
import 'package:medichain/constants.dart';
import 'package:medichain/screens/superAdmin/models/network_info.dart';
import 'package:medichain/screens/superAdmin/pages/networkDetails.dart';

class NetworkCard extends StatelessWidget {
  final AllBlockChainNetworksResponse? networkDetails;
  const NetworkCard({super.key, required this.networkDetails});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(10),
      child: Container(
        padding: EdgeInsets.all(30),
        color: kPrimaryColor,
        child: Row(
          children: [
            CardImage(),
            SizedBox(width: 30),
            CardDetails(networkDetails: networkDetails),
          ],
        ),
      ),
    );
  }

  Widget CardImage() {
    return Column(
      children: const [
        Icon(
          Icons.new_releases_outlined,
          color: kSecondaryColor,
        ),
        SizedBox(height: defaultPadding),
        Text(
          'Not Started',
          style: TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontSize: 17,
              fontFamily: 'Inter'),
        ),
      ],
    );
  }
}

class CardDetails extends StatelessWidget {
  final AllBlockChainNetworksResponse? networkDetails;
  const CardDetails({
    Key? key,
    this.networkDetails,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Network Name',
          style: TextStyle(
              fontWeight: FontWeight.normal,
              color: Colors.white,
              fontSize: 14,
              fontFamily: 'Inter'),
        ),
        Text(
          networkDetails!.networkName,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontSize: 15,
              fontFamily: 'Inter'),
        ),
        const SizedBox(height: defaultPadding / 2),
        const Text(
          'Network ID',
          style: TextStyle(
              fontWeight: FontWeight.normal,
              color: Colors.white,
              fontSize: 14,
              fontFamily: 'Inter'),
        ),
        Text(
          networkDetails!.networkID,
          overflow: TextOverflow.fade,
          maxLines: 1,
          softWrap: false,
          style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontSize: 15,
              fontFamily: 'Inter'),
        ),
        const SizedBox(height: defaultPadding / 2),
        const Text(
          'Network Address',
          style: TextStyle(
              fontWeight: FontWeight.normal,
              color: Colors.white,
              fontSize: 14,
              fontFamily: 'Inter'),
        ),
        Text(
          networkDetails!.netAddress,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontSize: 15,
              fontFamily: 'Inter'),
        ),
        const SizedBox(height: defaultPadding / 2),
        const Text(
          'Created Date',
          style: TextStyle(
              fontWeight: FontWeight.normal,
              color: Colors.white,
              fontSize: 14,
              fontFamily: 'Inter'),
        ),
        Text(
          networkDetails!.createdAt,
          style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontSize: 14,
              fontFamily: 'Inter'),
        ),
        const SizedBox(height: defaultPadding / 2),
        const Text(
          'Hospitals Enrolled',
          style: TextStyle(
              fontWeight: FontWeight.normal,
              color: Colors.white,
              fontSize: 14,
              fontFamily: 'Inter'),
        ),
        Text(
          "${networkDetails!.hospitalCount}",
          style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontSize: 15,
              fontFamily: 'Inter'),
        ),
      ],
    );
  }
}
