import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
// import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:flutter_auth/helper/helperfunctions.dart';
// import 'package:flutter_auth/services/database.dart';

// import '../../../components/already_have_an_account_acheck.dart';
import '../../../components/already_have_an_account_acheck.dart';
import '../../../constants.dart';
import '../../log_in/login_screen.dart';
// import '../../log_in/login_screen.dart';
// import '../../Welcome/welcome_screen.dart';

class SignUpForm extends StatelessWidget {
  SignUpForm({
    Key? key,
  }) : super(key: key);

  //
  String name = '';
  String email = '';
  String password = '';

  var nameController = TextEditingController();
  var emailController = TextEditingController();
  var passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Form(
      child: Column(
        children: [
          TextFormField(
            keyboardType: TextInputType.name,
            textInputAction: TextInputAction.next,
            cursorColor: kPrimaryColor,
            controller: nameController,
            onSaved: (name) {},
            decoration: const InputDecoration(
              hintText: "Your full name",
              prefixIcon: Padding(
                padding: EdgeInsets.all(defaultPadding),
                child: Icon(Icons.person),
              ),
            ),
          ),
          const SizedBox(height: defaultPadding),
          TextFormField(
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            cursorColor: kPrimaryColor,
            controller: emailController,
            onSaved: (email) {},
            decoration: const InputDecoration(
              hintText: "Your email",
              prefixIcon: Padding(
                padding: EdgeInsets.all(defaultPadding),
                child: Icon(Icons.email),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: defaultPadding),
            child: TextFormField(
              textInputAction: TextInputAction.done,
              obscureText: true,
              cursorColor: kPrimaryColor,
              controller: passwordController,
              onSaved: (password) {},
              onChanged: (val) {
                setState(() => email = val);
              },
              decoration: InputDecoration(
                hintText: "Your password",
                prefixIcon: Padding(
                  padding: EdgeInsets.all(defaultPadding),
                  child: Icon(Icons.lock),
                ),
              ),
            ),
          ),
          const SizedBox(height: defaultPadding / 2),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
                primary: kPrimaryLightColor,
                elevation: 0),
            onPressed: () async {
              Map<String, String> userInfoMap = {
                'userName': nameController.text,
                'email': emailController.text,
              };
              // DatabaseMethods databaseMethods = new DatabaseMethods();
              // databaseMethods.addUserInfo(userInfoMap);

              // FirebaseAuth.instance
              //     .createUserWithEmailAndPassword(
              //         email: emailController.text,
              //         password: passwordController.text)
              //     .then((value) {
              //   print("Created new account");
              //   Navigator.push(context,
              //       MaterialPageRoute(builder: (context) => LoginScreen()));
              // }).onError((error, stackTrace) {
              //   print("Error: ${error.toString()}");
              // });
            },
            child: Text(
              "Sign Up".toUpperCase(),
              style: TextStyle(color: kPrimaryTextColor),
            ),
          ),
          const SizedBox(height: defaultPadding),
          AlreadyHaveAnAccountCheck(
            login: false,
            press: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) {
                    return LoginScreen();
                  },
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  void setState(String Function() param0) {}
}
