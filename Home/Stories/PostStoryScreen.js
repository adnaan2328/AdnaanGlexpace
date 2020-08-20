import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { SimpleLineIcons, Feather, Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import { Overlay } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import FitImage from "react-native-fit-image";
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from "react-native-material-textfield";
import TimeAgo from "react-native-timeago";

export default class PostStoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storyImage: "",
      data: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    let user = firebase.auth().currentUser;
    let self = this;

    let userRef = firebase.database().ref(`/users/${user.uid}/Followers`);
    userRef.on("value", (datasnpaShot) => {
      if (datasnpaShot.val()) {
        let followersObj = Object.values(datasnpaShot.val());
        self.setState({
          data: followersObj,
          isLoading: false,
        });
      }
    });
    this.setState({
      isLoading: false,
    });
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
        storyImage: result.uri,
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
      .ref(`${user.uid}/userStories/${Date.now()}.${fileExtension}`);
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  postStory = async() => {
    const user = firebase.auth().currentUser;
    let lengthOfFollowers = this.state.data.length;
    let followerData = this.state.data;
    let flag = 0
    let storyImageDownloadUrl =await this.uploadImageAsync(this.state.storyImage);
    let followersRef = firebase
        .database()
        .ref(`/users/${user.uid}/Stories`).push({
          storyImage: storyImageDownloadUrl,
          name: this.state.userName,
          Image: this.state.userImage,
          expToken: (new Date(new Date().getTime() + 60 * 60 * 24 * 1000)).toString()
    
        });

    for (let i = 0; i < lengthOfFollowers; i++) {
        flag=flag+1;
      let followersRef = firebase
        .database()
        .ref(`/users/${followerData[i].uid}/Stories`);
      followersRef.push({
        storyImage: storyImageDownloadUrl,
        name: this.state.userName,
        Image: this.state.userImage,
        expToken: (new Date(new Date().getTime() + 60 * 60 * 24 * 1000)).toString()
        // token: new Date(new Date().getTime() + 60 * 60 * 24 * 1000)
      });
    }
    if(flag === lengthOfFollowers){
        this.props.navigation.goBack()
    }
  };

  UNSAFE_componentWillMount() {
    let userName = this.props.navigation.getParam("name");
    let userImage = this.props.navigation.getParam("userImage");
    this.setState({
      userName,
      userImage,
    });

    this.pickImage();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="red" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <TouchableOpacity
          onPress={() => {
            this.postStory();
          }}
          style={{
            position: "absolute",
            bottom: 20,
            right: 10,
            height: 60,
            width: 120,
            borderRadius: 80,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 18 }}>Send </Text>
          <Feather name="chevron-right" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.goBack();
          }}
          activeOpacity={0.4}
          style={{ marginTop: 20, marginLeft: 10 }}
        >
          <Feather name="x" size={30} color="#fff" />
        </TouchableOpacity>

        <View style={{ flex: 1, justifyContent: "center" }}>
          <FitImage
            source={{
              uri:
                this.state.storyImage === ""
                  ? "https://image.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg"
                  : this.state.storyImage,
            }}
          />
        </View>
      </View>
    );
  }
}
