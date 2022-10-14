import 'package:flutter/material.dart';
import 'package:medichain/constants.dart';
import 'package:medichain/screens/superAdmin/models/framework.dart';
import 'package:medichain/screens/superAdmin/pages/overview.dart';

class SuperAdminScreen extends StatefulWidget {
  const SuperAdminScreen({super.key});

  @override
  State<SuperAdminScreen> createState() => _SuperAdminScreenState();
}

class _SuperAdminScreenState extends State<SuperAdminScreen> {
  @override
  int _selectedIndex = 0;
  List _widgetOptions = [];
  TextStyle optionStyle = TextStyle(fontSize: 30, fontWeight: FontWeight.bold);
  // String hold = '';
  // String? value = await ApiConstants.getSharedValue("accessToken");

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    // TODO: implement initState
    _widgetOptions = [
      SuperAdminOverview(),
      Text(
        'Index 1: Task',
        style: optionStyle,
      ),
      Text(
        'Index 2: Notification',
        style: optionStyle,
      ),
      Text(
        'Index 3: History',
        style: optionStyle,
      ),
    ];
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return _widgetOptions.isNotEmpty
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
                      icon: Icon(Icons.home),
                      label: 'Overview',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.medication),
                      label: 'Doctor',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.people),
                      label: 'Patient',
                    ),
                    BottomNavigationBarItem(
                      icon: Icon(Icons.history),
                      label: 'History',
                    ),
                  ],
                  currentIndex: _selectedIndex,
                  selectedItemColor: Colors.amber[800],
                  onTap: _onItemTapped,
                )),
          )
        : Container(
            decoration: BoxDecoration(color: Colors.white),
            child: Center(child: CircularProgressIndicator()));
  }
}
