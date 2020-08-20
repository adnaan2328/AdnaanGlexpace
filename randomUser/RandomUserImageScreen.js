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
import { TouchableOpacity } from "react-native-gesture-handler";
import UserBlogImages from "./RandomUserBlogImages"
import { LinearGradient } from "expo-linear-gradient";
import GetUserInfo from "./RandomUserGetUserInfo"


export default class ImageScreen extends Component {
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

  

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
   

   <View style={{ flex: 0.8, backgroundColor: "#6200EE",justifyContent:"center",alignItems:"center" }}>
        <Image source={{uri:"https://image.freepik.com/free-vector/images-concept-illustration_114360-218.jpg"}}  style={{height:140,width:180,borderRadius:5}}  />
          {/* <GetUserInfo /> */}
        </View>

        <View style={{ flex: 2, backgroundColor: "#ebebeb" }}>
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
              marginTop: -10,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
          >
            <UserBlogImages uid={this.props.uid} />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
