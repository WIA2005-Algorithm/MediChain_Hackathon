import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:animated_toggle_switch/animated_toggle_switch.dart';
import '../../../components/already_have_an_account_acheck.dart';
import '../../../constants.dart';
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
          AnimatedToggleSwitch<int>.size(
            values: [0, 1],
            current: selectorValue,
            height: 50,
            iconOpacity: 1.0,
            indicatorSize: Size.fromWidth(100),
            selectedIconSize: Size.square(20),
            iconSize: Size.square(20),
            colorBuilder: (i) => kSecondaryColor,
            onChanged: (i) => setState(() => selectorValue = i),
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
          dynamicForm(selectorValue),
        ],
      ),
    );
  }

  Widget dynamicForm(int value) {
    return value == 0
        // Doctor login
        ? Column(
            children: [
              const SizedBox(height: defaultPadding),
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
          )

        // Patient login
        : Column(
            children: [
              const SizedBox(height: defaultPadding),
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
          );
  }
}
