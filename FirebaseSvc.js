import firebase from "firebase";
import uuid from "uuid";
import { Alert } from "react-native";

const config = {
  apiKey: "AIzaSyAMgfH6RIYKJB0a-FlPIQuafKugBtAduZo",
  authDomain: "glexpace-cb1f4.firebaseapp.com",
  databaseURL: "https://glexpace-cb1f4.firebaseio.com",
  projectId: "glexpace-cb1f4",
  storageBucket: "glexpace-cb1f4.appspot.com",
  messagingSenderId: "571297492872",
  appId: "1:571297492872:web:adc65b9252eab76bd7543d",
  measurementId: "G-JBEXRPBDP4",
};

class FirebaseSvc {
  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    } else {
      console.log("firebase apps already running...");
    }
  }

 
 


  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref(`Messages/12UniqueID`);
  }

  parse = (snapshot) => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: id } = snapshot;
    const { key: _id } = snapshot; //needed for giftedchat
    const timestamp = new Date(numberStamp);

    const message = {
      id,
      _id,
      timestamp,
      text,
      user,
    };
    return message;
  };

  uniqueID = () => {
    return new Date().toString();
  };

  refOn = (callback) => {
    this.ref
      .limitToLast(20)
      .on("child_added", (snapshot) => callback(this.parse(snapshot)));
  };

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  // send the message to the Backend
  send = (messages) => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];

      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };
    
      this.ref.push(message);
    }
  };

  refOff() {
    this.ref.off();
  }
}

const firebaseSvc = new FirebaseSvc();
export default firebaseSvc;
