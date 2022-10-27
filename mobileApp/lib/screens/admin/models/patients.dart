class Patient {
  List<String> activeList = [
    "Actively Watched",
    "Waiting For Discharge",
    "Waiting To Be Assigned",
    "Not Patients"
  ];

  // Common Details
  String active = '';
  Map<String, dynamic> associatedDoctors = {};
  List checkIn = [];
  List checkOut = [];
  Map<String, dynamic> details = {};
  Map<String, dynamic> orgDetails = {};
  Map<String, dynamic> secretSharingPair = {};
  int patientCount = 0;

  // Patient Details
  int DOB = 0;
  String city = '';
  String country = '';
  String postcode = '';
  String state = '';
  String street1 = '';
  String street2 = '';

  String mobile = '';
  String otherNumber = '';
  String whatsapp = '';

  String email = '';
  String firstName = '';
  String middleName = '';
  String lastName = '';
  String fullName = '';
  String gender = '';
  String maritalStatus = '';
  String passport = '';

  // Org Details
  String org = '';
  String role = '';

  // Associated Doctors
  String doctorID = '';
  String EMRID = '';
  String PHRID = '';

  List activeDoctorStatus = [];
  String assignedOn = '';
  String deAssigned = '';
  String department = '';
  String dischargeOk = '';
  String doctorEmail = '';
  String name = '';
  String note = '';

  Patient(Map<String, dynamic> json) {
    active = json['active'] ?? 'null';
    associatedDoctors = json['associatedDoctors'] ?? 'null';
    // print("Doctors $associatedDoctors");
    // json['checkIn'].forEach((date) {
    //   DateTime hold =
    //       DateTime.fromMillisecondsSinceEpoch(date * 1000, isUtc: true);
    //   print("${hold.day} ${hold.month} ${hold.year}");
    //   checkIn.add("${hold.day} ${hold.month} ${hold.year}");
    // });
    // print("Check in $checkIn");
    // checkIn.add(json['checkIn'] != null
    //     ? DateTime.parse(json['checkIn'].toString())
    //     : 'null');
    // checkOut.add(json['checkOut'] != null
    //     ? DateTime.parse(json['']['checkOut'].toString())
    //     : 'null');
    details = json['details'] ?? 'null';
    orgDetails = json['orgDetails'] ?? 'null';
    secretSharingPair = json['secretSharingPair'] ?? 'null';

    // Patient Details
    // final tempDate = DateTime.parse(json['DOB'].toString());

    // DOB = tempDate as int;
    city = details['address']['city'] ?? 'null';
    country = details['address']['country'] ?? 'null';
    postcode = details['address']['postcode'] ?? 'null';
    state = details['address']['state'] ?? 'null';
    street1 = details['address']['street1'] ?? 'null';
    street2 = details['address']['street2'] ?? 'null';

    mobile = details['contact']['mobile'] ?? 'null';
    otherNumber = details['contact']['otherNumber'] ?? 'null';
    whatsapp = details['contact']['whatsapp'] ?? 'null';

    email = details['email'] ?? 'null';
    firstName = details['firstName'] ?? 'null';
    middleName = details['middleName'] ?? 'null';
    lastName = details['lastName'] ?? 'null';
    fullName = '$firstName $middleName $lastName';
    gender = details['gender'] ?? 'null';
    maritalStatus = details['maritalStatus'] ?? 'null';
    passport = details['passport'] ?? 'null';

    org = orgDetails['org'] ?? 'null';
    role = orgDetails['role'] ?? 'null';

    // Details(details);
    // OrgDetails(orgDetails);

    // Associated Doctors

    // doctorID = associatedDoctors[''];
    // EMRID = associatedDoctors['PHRID'];
    // activeDoctorStatus = associatedDoctors[''];
    // assignedOn = associatedDoctors[''];
    // deAssigned = associatedDoctors[''];
    // department = associatedDoctors[''];
    // dischargeOk = associatedDoctors[''];
    // doctorEmail = associatedDoctors[''];
    // name = associatedDoctors[''];
    // note = associatedDoctors[''];
  }
}

class Details {
  int DOB = 0;
  String city = '';
  String country = '';
  String postcode = '';
  String state = '';
  String street1 = '';
  String street2 = '';

  String mobile = '';
  String otherNumber = '';
  String whatsapp = '';

  String email = '';
  String firstName = '';
  String middleName = '';
  String lastName = '';
  String gender = '';
  String maritalStatus = '';
  String passport = '';

  Details(Map<String, dynamic> json) {
    // final tempDate = DateTime.parse(json['DOB'].toString());

    // DOB = tempDate as int;
    city = json['address']['city'] ?? 'null';
    country = json['address']['country'] ?? 'null';
    postcode = json['address']['postcode'] ?? 'null';
    state = json['address']['state'] ?? 'null';
    street1 = json['address']['street1'] ?? 'null';
    street2 = json['address']['street2'] ?? 'null';

    mobile = json['contact']['mobile'] ?? 'null';
    otherNumber = json['contact']['otherNumber'] ?? 'null';
    whatsapp = json['contact']['whatsapp'] ?? 'null';

    email = json['email'] ?? 'null';
    firstName = json['firstName'] ?? 'null';
    middleName = json['middleName'] ?? 'null';

    if (middleName == "UNDEFINED") {
      middleName = "";
    }
    lastName = json['lastName'] ?? 'null';
    gender = json['gender'] ?? 'null';
    maritalStatus = json['maritalStatus'] ?? 'null';
    passport = json['passport'] ?? 'null';
  }
}

class OrgDetails {
  String org = '';
  String role = '';

  OrgDetails(Map<String, dynamic> json) {
    org = json['org'] ?? 'null';
    role = json['role'] ?? 'null';
  }
}
