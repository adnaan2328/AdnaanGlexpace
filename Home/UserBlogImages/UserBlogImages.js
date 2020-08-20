import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableHighlight,
  Alert,
} from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import * as firebase from "firebase";
import DropdownAlert from "react-native-dropdownalert";

import ImageViewer from "react-native-image-zoom-viewer";

import * as ImagePicker from "expo-image-picker";

export default class UserBlogImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      pImage: "empty",
      isUploading: false,
    };
  }

  componentDidMount() {
    let self = this;
    let user = firebase.auth().currentUser;
    let userRef = firebase
      .database()
      .ref(`users/${user.uid}/blogImages`)
      .on("value", (datasnapShot) => {
        if (datasnapShot.val()) {
          let blogImagesKeys = Object.keys(datasnapShot.val());
          let blogImagesObj = Object.values(datasnapShot.val());
          blogImagesKeys.forEach((value, key) => {
            blogImagesObj[key]["key"] = value;
          });
          self.setState({
            data: blogImagesObj,
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

  showAlert = (number) => {
    this.dropDownAlertRef.alertWithType(
      "warn",
      `Sorry you can only post ${number} photos.`
    );
  };

  upload = async () => {

    if(this.state.data.length === 15) {
      this.showAlert(15)
      

    } else {
      this.setState({
        pImage: "empty",
        isUploading: true,
      });
      const user = firebase.auth().currentUser;
      let self = this;
      const dbRef = firebase.database().ref(`users/${user.uid}/blogImages`);
      if (this.state.pImage === "") {
        Alert.alert("Please pick a image.");
      } else {
        const downloadURL = await this.uploadImageAsync(this.state.pImage);
        await dbRef
          .push({
            blogImages: downloadURL,
          })
          .then(() => {
            self.setState({
              isUploading: false,
            });
          });
      }
    }
  
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="grey" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, paddingTop: 5 }}>
        <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
        {this.state.pImage !== "empty" && (
          <View
            style={{
              position: "absolute",
              top: 220,
              bottom: 0,
              left: 10,
              right: 10,

              zIndex: 1000,

              alignItems: "center",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <View style={{ height: 200, width: "100%" }}>
              <Image
                source={{ uri: this.state.pImage }}
                style={{ flex: 1, height: null, width: null }}
              />
            </View>
          </View>
        )}

        {this.state.isUploading && (
          <View
            style={{
              position: "absolute",
              top: 220,
              bottom: 0,
              left: 10,
              right: 10,

              zIndex: 1000,

              alignItems: "center",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <View
              style={{
                height: 200,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="grey" />
            </View>
          </View>
        )}

        {this.state.pImage === "empty" ? (
          <TouchableOpacity
            onPress={() => {
              this.pickImage();
            }}
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              position: "absolute",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              zIndex: 100,
              right: 10,
              bottom: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="camera" size={30} color="#3d3d3d" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              this.upload();
            }}
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              position: "absolute",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
              zIndex: 100,
              right: 10,
              bottom: 20,
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Feather name="upload" size={30} color="#3d3d3d" />
          </TouchableOpacity>
        )}

        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 22 }}>Photos</Text>
        </View>

        

        <FlatList
          numColumns={3}
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  marginLeft: 0,
                  marginBottom: 10,
                  alignItems: "center",
                }}
              >
                <View style={{ height: 130, width: 100 }}>
                  <Image
                    source={{ uri: item.blogImages }}
                    style={{ flex: 1, height: null, width: null }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        </View>
    );
  }
}


