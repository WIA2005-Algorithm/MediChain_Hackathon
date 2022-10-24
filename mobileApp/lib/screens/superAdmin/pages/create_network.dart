import 'package:flutter/material.dart';
import '../../../constants.dart';

class CreateNetwork extends StatefulWidget {
  const CreateNetwork({super.key});

  @override
  State<CreateNetwork> createState() => _CreateNetworkState();
}

class _CreateNetworkState extends State<CreateNetwork> {
  @override
  Widget build(BuildContext context) {
    TextEditingController networkNameController = TextEditingController();
    TextEditingController networkIDController = TextEditingController();
    TextEditingController networkAddressController = TextEditingController();
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text("Create Network"),
        elevation: 0,
        backgroundColor: kBackgroundColor,
        bottom: const PreferredSize(
          preferredSize: Size.fromHeight(2),
          child: Text(
            'Add a new hyperledger fabric network',
            style: TextStyle(color: Colors.white60),
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: EdgeInsets.all(20),
          child: Column(
            children: [
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: networkNameController,
                decoration: const InputDecoration(
                  hintText: "First_Network",
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
                  'A valid network name contains atleast 5 characters with no spaces, no special characters in the beginning or end. Allowed special characters include ‘underscore’ and  ‘dot’. ',
                  style: TextStyle(color: Colors.white54),
                ),
              ),
              const SizedBox(height: defaultPadding),
              TextFormField(
                keyboardType: TextInputType.emailAddress,
                textInputAction: TextInputAction.next,
                cursorColor: kPrimaryColor,
                controller: networkIDController,
                decoration: const InputDecoration(
                  hintText: "Medic",
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
                controller: networkAddressController,
                decoration: const InputDecoration(
                  hintText: "Type your network address here...",
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
                  "For blockchain address, please remove http|https:// and www., if any",
                  style: TextStyle(color: Colors.white54),
                ),
              ),
              const SizedBox(height: defaultPadding),
              ElevatedButton(
                onPressed: () async {
                  String snackBarString = 'Failed to create network';
                  final snackBar = SnackBar(content: Text(snackBarString));
                  await SuperAdminConstants.sendPOST(
                      SuperAdminConstants.createNetwork, <String, String>{
                    "name": networkNameController.text,
                    "netID": networkIDController.text,
                    "address": networkAddressController.text,
                  }).then((response) async {
                    print("Response code: ${response.statusCode}");

                    if (response.statusCode == 200) {
                      Navigator.pop(context);
                      snackBarString = 'Network created successfully';
                    } else {
                      throw Exception('Failed to create network');
                    }
                  }).catchError((onError) {
                    print('Error : ${onError.toString()}');
                  });
                },
                style: ElevatedButton.styleFrom(
                    primary: kSecondaryColor, elevation: 0),
                child: Text(
                  "Create Network".toUpperCase(),
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
