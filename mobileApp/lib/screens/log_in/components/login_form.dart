import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/admin/admin.dart';
import '../../../../components/already_have_an_account_acheck.dart';
import '../../../../constants.dart';
import '../../../helper/helperfunctions.dart';
import '../../log_in/login_screen.dart';
import '../../sign_up/signup_screen.dart';
import 'package:animated_toggle_switch/animated_toggle_switch.dart';
import '../../admin/models/framework.dart';

class LoginForm extends StatefulWidget {
  const LoginForm({
    Key? key,
  }) : super(key: key);

  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  int value = 0;
  List<String> users = ["S-Admin", "Admin", "Doctor", "Patient"];
  List<String> userType = ["superuser", "user", "doctor", "patient"];
  Future? _futureVariable;

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
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
            colorBuilder: (i) => i.isEven ? Colors.purple : Colors.deepPurple,
            onChanged: (i) => setState(() => value = i),
            borderRadius: BorderRadius.circular(30),
            borderColor: Colors.purple,
            textDirection: TextDirection.ltr,
            customIconBuilder: (context, local, global) {
              return Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('${users[local.value]}'),
                  // alternativeIconBuilder(context, local, global),
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
            onSaved: (email) {},
            decoration: const InputDecoration(
              hintText: "Your username",
              prefixIcon: Padding(
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
              decoration: const InputDecoration(
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
              onPressed: () {
                print('Attempt to load network');

                SuperAdminConstants.sendPOST(
                    SuperAdminConstants.loginAuth, <String, String>{
                  "username": emailTextEditingController.text,
                  "password": passwordTextEditingController.text
                }).then((response) {
                  if (response.statusCode == 200) {
                    LoginAccess.fromJson(jsonDecode(response.body));
                    Navigator.push(context,
                        MaterialPageRoute(builder: (context) => AdminScreen()));
                  } else {
                    throw Exception('Failed to login');
                  }
                }).catchError((onError) {
                  print('Error : ${onError.toString()}');
                });
              },
              child: Text(
                "Login".toUpperCase(),
              ),
            ),
          ),
          const SizedBox(height: defaultPadding),
          AlreadyHaveAnAccountCheck(
            press: () {
              // FirebaseAuth.instance.signInWithEmailAndPassword(
              //     email: emailTextEditingController.text,
              //     password: passwordTextEditingController.text);
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return SignUpScreen();
                  },
                ),
              );
            },
          ),
        ],
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
