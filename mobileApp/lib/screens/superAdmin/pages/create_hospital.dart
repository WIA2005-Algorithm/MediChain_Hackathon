import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/src/widgets/container.dart';
import 'package:medichain/screens/superAdmin/models/network_info.dart';
import '../../../constants.dart';

class CreateHospital extends StatefulWidget {
  const CreateHospital({super.key, required this.networkName});
  final String networkName;
  @override
  State<CreateHospital> createState() => _CreateHospitalState();
}

class _CreateHospitalState extends State<CreateHospital> {
  bool _inProgress = false;
  String networkName = "";

  @override
  Widget build(BuildContext context) {
    TextEditingController hospNameController = TextEditingController();
    TextEditingController hospIDController = TextEditingController();
    TextEditingController adminIDController = TextEditingController();
    TextEditingController adminPassController = TextEditingController();
    TextEditingController countryController = TextEditingController();
    TextEditingController stateController = TextEditingController();
    TextEditingController locationController = TextEditingController();
    setState(() {
      networkName = widget.networkName;
    });
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Create Hospital"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(2),
          child: Text(
            'Add a new hopital organisation',
            style: TextStyle(color: Colors.white60),
          ),
        ),
      ),
      body: _inProgress == true
          ? CircularProgressIndicator()
          : SingleChildScrollView(
              child: Container(
                padding: EdgeInsets.all(20),
                child: Column(
                  children: [
                    const SizedBox(height: defaultPadding),
                    Text(
                      "Hospital Organisation Name",
                      style: kSectionTextStyle,
                    ),
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        "The hospital organisation details helps determine determine and create the Certificate Authority (CA)"
                        " for its particular doctors and patients",
                        style: TextStyle(color: Colors.white54, fontSize: 14),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: defaultPadding),
                    TextFormField(
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      cursorColor: kPrimaryColor,
                      controller: hospNameController,
                      decoration: const InputDecoration(
                        hintText: "Hospital  Organization Name",
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
                      controller: hospIDController,
                      decoration: const InputDecoration(
                        hintText: "Hospital ID/Short Name",
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
                    const SizedBox(height: defaultPadding),
                    TextFormField(
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      cursorColor: kPrimaryColor,
                      controller: adminIDController,
                      decoration: const InputDecoration(
                        hintText: "Admin ID/Username",
                        prefixIcon: Padding(
                          padding: EdgeInsets.all(defaultPadding),
                          child: Icon(Icons.language),
                        ),
                      ),
                    ),
                    const SizedBox(height: defaultPadding / 2),
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        "A valid username contains atleast 5 character with no spaces, no special characters in the"
                        " begenning or end. Allowed spacial characters include 'underscore' and 'dot'",
                        style: TextStyle(color: Colors.white54),
                      ),
                    ),
                    const SizedBox(height: defaultPadding),
                    TextFormField(
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      cursorColor: kPrimaryColor,
                      controller: adminPassController,
                      obscureText: true,
                      decoration: const InputDecoration(
                        hintText: "Admin Password",
                        prefixIcon: Padding(
                          padding: EdgeInsets.all(defaultPadding),
                          child: Icon(Icons.language),
                        ),
                      ),
                    ),
                    const SizedBox(height: defaultPadding / 2),
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        "A valid username contains atleast 5 character with no spaces, no special characters in the"
                        " begenning or end. Allowed spacial characters include 'underscore' and 'dot'",
                        style: TextStyle(color: Colors.white54),
                      ),
                    ),
                    const SizedBox(height: defaultPadding),
                    const Divider(
                      height: 20,
                      thickness: 3,
                      indent: 20,
                      endIndent: 0,
                      color: Colors.white,
                    ),
                    const SizedBox(height: defaultPadding),
                    Text(
                      "Hospital Location Details",
                      style: kSectionTextStyle,
                    ),
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        "The hospital location details helps determine the valid permission constrol over the records for it's doctors and patients"
                        " while exchanging records between hospitals",
                        style: TextStyle(color: Colors.white54, fontSize: 14),
                        textAlign: TextAlign.center,
                      ),
                    ),
                    const SizedBox(height: defaultPadding),
                    TextFormField(
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      cursorColor: kPrimaryColor,
                      controller: countryController,
                      decoration: const InputDecoration(
                        hintText: "Choose a country",
                        prefixIcon: Padding(
                          padding: EdgeInsets.all(defaultPadding),
                          child: Icon(Icons.flag),
                        ),
                      ),
                    ),
                    const SizedBox(height: defaultPadding / 2),
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        "Please select a valid country from the list",
                        style: TextStyle(color: Colors.white54),
                      ),
                    ),
                    const SizedBox(height: defaultPadding),
                    TextFormField(
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      cursorColor: kPrimaryColor,
                      controller: stateController,
                      decoration: const InputDecoration(
                        hintText: "Choose a State/Province",
                        prefixIcon: Padding(
                          padding: EdgeInsets.all(defaultPadding),
                          child: Icon(Icons.location_city),
                        ),
                      ),
                    ),
                    const SizedBox(height: defaultPadding / 2),
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        "Please select a valid state/province from the list",
                        style: TextStyle(color: Colors.white54),
                      ),
                    ),
                    const SizedBox(height: defaultPadding),
                    TextFormField(
                      keyboardType: TextInputType.emailAddress,
                      textInputAction: TextInputAction.next,
                      cursorColor: kPrimaryColor,
                      controller: locationController,
                      decoration: const InputDecoration(
                        hintText: "Choose a location",
                        prefixIcon: Padding(
                          padding: EdgeInsets.all(defaultPadding),
                          child: Icon(Icons.location_on),
                        ),
                      ),
                    ),
                    const SizedBox(height: defaultPadding / 2),
                    const Padding(
                      padding: EdgeInsets.all(8.0),
                      child: Text(
                        "A valid location (City) constains only alphabets and spaces",
                        style: TextStyle(color: Colors.white54),
                      ),
                    ),
                    const SizedBox(height: defaultPadding),
                    ElevatedButton(
                      onPressed: () {
                        // getNetworkDetails();
                        // String snackBarString = 'Fill in the required details';
                        // var snackBar = SnackBar(content: Text(snackBarString));

                        SuperAdminConstants.sendPOST(
                            SuperAdminConstants.createOrganisation,
                            <String, String>{
                              "networkName": networkName,
                              "fullName": hospNameController.text,
                              "id": hospIDController.text,
                              "adminID": adminIDController.text,
                              "password": adminPassController.text,
                              "country": countryController.text,
                              "state": stateController.text,
                              "location": locationController.text,
                            }).then((response) async {
                          print("Response code: ${response.statusCode}");

                          if (response.statusCode == 200) {
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                                content:
                                    Text('Organisation created successfully')));
                            Navigator.pop(context);
                          } else {
                            throw Exception('Failed to create organization');
                          }
                        }).catchError((onError) {
                          ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(onError.toString())));
                          print('Error : ${onError.toString()}');
                        });
                        // ScaffoldMessenger.of(context)
                        //     .showSnackBar(SnackBar(content: Text(snackBarString)));
                      },
                      style: ElevatedButton.styleFrom(
                          primary: kSecondaryColor, elevation: 0),
                      child: Text(
                        "Create organization".toUpperCase(),
                        style: TextStyle(color: Colors.black),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  TextEditingController CustomInputField(String hintText, String subText) {
    TextEditingController textEditingController = TextEditingController();
    Column(
      children: [
        SizedBox(height: defaultPadding),
        TextFormField(
          keyboardType: TextInputType.emailAddress,
          textInputAction: TextInputAction.next,
          cursorColor: kPrimaryColor,
          controller: textEditingController,
          decoration: InputDecoration(
            hintText: hintText,
            prefixIcon: const Padding(
              padding: EdgeInsets.all(defaultPadding),
              child: Icon(Icons.language),
            ),
          ),
        ),
        const SizedBox(height: defaultPadding / 2),
        Padding(
          padding: EdgeInsets.all(8.0),
          child: Text(
            subText,
            style: TextStyle(color: Colors.white54),
          ),
        ),
      ],
    );
    return textEditingController;
  }
}
