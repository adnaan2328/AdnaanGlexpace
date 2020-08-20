import React from "react";
import { GiftedChat } from "react-native-gifted-chat"; // 0.3.0
import firebase from "firebase";
import { TouchableOpacity, StyleSheet, View,Text } from "react-native";
import firebaseSvc from "../FirebaseSvc";
import { Feather } from "@expo/vector-icons";

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uniqueCHATTINGID: "",
      pPic: "",
    };
  }
  static navigationOptions = ({ navigation }) => ({
    title: (navigation.state.params || {}).name || "Chat!",
  });

  UNSAFE_componentWillMount() {
    let uniqueCHATTINGID = this.props.navigation.getParam("chatUNIQUEID");
    let pPic = this.props.navigation.getParam("pPic");

    this.setState({
      uniqueCHATTINGID,
      pPic,
    });
    // console.log("*******************")
    // console.log(this.props.navigation.getParam("pPic"))
  }

  componentDidMount() {
    this.refOn((message) =>
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    this.refOff();
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref(`Messages/${this.state.uniqueCHATTINGID}`);
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
      .limitToLast(30)
      .on("child_added", (snapshot) => callback(this.parse(snapshot)));
  };



  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  updateLastMessage = (message) => {
    let followerId = this.props.navigation.getParam("uid");
    let userUID = firebase.auth().currentUser.uid;
    let userRef = firebase
      .database()
      .ref(
        `/users/${userUID}/chatThreads/${this.state.uniqueCHATTINGID}/LastMessage`
      );
    let followerRef = firebase
      .database()
      .ref(
        `/users/${followerId}/chatThreads/${this.state.uniqueCHATTINGID}/LastMessage`
      );
    userRef
      .set({
        lastMessage: message,
      })
      .then(() => {
        followerRef.set({
          lastMessage: message,
        });
      });
  };

  // send the message to the Backend
  send = (messages) => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];

      const message = {
        text,
        user,
        createdAt: this.timestamp,
      };

      this.ref.push(message).then(() => {
        this.updateLastMessage(message);
      });
    }
  };

  refOff() {
    this.ref.off();
  }

  state = {
    messages: [],
  };

  get user() {
    return {
      avatar: this.state.pPic,

      id: firebaseSvc.uid,
      _id: firebaseSvc.uid, // need for gifted-chat
    };
  }




 

  

  render() {
    return (
      <GiftedChat
        isTyping={true}
        messages={this.state.messages}
        onSend={this.send}
        user={this.user}
        textInputStyle={styles.composer}
        minComposerHeight={40}
        minInputToolbarHeight={60}
        isAnimated={true}

        
      
     
      
      />
    );
  }
}
const styles = StyleSheet.create({
  composer: {
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "#dddddd",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    fontSize: 16,
    marginRight:5
  },
  btnSend: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "red",

    borderRadius: 50,
    
  },
});
export default Chat;
