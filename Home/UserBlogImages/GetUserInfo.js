import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import * as firebase from "firebase";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default class GetUserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      school: "",
      phone: "",
      userImage: "",
      isLoading: true,
      pImage: "",
    };
  }

  getUserInfo = async () => {
    self = this;
    const user = firebase.auth().currentUser;
    let fireRef = await firebase
      .database()
      .ref("users/" + user.uid + "/UserInfo")
      .on("value", (datasnpShot) => {
        if (datasnpShot.val()) {
          let name = datasnpShot.val().name;

          let userImage = datasnpShot.val().profileUrl;
          self.setState({
            name,
            userImage,
            isLoading: false,
          });
        }
      });
  };
  componentDidMount() {
    this.getUserInfo();
  }


 



  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#000" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{justifyContent:"center",alignItems:"center"}} >
          <View
            style={{
              height: 100,
              width: 100,
              marginTop: 15,
              
            }}
          >
            <Image
              source={{ uri: this.state.userImage }}
              style={{ height: null, width: null, flex: 1, borderRadius: 50 }}
            />
          </View>
          
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 20, color: "#fff" }}>{this.state.name}</Text>
        </View>
          
        </View>

       

      </View>
    );
  }
}
