import 'dart:convert';
import 'package:date_field/date_field.dart';
import 'package:dropdown_textfield/dropdown_textfield.dart';
import 'package:flutter/material.dart';
import 'package:medichain/helper/registration/registeration.dart';
import 'package:medichain/screens/log_in/login_screen.dart';
import '../../../constants.dart';

class CreatePatient extends StatefulWidget {
  final String type;
  final bool onBehalf;
  CreatePatient({super.key, required this.type, required this.onBehalf});

  @override
  State<CreatePatient> createState() => _CreatePatientState();
}

class _CreatePatientState extends State<CreatePatient> {
  int DOBvalue = 0;
  List<String> organizations = [];
  String orgFullName = "";

  // void getOrgFullName() {
  //   List<String> orgHold = [];
  //   String orgFullName = '';
  //   getOrganizationList();
  //   organizations.forEach((element) {
  //     var orgID = element.split("-")[1].trim();
  //     if (ApiConstants.orgranizationID == orgID) {
  //       setState(() {
  //         orgFullName = element;
  //       });
  //     }
  //   });
  // }

  Future createPatientRequest() async {
    List<String> orgHold = [];
    String orgFullName = '';
    getOrganizationList();
    organizations.forEach((element) {
      var orgID = element.split("-")[1].trim();
      if (ApiConstants.orgranizationID == orgID) {
        setState(() {
          orgFullName = element;
        });
      }
    });

    print("$selectedDepartment");
    Payload payloadData = Payload(
        LoginDetails(
          widget.onBehalf ? orgFullName : selectedOrganization!,
          // : selectedOrganization!.split("-")[1].trim(),
          patientIDController.text,
          patientalternateIDController.text,
          widget.type,
        ),
        PersonalDetails(
          patientFullNameController.text,
          patientMiddleNameController.text,
          patientLastNameController.text,
          patientEmailNameController.text,
          DOBvalue,
          selectedGender!,
          selectedMaritial!,
          selectedDepartment!,
          patientIDController.text,
        ),
        Address(
          street1Controller.text,
          street2Controller.text,
          postalCodeController.text,
          countryController.text,
          stateController.text,
          cityController.text,
        ),
        ContactDetails(
          mobileNumberController.text,
          whatsappNumberController.text,
          alternateNumberController.text,
        ));

    await AdminConstants.sendPOST(
        AdminConstants.addNewPatientOrDoctorAPI, <String, dynamic>{
      "payloadData": payloadData,
      "onBehalf": widget.onBehalf ? true : false
    }).then((response) async {
      print("Response code: ${response.statusCode}");

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(
            content:
                Text('${widget.type.toUpperCase()} Registered Successfully')));
        Navigator.pushReplacement(
            context, MaterialPageRoute(builder: (context) => LoginScreen()));
      } else {
        throw Exception('Failed ${widget.type.toUpperCase()} Registeration');
      }
    }).catchError((onError) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(onError.toString())));
      print('Error : ${onError.toString()}');
    });
  }

  Future getOrganizationList() async {
    List<String> newItems = [];
    await AdminConstants.sendGET(
            AdminConstants.getHospitalsEnrolled, <String, String>{})
        .then((response) async {
      if (response.statusCode == 200) {
        setState(() {
          organizations =
              (jsonDecode(response.body) as List<dynamic>).cast<String>();
        });
        print("Organization state -- ${organizations}");
      } else {
        throw Exception('Failed to Patient Checked In');
      }
    }).catchError((onError) {});
  }

  TextEditingController patientIDController = TextEditingController();
  TextEditingController patientalternateIDController = TextEditingController();
  TextEditingController patientFullNameController = TextEditingController();
  TextEditingController patientMiddleNameController = TextEditingController();
  TextEditingController patientLastNameController = TextEditingController();
  TextEditingController patientEmailNameController = TextEditingController();
  TextEditingController dateOfBirthNameController = TextEditingController();
  TextEditingController maritalStatusController = TextEditingController();
  TextEditingController street1Controller = TextEditingController();
  TextEditingController street2Controller = TextEditingController();
  TextEditingController postalCodeController = TextEditingController();
  TextEditingController countryController = TextEditingController();
  TextEditingController stateController = TextEditingController();
  TextEditingController cityController = TextEditingController();

  TextEditingController patientUserNameController = TextEditingController();

  TextEditingController mobileNumberController = TextEditingController();
  TextEditingController whatsappNumberController = TextEditingController();
  TextEditingController alternateNumberController = TextEditingController();

  SingleValueDropDownController patientGenderController =
      SingleValueDropDownController();

  String? selectedGender;

  List<DropdownMenuItem<String>> get genderItems {
    List<DropdownMenuItem<String>> menuItems = [];
    for (var ele in RegistrationConstants.genderOptions) {
      menuItems.add(DropdownMenuItem(value: ele, child: Text(ele)));
    }
    return menuItems;
  }

  String? selectedMaritial;

  List<DropdownMenuItem<String>> get maritialItems {
    List<DropdownMenuItem<String>> menuItems = [];
    for (var ele in RegistrationConstants.maritalStatusOptions) {
      menuItems.add(DropdownMenuItem(value: ele, child: Text(ele)));
    }
    return menuItems;
  }

  String selectedDepartment = "General";

  List<DropdownMenuItem<String>> get departmentItems {
    List<DropdownMenuItem<String>> menuItems = [];
    for (var ele in RegistrationConstants.departmentOptions) {
      menuItems.add(DropdownMenuItem(value: ele, child: Text(ele)));
    }
    return menuItems;
  }

  String? selectedOrganization;

  List<DropdownMenuItem<String>> get organizationItems {
    List<DropdownMenuItem<String>> menuItems = [];
    for (var ele in organizations) {
      menuItems.add(DropdownMenuItem(value: ele, child: Text(ele)));
    }
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
    patientUserNameController.dispose();
    street2Controller.dispose();
    postalCodeController.dispose();
    countryController.dispose();
    mobileNumberController.dispose();
    whatsappNumberController.dispose();
    alternateNumberController.dispose();
    patientGenderController.dispose();

    stateController.dispose();
    cityController.dispose();
    // TODO: implement dispose
    super.dispose();
  }

  @override
  void initState() {
    getOrganizationList();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text(widget.onBehalf
            ? "Create New Patient Record"
            : "New ${widget.type == "doctor" ? "Doctor" : "Patient"} Signup"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.all(20),
          child: Column(
            children: [
              // const SizedBox(height: defaultPadding),
              Padding(
                padding: EdgeInsets.all(8.0),
                child: Text(
                  widget.onBehalf
                      ? "The patient's details filled below on the behalf are confluded as accurately spoken by patient themselves. The password filled is temporary and patient needs to put a new password when they login."
                      : "Your personal details are be filled as accurately as possible to conclude correct diagnosis as well as help the hospital identify you easily",
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
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: patientalternateIDController,
                obscureText: true,
                decoration: InputDecoration(
                  hintText: widget.onBehalf
                      ? "Alternate Key For Patient"
                      : "Password",
                  prefixIcon: Padding(
                    padding: EdgeInsets.all(defaultPadding),
                    child: Icon(Icons.lock),
                  ),
                ),
              ),
              const SizedBox(height: defaultPadding),
              widget.onBehalf
                  ? Container()
                  : DropdownButtonFormField(
                      hint: Text("Organization"),
                      decoration: InputDecoration(
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        filled: true,
                      ),
                      validator: (value) =>
                          value == null ? "Select a status" : null,
                      value: selectedOrganization,
                      items: organizations
                          .map(
                              (e) => DropdownMenuItem(value: e, child: Text(e)))
                          .toList(),
                      onChanged: (newValue) {
                        print(newValue);
                        setState(() {
                          selectedOrganization = newValue.toString()!;
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
                  hintText: "Middle Name (Optional)",
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
                // validator: (e) =>
                //     (e?.day ?? 0) == 1 ? 'Please not the first day' : null,
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
              widget.type == "patient"
                  ? Container()
                  : DropdownButtonFormField(
                      hint: Text("Department"),
                      decoration: InputDecoration(
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        filled: true,
                      ),
                      validator: (value) =>
                          value == null ? "Select a status" : null,
                      value: selectedDepartment,
                      items: departmentItems,
                      onChanged: (newValue) {
                        print(newValue);
                        setState(() {
                          selectedDepartment = newValue.toString()!;
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
                keyboardType: TextInputType.streetAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: street1Controller,
                decoration: const InputDecoration(
                  hintText: "Street 1",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.streetAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: street2Controller,
                decoration: const InputDecoration(
                  hintText: "Street 2",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.streetAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: postalCodeController,
                decoration: const InputDecoration(
                  hintText: "Postal Code",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.streetAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: countryController,
                decoration: const InputDecoration(
                  hintText: "Country",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.streetAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: stateController,
                decoration: const InputDecoration(
                  hintText: "State",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.streetAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: cityController,
                decoration: const InputDecoration(
                  hintText: "City",
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
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: mobileNumberController,
                decoration: const InputDecoration(
                  hintText: "Mobile Number",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.phone,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: whatsappNumberController,
                decoration: const InputDecoration(
                  hintText: "Whatsapp Number (Optional)",
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.phone,
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
                  createPatientRequest();
                },
                style: ElevatedButton.styleFrom(
                    primary: kSecondaryColor, elevation: 0),
                child: Text(
                  "Submit".toUpperCase(),
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
