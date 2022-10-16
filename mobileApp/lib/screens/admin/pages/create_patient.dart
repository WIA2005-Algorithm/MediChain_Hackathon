import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:medichain/screens/log_in/login_screen.dart';
import '../../../constants.dart';

class CreatePatient extends StatelessWidget {
  CreatePatient({super.key});

  Future createPatientRequest(BuildContext context) async {
    Map loginDetails = {
      "org": ApiConstants.orgranizationID,
      "ID": "QPT4PPUM",
      "password": passwordTextEditingController.text,
      "TYPE": "patient"
    };
    Map personalDetails = {
      "firstName": patientFullNameController.text,
      "middleName": patientMiddleNameController.text,
      "lastName": patientLastNameController.text,
      "email": patientEmailNameController.text,
      "DOB": dateOfBirthNameController.text,
      "gender": patientGenderController.text,
      "maritalStatus": maritalStatusController.text,
      "passport": patientIDController.text,
    };
    Map address = {
      "street1": street1Controller.text,
      "street2": street2Controller.text,
      "postcode": postalCodeController.text,
      "country": countryController.text,
      "state": "Wilayah Persekutuan",
      "city": "Kuala Lumpur"
    };
    Map contactDetails = {
      "mobile": mobileNumberController.text,
      "whatsapp": whatsappNumberController.text,
      "other": whatsappNumberController.text,
    };

    await AdminConstants.sendPOST(
        AdminConstants.addNewPatientOrDoctorAPI, <String, String>{
      "loginDetails": jsonEncode(loginDetails),
      "personalDetails": jsonEncode(loginDetails),
      "address": jsonEncode(loginDetails),
      "contactDetails": jsonEncode(loginDetails),
    }).then((response) async {
      print("Response code: ${response.statusCode}");

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Patient Checked In successfully')));
        Navigator.pop(context);
      } else {
        throw Exception('Failed to Patient Checked In');
      }
    }).catchError((onError) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(onError.toString())));
      print('Error : ${onError.toString()}');
    });
    // ScaffoldMessenger.of(context)
    //     .showSnackBar(SnackBar(content: Text(snackBarString)));
  }

  TextEditingController patientIDController = TextEditingController();
  TextEditingController patientalternateIDController = TextEditingController();
  TextEditingController patientFullNameController = TextEditingController();
  TextEditingController patientMiddleNameController = TextEditingController();
  TextEditingController patientLastNameController = TextEditingController();
  TextEditingController patientEmailNameController = TextEditingController();
  TextEditingController dateOfBirthNameController = TextEditingController();
  TextEditingController patientGenderController = TextEditingController();
  TextEditingController maritalStatusController = TextEditingController();

  TextEditingController street1Controller = TextEditingController();
  TextEditingController street2Controller = TextEditingController();
  TextEditingController postalCodeController = TextEditingController();
  TextEditingController countryController = TextEditingController();
  TextEditingController mobileNumberController = TextEditingController();
  TextEditingController whatsappNumberController = TextEditingController();

  List<String> gender = [
    "Male",
    "Female",
  ];

  List<String> countries = [
    "Malaysia",
    "Singapore",
    "Thailand",
    "Indonesia",
  ];

  List<String> states = [
    "Selangor",
    "Wilayah Persekutuan",
    "Perak",
    "Johor",
    "Pahang",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Signup On Patient's Behalf"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
        // bottom: const PreferredSize(
        //   preferredSize: Size.fromHeight(2),
        //   child: Text(
        //     '',
        //     style: TextStyle(color: Colors.white60),
        // ),
        // ),
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.all(20),
          child: Column(
            children: [
              // const SizedBox(height: defaultPadding),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "The patient's deails filled below on the behalf are confluded as accurately spoken by patient themselves. The password filled is temporary and patient needs to put a new password when they login.",
                  style: TextStyle(color: Colors.white54, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: defaultPadding),
              Text(
                "Account Signup Details",
                style: kSectionTextStyle,
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "The below details will serve as the login details for the account. Passport Number is the userID.",
                  style: TextStyle(color: Colors.white54, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: patientIDController,
                decoration: const InputDecoration(
                  hintText: "NRIC/Passport No.",
                  prefixIcon: Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Icon(Icons.edit),
                  ),
                ),
              ),
              const SizedBox(height: defaultPadding / 2),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'A valid hospital name contains only contains only alpabets and spaces',
                  style: TextStyle(color: Colors.white54),
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: patientalternateIDController,
                decoration: const InputDecoration(
                  hintText: "Alternate Key For Patient",
                  prefixIcon: Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Icon(Icons.tag),
                  ),
                ),
              ),
              const SizedBox(height: defaultPadding / 2),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'A valid network name contains atleast 5 characters with no spaces, no special characters in the beginning or end. Allowed special characters include ‘underscore’ and  ‘dot’. ',
                  style: TextStyle(color: Colors.white54),
                ),
              ),
              const SizedBox(height: defaultPadding / 2),

              // #######################################################################
              Divider(
                height: 20,
                thickness: 3,
                indent: 20,
                endIndent: 0,
                color: Colors.white,
              ),
              // #######################################################################
              const SizedBox(height: defaultPadding),
              Text(
                "Personal Details",
                style: kSectionTextStyle,
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "Personal details are required to create new patient account. These details are expected to be as accurate as possible.",
                  style: TextStyle(color: Colors.white54, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: patientFullNameController,
                decoration: const InputDecoration(
                  hintText: "Full Name",
                  prefixIcon: Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Icon(Icons.language),
                  ),
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: patientMiddleNameController,
                decoration: const InputDecoration(
                  hintText: "Middle Name",
                  prefixIcon: Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Icon(Icons.language),
                  ),
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: patientLastNameController,
                decoration: const InputDecoration(
                  hintText: "Last/Family Name",
                  prefixIcon: Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Icon(Icons.flag),
                  ),
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: patientEmailNameController,
                decoration: const InputDecoration(
                  hintText: "Email Address",
                  prefixIcon: Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Icon(Icons.flag),
                  ),
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: dateOfBirthNameController,
                decoration: const InputDecoration(
                  hintText: "Date Of Birth",
                  prefixIcon: Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Icon(Icons.flag),
                  ),
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: patientGenderController,
                decoration: const InputDecoration(
                  hintText: "Gender",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: maritalStatusController,
                decoration: const InputDecoration(
                  hintText: "Marital Status",
                ),
              ),
              const SizedBox(height: defaultPadding),

              // #######################################################################
              Divider(
                height: 20,
                thickness: 3,
                indent: 20,
                endIndent: 0,
                color: Colors.white,
              ),
              // #######################################################################
              const SizedBox(height: defaultPadding),
              Text(
                "Location Details",
                style: kSectionTextStyle,
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "The location details are required for the benefit of the patient.",
                  style: TextStyle(color: Colors.white54, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: street1Controller,
                decoration: const InputDecoration(
                  hintText: "Street 1",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: street2Controller,
                decoration: const InputDecoration(
                  hintText: "Street 2",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: postalCodeController,
                decoration: const InputDecoration(
                  hintText: "Postal Code",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: countryController,
                decoration: const InputDecoration(
                  hintText: "Country",
                ),
              ),
              const SizedBox(height: defaultPadding),
              // #######################################################################
              Divider(
                height: 20,
                thickness: 3,
                indent: 20,
                endIndent: 0,
                color: Colors.white,
              ),
              // #######################################################################
              const SizedBox(height: defaultPadding),
              Text(
                "Contact Details",
                style: kSectionTextStyle,
              ),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  "The contact details are important for the hospital to contact the patient for further process, if any.",
                  style: TextStyle(color: Colors.white54, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: mobileNumberController,
                decoration: const InputDecoration(
                  hintText: "Mobile Number",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: whatsappNumberController,
                decoration: const InputDecoration(
                  hintText: "Whatsapp Number for Easier Access",
                ),
              ),
              const SizedBox(height: defaultPadding * 2),

              ElevatedButton(
                onPressed: () {
                  // getNetworkDetails();
                  createPatientRequest(context);
                },
                style: ElevatedButton.styleFrom(
                    primary: kSecondaryColor, elevation: 0),
                child: Text(
                  "Submit ".toUpperCase(),
                  style: TextStyle(color: Colors.black),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
