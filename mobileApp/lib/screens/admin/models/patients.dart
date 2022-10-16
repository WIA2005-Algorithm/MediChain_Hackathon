class Patient {
  static String id = '';
  static String networkName = '';
  static String networkID = '';
  static String netAddress = '';
  static List organizations = [];
  static int networkCount = 0;

  static int networkCode = 0;
  static String networkMessage = '';
  static String createdAt = '';
  static String networkDescription = '';

  static int hospitalCount = 0;

  static void getCount(Map<String, dynamic> json) {
    networkCount = json['count'];
  }

  static void fromJson(Map<String, dynamic> json) {
    final tempDate = DateTime.parse(json['createdAt']);
    id = json['_id'];
    networkName = json['Name'];
    networkID = json['NetID'];
    netAddress = json['Address'];
    organizations = json['Organizations'];
    networkCode = json['Status']['code'];
    networkMessage = json['Status']['message'];
  }
}
