import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:medichain/screens/patient/patientHome.dart';
import '../../constants.dart';
import '../../helper/helperfunctions.dart';
import '../log_in/login_screen.dart';

class ChangePassword extends StatelessWidget {
  ChangePassword({super.key});

  TextEditingController passwordTextEditingController1 =
      new TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Create New Password"),
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
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(defaultPadding),
            child: TextFormField(
              textInputAction: TextInputAction.done,
              obscureText: true,
              cursorColor: kPrimaryColor,
              controller: passwordTextEditingController1,
              decoration: InputDecoration(
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                hintText: "Enter your password",
                prefixIcon: Padding(
                  padding: EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.lock),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(defaultPadding),
            child: ElevatedButton(
              onPressed: () async {
                await AdminConstants.sendPOST(
                    AdminConstants.loginOnBehalfOF, <String, String>{
                  "userID": emailTextEditingController.text,
                  "password": passwordTextEditingController1.text,
                }).then((response) {
                  if (response.statusCode == 200) {
                    print('Attempt successful');

                    LoginAccess.fromJson(jsonDecode(response.body));
                    Navigator.push(context,
                        MaterialPageRoute(builder: (context) => PatientHome()));
                  } else {
                    throw Exception('Failed to change password');
                  }
                }).catchError((onError) {
                  print('Error : ${onError.toString()}');
                });
              },
              style: ElevatedButton.styleFrom(
                  primary: kSecondaryColor, elevation: 0),
              child: Text(
                "Submit".toUpperCase(),
                style: TextStyle(color: kPrimaryTextColor),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
