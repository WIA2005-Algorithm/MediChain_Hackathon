import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../../constants.dart';

class WelcomeImage extends StatelessWidget {
  const WelcomeImage({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(height: defaultPadding * 2),
        Row(
          children: [
            Spacer(),
            // Expanded(
            //   flex: 8,
            //   child: Image.asset(
            //     // Insert medichain logo

            //     "assets/images/app_logo.png",
            //   ),
            // ),
            Image.asset(
              "assets/images/app_logo.png",
              // height: 200,
              // width: 200,
              scale: 0.6,
            ),
            Spacer(),
          ],
        ),
        SizedBox(height: defaultPadding * 2),
        const Text(
          "Medichain",
          style: kTextStyle,
        ),
        SizedBox(height: defaultPadding * 2),
      ],
    );
  }
}
