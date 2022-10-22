import "package:flutter/material.dart";
import 'package:medichain/screens/patient/patientPage.dart';
import '../../constants.dart';

class PatientHome extends StatefulWidget {
  const PatientHome({super.key});

  @override
  State<PatientHome> createState() => PatientHomeState();
}

class PatientHomeState extends State<PatientHome> {
  int _selectedIndex = 0;
  List _widgetOptions = [];
  TextStyle optionStyle = TextStyle(fontSize: 30, fontWeight: FontWeight.bold);

  @override
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    // TODO: implement initState
    _widgetOptions = [
      PatientPage(),
      Text(
        'Index 2: Medical Record',
        style: optionStyle,
      ),
    ];
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return _widgetOptions.isNotEmpty && ApiConstants.accessToken.isNotEmpty
        ? Scaffold(
            body: Center(
              child: _widgetOptions.elementAt(_selectedIndex),
            ),
            bottomNavigationBar: Theme(
                data: Theme.of(context).copyWith(
                    // sets the background color of the `BottomNavigationBar`
                    canvasColor: kPrimaryColor,
                    // sets the active color of the `BottomNavigationBar` if `Brightness` is light
                    primaryColor: Colors.red,
                    textTheme: Theme.of(context).textTheme.copyWith(
                        caption: new TextStyle(color: Colors.yellow))),
                child: BottomNavigationBar(
                  items: const <BottomNavigationBarItem>[
                    BottomNavigationBarItem(
                      icon: Icon(Icons.person),
                      label: 'Profile',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.medication),
                      label: 'Medical Records',
                    ),
                  ],
                  currentIndex: _selectedIndex,
                  selectedItemColor: Colors.amber[800],
                  onTap: _onItemTapped,
                )),
          )
        : Center(child: CircularProgressIndicator());
  }
}
