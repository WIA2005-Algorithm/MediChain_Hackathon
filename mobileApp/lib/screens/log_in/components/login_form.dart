import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/patient/changePassword.dart';
import 'package:medichain/screens/patient/patientHome.dart';
import 'package:medichain/screens/superAdmin/pages/overview.dart';
import '../../../../components/already_have_an_account_acheck.dart';
import '../../../../constants.dart';
import '../../../helper/helperfunctions.dart';
import '../../admin/adminScreen.dart';
import '../../log_in/login_screen.dart';
import '../../sign_up/signup_screen.dart';
import 'package:animated_toggle_switch/animated_toggle_switch.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({
    Key? key,
  }) : super(key: key);

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  int value = 0;
  List<String> users = ["SuAdmin", "Admin", "Doctor", "Patient"];
  List<String> userType = ["superuser", "user", "doctor", "patient"];
  Future? _futureVariable;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
  }

  void userLoginFunction() {
    print('Attempt to load network');
    if (value == 0) {
      // SuperAdmin Login

      SuperAdminConstants.sendPOST(
          SuperAdminConstants.loginAuth, <String, String>{
        "username": emailTextEditingController.text,
        "password": passwordTextEditingController.text
      }).then((response) {
        if (response.statusCode == 200) {
          print('Attempt successful');

          LoginAccess.fromJson(jsonDecode(response.body));
          Navigator.push(context,
              MaterialPageRoute(builder: (context) => SuperAdminOverview()));
        } else {
          throw Exception('Failed to login');
        }
      }).catchError((onError) {
        print('Error : ${onError.toString()}');
      });
    } else if (value == 1) {
      // Admin Login
      AdminConstants.sendPOST(AdminConstants.loginAuth, <String, String>{
        "userID": emailTextEditingController.text,
        "password": passwordTextEditingController.text,
        "type": "admin"
      }).then((response) {
        if (response.statusCode == 200) {
          print('Attempt successful');

          LoginAccess.fromJson(jsonDecode(response.body));
          Navigator.pushReplacement(
              context, MaterialPageRoute(builder: (context) => AdminScreen()));
        } else {
          throw Exception('Failed to login');
        }
      }).catchError((onError) {
        print('Error : ${onError.toString()}');
      });
    } else if (value == 2) {
      // Dcotor Login
      AdminConstants.sendPOST(AdminConstants.loginAuth, <String, String>{
        "userID": emailTextEditingController.text,
        "password": passwordTextEditingController.text,
        "type": "doctor"
      }).then((response) {
        if (response.statusCode == 200) {
          print('Attempt successful');

          LoginAccess.fromJson(jsonDecode(response.body));
          Navigator.pushReplacement(
              context, MaterialPageRoute(builder: (context) => AdminScreen()));
        } else {
          throw Exception('Failed to login');
        }
      }).catchError((onError) {
        print('Error : ${onError.toString()}');
      });
    } else if (value == 3) {
      // Patient Login
      AdminConstants.sendPOST(AdminConstants.loginAuth, <String, String>{
        "userID": emailTextEditingController.text,
        "password": passwordTextEditingController.text,
        "type": "patient"
      }).then((response) {
        if (response.statusCode == 200) {
          jsonDecode(response.body)['isOnBehalf'] == 1
              ? Navigator.push(context,
                  MaterialPageRoute(builder: (context) => ChangePassword()))
              : Navigator.pushReplacement(context,
                  MaterialPageRoute(builder: (context) => PatientHome()));
        } else {
          throw Exception('Failed to login');
        }
      }).catchError((onError) {
        print('Error : ${onError.toString()}');
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      child: Column(
        children: [
          AnimatedToggleSwitch<int>.size(
            values: [0, 1, 2, 3],
            current: value,
            height: 50,
            iconOpacity: 1.0,
            indicatorSize: Size.fromWidth(100),
            selectedIconSize: Size.square(20),
            iconSize: Size.square(20),
            colorBuilder: (i) => kSecondaryColor,
            onChanged: (i) => setState(() => value = i),
            borderRadius: BorderRadius.circular(30),
            borderColor: kSecondaryColor,
            textDirection: TextDirection.ltr,
            customIconBuilder: (context, local, global) {
              return Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '${users[local.value]}',
                    style: TextStyle(color: kTextColor),
                  ),
                ],
              );
            },
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            cursorColor: kPrimaryColor,
            controller: emailTextEditingController,
            decoration: InputDecoration(
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
              ),
              hintText: "Your ID",
              prefixIcon: const Padding(
                padding: EdgeInsets.all(defaultPadding),
                child: Icon(Icons.person),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              textInputAction: TextInputAction.done,
              obscureText: true,
              cursorColor: kPrimaryColor,
              controller: passwordTextEditingController,
              decoration: InputDecoration(
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                hintText: "Your password",
                prefixIcon: Padding(
                  padding: EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.lock),
                ),
              ),
            ),
          ),
          const SizedBox(height: defaultPadding),
          Hero(
            tag: "login_btn",
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                backgroundColor: kSecondaryColor,
              ),
              onPressed: () {
                userLoginFunction();
              },
              child: Text(
                "Login".toUpperCase(),
                style: TextStyle(
                    color: kPrimaryTextColor, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          const SizedBox(height: defaultPadding),
          signUpButton(value),
        ],
      ),
    );
  }

  Widget signUpButton(int userType) {
    return userType == 2 || userType == 3
        ? AlreadyHaveAnAccountCheck(
            press: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return SignUpScreen();
                  },
                ),
              );
            },
          )
        : const Padding(
            padding: EdgeInsets.all(8.0),
            child: Text(
              "Please contact the blockchain developer if you have forgotten yourr password",
              style: TextStyle(color: Colors.white54),
              textAlign: TextAlign.center,
            ),
          );
  }

  Widget iconBuilder(int value, Size iconSize) {
    return rollingIconBuilder(value, iconSize, false);
  }

  Widget alternativeIconBuilder(BuildContext context, SizeProperties<int> local,
      GlobalToggleProperties<int> global) {
    IconData data = Icons.access_time_rounded;
    switch (local.value) {
      case 0:
        data = Icons.ac_unit_outlined;
        break;
      case 1:
        data = Icons.account_circle_outlined;
        break;
      case 2:
        data = Icons.assistant_navigation;
        break;
      case 3:
        data = Icons.arrow_drop_down_circle_outlined;
        break;
    }
    return Icon(
      data,
      size: local.iconSize.shortestSide,
    );
  }

  Widget rollingIconBuilder(int value, Size iconSize, bool foreground) {
    IconData data = Icons.sick;
    if (value.isEven) data = Icons.admin_panel_settings_outlined;
    return Icon(
      data,
      size: iconSize.shortestSide,
    );
  }
}
