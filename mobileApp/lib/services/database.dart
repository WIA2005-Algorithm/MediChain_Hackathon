// import 'package:cloud_firestore/cloud_firestore.dart';

// class DatabaseMethods {
//   Future<void> addUserInfo(userData) async {
//     FirebaseFirestore.instance
//         .collection("users")
//         .add(userData)
//         .catchError((e) {
//       print(e.toString());
//     });
//   }

//   getUserInfo(String email) async {
//     return FirebaseFirestore.instance
//         .collection("users")
//         .where("email", isEqualTo: email)
//         .get()
//         .catchError((e) {
//       print(e.toString());
//     });
//   }

//   searchUserNameUsingEmail(String email) async {
//     return FirebaseFirestore.instance
//         .collection("users")
//         .where("email", isEqualTo: email)
//         .get()
//         .catchError((e) {
//       print(e.toString());
//     }).then((snapshot) {
//       // return searched username
//       snapshot!.docs[0]["userName"];
//     });
//   }

//   searchByName(String searchField) {
//     return FirebaseFirestore.instance
//         .collection("users")
//         .where('userName', isEqualTo: searchField)
//         .get();
//   }

//   createChatRoom(String chatRoomId, chatRoomMap) {
//     FirebaseFirestore.instance
//         .collection("chatRoom")
//         .doc(chatRoomId)
//         .set(chatRoomMap)
//         .catchError((e) {
//       print(e);
//     });
//   }
// // {Stream<QuerySnapshot<Map<String, dynamic>>>? stream}

//   addConversationMessages(String chatRoomId, messageMap) {
//     FirebaseFirestore.instance
//         .collection("chatRoom")
//         .doc(chatRoomId)
//         .collection("chats")
//         .add(messageMap)
//         .catchError((e) {
//       print(e.toString());
//     });
//   }

//   orderMessagesByTime(String chatRoomId) {
//     FirebaseFirestore.instance
//         .collection("chatRoom")
//         .doc(chatRoomId)
//         .collection("chats")
//         .orderBy("time", descending: false);
//   }

//   getConversationMessages(String chatRoomId) async {
//     // orderMessagesByTime(chatRoomId);
//     return await FirebaseFirestore.instance
//         .collection("chatRoom")
//         .doc(chatRoomId)
//         .collection("chats")
//         .orderBy("time", descending: false)
//         .snapshots();
//   }

//   // getConversationMessages(String chatRoomId) async {
//   //   return FirebaseFirestore.instance
//   //       .collection("chatRoom")
//   //       .doc(chatRoomId)
//   //       .collection("chats")
//   //       .withConverter(
//   //           fromFirestore: (snapshot, _) =>
//   //               snapshot.data() ?? Map<String, dynamic>(),
//   //           toFirestore: (model, _) => Map<String, dynamic>.from(model as Map))
//   //       .snapshots();
//   // }

//   getConversationMessages_ori(String chatRoomId, messageMap) {
//     FirebaseFirestore.instance
//         .collection("chatRoom")
//         .doc(chatRoomId)
//         .collection("chats")
//         .add(messageMap)
//         .catchError((e) {
//       print(e);
//     });
//   }

//   getChatRooms(String username) async {
//     return await FirebaseFirestore.instance
//         .collection("chatRoom")
//         .where("users", arrayContains: username)
//         .snapshots();
//   }

//   getChats(String chatRoomId) async {
//     return FirebaseFirestore.instance
//         .collection("chatRoom")
//         .doc(chatRoomId)
//         .collection("chats")
//         .orderBy('time')
//         .snapshots();
//   }

//   String createChatroomId(String user1, String user2) {
//     if (user1.substring(0, 1).codeUnitAt(0) >
//         user2.substring(0, 1).codeUnitAt(0)) {
//       return "$user2\_$user1";
//     } else {
//       return "$user1\_$user2";
//     }
//   }

//   Future<void> addMessage(String chatRoomId, chatMessageData) async {
//     FirebaseFirestore.instance
//         .collection("chatRoom")
//         .doc(chatRoomId)
//         .collection("chats")
//         .add(chatMessageData)
//         .catchError((e) {
//       print(e.toString());
//     });
//   }

//   getUserChats(String itIsMyName) async {
//     return await FirebaseFirestore.instance
//         .collection("chatRoom")
//         .where('users', arrayContains: itIsMyName)
//         .snapshots();
//   }
// }
