import 'dart:convert';
import 'package:date_field/date_field.dart';
import 'package:dropdown_textfield/dropdown_textfield.dart';
import 'package:flutter/material.dart';
import 'package:medichain/screens/log_in/login_screen.dart';
import '../../../constants.dart';

class CreatePatient extends StatefulWidget {
  CreatePatient({super.key});

  @override
  State<CreatePatient> createState() => _CreatePatientState();
}

class _CreatePatientState extends State<CreatePatient> {
  int DOBvalue = 0;

  Future createPatientRequest(BuildContext context) async {
    Map<String, dynamic> loginDetails = {
      "org": ApiConstants.orgranizationID,
      "ID": "QPT4PPUM",
      "password": passwordTextEditingController.text,
      "TYPE": "patient"
    };
    Map<String, dynamic> personalDetails = {
      "firstName": patientFullNameController.text,
      "middleName": patientMiddleNameController.text,
      "lastName": patientLastNameController.text,
      "email": patientEmailNameController.text,
      "DOB": DOBvalue,
      "gender": selectedGender,
      "maritalStatus": selectedMaritial,
      "passport": patientIDController.text,
    };
    Map<String, dynamic> address = {
      "street1": street1Controller.text,
      "street2": street2Controller.text,
      "postcode": postalCodeController.text,
      "country": selectedCountries,
      "state": "Wilayah Persekutuan",
      "city": "Kuala Lumpur"
    };
    Map<String, dynamic> contactDetails = {
      "mobile": mobileNumberController.text,
      "whatsapp": whatsappNumberController.text,
      "other": alternateNumberController.text,
    };

    await AdminConstants.sendPOST(
        AdminConstants.addNewPatientOrDoctorAPI, <String, String>{
      "loginDetails": jsonEncode(loginDetails),
      "personalDetails": jsonEncode(personalDetails),
      "address": jsonEncode(address),
      "contactDetails": jsonEncode(contactDetails),
      "onBehalf": jsonEncode(ApiConstants.isOnBehalf),
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
  }

  TextEditingController patientIDController = TextEditingController();

  TextEditingController patientalternateIDController = TextEditingController();

  TextEditingController patientFullNameController = TextEditingController();

  TextEditingController patientMiddleNameController = TextEditingController();

  TextEditingController patientLastNameController = TextEditingController();

  TextEditingController patientEmailNameController = TextEditingController();

  TextEditingController dateOfBirthNameController = TextEditingController();

  // TextEditingController patientGenderController = TextEditingController();
  TextEditingController maritalStatusController = TextEditingController();

  TextEditingController street1Controller = TextEditingController();

  TextEditingController street2Controller = TextEditingController();

  TextEditingController postalCodeController = TextEditingController();

  TextEditingController countryController = TextEditingController();

  TextEditingController mobileNumberController = TextEditingController();

  TextEditingController whatsappNumberController = TextEditingController();

  TextEditingController alternateNumberController = TextEditingController();

  SingleValueDropDownController patientGenderController =
      SingleValueDropDownController();

  String? selectedGender;

  List<DropdownMenuItem<String>> get genderItems {
    List<DropdownMenuItem<String>> menuItems = [
      DropdownMenuItem(child: Text("Male"), value: "Male"),
      DropdownMenuItem(child: Text("Female"), value: "Female"),
    ];
    return menuItems;
  }

  String? selectedMaritial;

  List<DropdownMenuItem<String>> get maritialItems {
    List<DropdownMenuItem<String>> menuItems = [
      DropdownMenuItem(child: Text("Single"), value: "Single"),
      DropdownMenuItem(child: Text("Married"), value: "Married"),
      DropdownMenuItem(child: Text("Divorced"), value: "Divorced"),
    ];
    return menuItems;
  }

  String? selectedCountries;

  List<DropdownMenuItem<String>> get countryItems {
    List<DropdownMenuItem<String>> menuItems = [
      DropdownMenuItem(child: Text("Malaysia"), value: "Malaysia"),
      DropdownMenuItem(child: Text("Singapore"), value: "Singapore"),
      DropdownMenuItem(child: Text("Thailand"), value: "Thailand"),
      DropdownMenuItem(child: Text("Indonesia"), value: "Indonesia"),
    ];
    return menuItems;
  }

  List<String> countries = [
    "Malaysia",
    "Singapore",
    "Thailand",
    "Indonesia",
  ];

  String? selectedStates = "Malaysia";
  List<String> states = [
    "Selangor",
    "Wilayah Persekutuan",
    "Perak",
    "Johor",
    "Pahang",
  ];

  @override
  void dispose() {
    patientIDController.dispose();
    patientalternateIDController.dispose();
    patientFullNameController.dispose();
    patientMiddleNameController.dispose();
    patientLastNameController.dispose();
    patientEmailNameController.dispose();
    dateOfBirthNameController.dispose();
    maritalStatusController.dispose();
    street1Controller.dispose();
    street2Controller.dispose();
    postalCodeController.dispose();
    countryController.dispose();
    mobileNumberController.dispose();
    whatsappNumberController.dispose();
    alternateNumberController.dispose();
    patientGenderController.dispose();
    // TODO: implement dispose
    super.dispose();
  }

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
              const SizedBox(height: defaultPadding * 2),
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
              const SizedBox(height: defaultPadding * 2),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: patientIDController,
                decoration: const InputDecoration(
                  hintText: "NRIC/Passport No.",
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
                  'A valid NRIC/Passport number contains only contains only numbers and alpabets including hyphens for NRIC number',
                  style: TextStyle(color: Colors.white54),
                  textAlign: TextAlign.center,
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
                    child: Icon(Icons.lock),
                  ),
                ),
              ),
              const SizedBox(height: defaultPadding / 2),
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  'This alternate key acts as first time login for patient. A valid username contains atleast 8 characters with 1 uppercase character, 1 lowercase charcter, 2 special character and 1 digit with no restrictions and dot character',
                  style: TextStyle(color: Colors.white54),
                  textAlign: TextAlign.center,
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
                    // child: Icon(Icons.language),
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
                    // child: Icon(Icons.language),
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
                    // child: Icon(Icons.flag),
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
                    child: Icon(Icons.alternate_email_sharp),
                  ),
                ),
              ),
              const SizedBox(height: defaultPadding),
              DateTimeFormField(
                decoration: const InputDecoration(
                  hintStyle: TextStyle(color: Colors.black45),
                  errorStyle: TextStyle(color: Colors.redAccent),
                  // border: OutlineInputBorder(),
                  prefixIcon: Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Icon(Icons.event_note),
                  ),
                  labelText: 'Date Of Birth',
                ),
                mode: DateTimeFieldPickerMode.date,
                autovalidateMode: AutovalidateMode.always,
                validator: (e) =>
                    (e?.day ?? 0) == 1 ? 'Please not the first day' : null,
                onDateSelected: (DateTime value) {
                  DOBvalue = value.millisecondsSinceEpoch;
                },
              ),
              const SizedBox(height: defaultPadding),

              DropdownButtonFormField(
                  hint: Text("Gender"),
                  decoration: InputDecoration(
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  validator: (value) =>
                      value == null ? "Select a gender" : null,
                  value: selectedGender,
                  items: genderItems,
                  onChanged: (newValue) {
                    print(newValue);
                    setState(() {
                      selectedGender = newValue.toString()!;
                    });
                  }),

              const SizedBox(height: defaultPadding),

              DropdownButtonFormField(
                  hint: Text("Marital Status"),
                  decoration: InputDecoration(
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                    filled: true,
                  ),
                  validator: (value) =>
                      value == null ? "Select a status" : null,
                  value: selectedMaritial,
                  items: maritialItems,
                  onChanged: (newValue) {
                    print(newValue);
                    setState(() {
                      selectedMaritial = newValue.toString()!;
                    });
                  }),

              // TextFormField(
              //   keyboardType: TextInputType.emailAddress,
              //   textInputAction: TextInputAction.next,
              //   cursorColor: kPrimaryColor,
              //   controller: maritalStatusController,
              //   decoration: const InputDecoration(
              //     hintText: "Marital Status",
              //   ),
              // ),
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
              // TextFormField(
              //   keyboardType: TextInputType.emailAddress,
              //   textInputAction: TextInputAction.next,
              //   cursorColor: kPrimaryColor,
              //   controller: countryController,
              //   decoration: const InputDecoration(
              //     hintText: "Country",
              //   ),
              // ),
              DropdownButtonFormField(
                  hint: Text("Country"),
                  decoration: InputDecoration(
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  validator: (value) =>
                      value == null ? "Select a country" : null,
                  value: selectedCountries,
                  items: countryItems,
                  onChanged: (newValue) {
                    print(newValue);
                    setState(() {
                      selectedCountries = newValue.toString()!;
                    });
                  }),

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
                  hintText: "Whatsapp Number (Optional)",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: alternateNumberController,
                decoration: const InputDecoration(
                  hintText: "Alternative Number (Optional)",
                ),
              ),
              const SizedBox(height: defaultPadding * 2),

              ElevatedButton(
                onPressed: () {
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
