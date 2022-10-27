import 'package:intl/intl.dart';
import 'package:medichain/screens/admin/models/patients.dart';

class EachDoctor {
  List<String> active = [];
  String assignedOn = '';
  int EMRID = 0;
  String? deAssigned = '';
  String department = "";
  String? dischargeOk = "null";
  String email = "";
  String name = "";
  String note = "";

  EachDoctor.getJson(Map<String, dynamic> json) {
    print("test 1");
    active = List<String>.from(json["active"]);
    print("test 2");

    final tempAssigned = DateTime(json["assignedOn"]).toLocal();
    print("test 3");

    assignedOn =
        "${DateFormat.MMMM().format(tempAssigned)} ${tempAssigned.day}, ${tempAssigned.year}";

    print("TYPES ::- ${(json["deAssigned"]).runtimeType}");

    try {
      final tempDeAssigned = DateTime(json["deAssignedOn"]).toLocal();
      deAssigned =
          "${DateFormat.MMMM().format(tempDeAssigned)} ${tempDeAssigned.day}, ${tempDeAssigned.year}";
      // ignore: empty_catches
    } catch (err) {
      print(err.toString());
    }

    department = json["department"] ?? 'null';
    dischargeOk = json["dischargeOk"].toString();
    email = json["email"] ?? 'null';
    name = json["name"] ?? 'null';
    note = json["note"] ?? 'null';
    EMRID = json["EMRID"] ?? 0;
  }
}

class AssociatedDoctors {
  Map<String, EachDoctor> doctors = <String, EachDoctor>{};
  AssociatedDoctors(Map<String, dynamic> json) {
    json.forEach((key, value) {
      doctors[key] = EachDoctor.getJson(value);
    });
  }
}

class PatientDetailsAPIResponse {
  String active = "";
  List<num> checkIn = [];
  List<num> checkOut = [];
  OrgDetails? orgDetails;
  Details? details;
  AssociatedDoctors? associatedDoctors;

  PatientDetailsAPIResponse(Map<String, dynamic> json) {
    print("HELLO");
    active = json["active"] ?? "";
    print("HELLO - 2");
    checkIn = List<num>.from(json["checkIn"]);
    checkOut = List<num>.from(json["checkOut"]);
    orgDetails = OrgDetails(json["orgDetails"]);
    details = Details(json["details"]);
    associatedDoctors = AssociatedDoctors(json["associatedDoctors"]);
  }
}
