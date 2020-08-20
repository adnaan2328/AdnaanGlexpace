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

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.2,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.cancelled) {
      this.setState({
        pImage: result.uri,
      });
    }
  };

  uploadImageAsync = async (uri) => {
    const parts = uri.split(".");
    const fileExtension = parts[parts.length - 1];
    const user = firebase.auth().currentUser;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Failed !!"));
      };

      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref(`${user.uid}/personalImages/${Date.now()}.${fileExtension}`);
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  upload = async () => {
    const user = firebase.auth().currentUser;
    const dbRef = firebase.database().ref(`users/${user.uid}/blogImages`);
    if (this.state.pImage === "") {
      Alert.alert("Please pick a image.");
    } else {
      const downloadURL = await this.uploadImageAsync(this.state.pImage);
      await dbRef.push({
        blogImages: downloadURL,
      });
    }
  };

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
        {/* <LG
          colors={["red", "yellow", "green"]}
          // style={styles.linearGradient}
        >
           <GetUserInfo />
        </LG> */}

        <View style={{ flex: 0.8, backgroundColor: "#6200EE",justifyContent:"center",alignItems:"center" }}>
        <Image source={{uri:"https://image.freepik.com/free-vector/video-player-banner_1366-360.jpg"}}  style={{height:140,width:180,borderRadius:5}}  />
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
              justifyContent:"center",
              alignItems:"center"
            }}
          >
            <Text style={{fontSize:20,fontWeight:"bold",letterSpacing:2}} >COMMING SOON</Text>
    
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
