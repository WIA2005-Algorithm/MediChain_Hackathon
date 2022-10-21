import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:animated_toggle_switch/animated_toggle_switch.dart';
import '../../../components/already_have_an_account_acheck.dart';
import '../../../constants.dart';
import '../../admin/pages/create_patient.dart';
import '../../log_in/login_screen.dart';

class SignUpForm extends StatefulWidget {
  SignUpForm({
    Key? key,
  }) : super(key: key);

  @override
  State<SignUpForm> createState() => _SignUpFormState();
}

class _SignUpFormState extends State<SignUpForm> {
  String name = '';
  String email = '';
  String password = '';

  int selectorValue = 0;
  List<String> users = ["Doctor", "Patient"];
  List<String> userType = ["doctor", "patient"];

  var nameController = TextEditingController();
  var emailController = TextEditingController();
  var passwordController = TextEditingController();

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
          Column(
            children: [
              const SizedBox(height: defaultPadding),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) {
                        return CreatePatient(type: "doctor", onBehalf: false);
                      },
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                    primary: kPrimaryLightColor, elevation: 0),
                child: Text(
                  "Doctor".toUpperCase(),
                  style: TextStyle(color: kPrimaryTextColor),
                ),
              ),
              const SizedBox(height: defaultPadding),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) {
                        return CreatePatient(type: "patient", onBehalf: false);
                      },
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                    primary: kPrimaryLightColor, elevation: 0),
                child: Text(
                  "Patient".toUpperCase(),
                  style: TextStyle(color: kPrimaryTextColor),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}
