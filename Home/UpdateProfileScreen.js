import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  TouchableOpacityBase,
  ScrollView,
  StatusBar,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as firebase from "firebase";
import { LinearGradient } from "expo-linear-gradient";
import { Asset } from "expo-asset";
import Snackbar from "react-native-snackbar-component";
import * as ImagePicker from "expo-image-picker";

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      name: "",
      newName: "",
      aboutMe: "",
      newAboutMe: "",
      hobby: "",
      newHobby: "",
      firebaseImage: null,
      newImage: "empty",
      imageDownloadUrl: "",
      isUpdating: false,
      isProfileImageUploading: false,
      findMeOn: "",
      twitter: "",
      newTwitter: "",
      newfindMeOn: "",
      email: "",
      newEmail: "",
    };
  }

  componentDidMount() {
    self = this;
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref("users/" + user.uid + "/UserInfo")
      .on("value", (datasnpShot) => {
        if (datasnpShot.val()) {
          let name = datasnpShot.val().name;
          let aboutMe = datasnpShot.val().aboutMe;
          let hobby = datasnpShot.val().hobby;
          let firebaseImage = datasnpShot.val().profileUrl;
          let twitter = datasnpShot.val().twitter;
          let email = datasnpShot.val().email;
          let findMeOn = datasnpShot.val().findMeOn;

          self.setState({
            name,
            aboutMe,
            hobby,
            twitter,
            email,
            findMeOn,
            firebaseImage,
            isLoading: false,
          });
        }
      });
  }

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
      .ref(`${user.uid}/profileImage/${Date.now()}.jpg`);
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  update = async () => {
    let self = this;
    const user = firebase.auth().currentUser;
    this.setState({
      isUpdating: true,
    });

    let elf = self;
    let fireRef = firebase
      .database()
      .ref("users/" + user.uid + "/UserInfo")
      .update({
        name: this.state.newName === "" ? this.state.name : this.state.newName,
        aboutMe: this.state.newAboutMe,

        hobby: this.state.newHobby,

        twitter: this.state.newTwitter,

        email: this.state.newEmail,

        findMeOn: this.state.newfindMeOn,
      })
      .then(() => {
        elf.setState({
          isUpdating: false,
        });
      });
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.2,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.cancelled) {
      this.setState({
        newImage: result.uri,
      });
    }
  };

  uploadProfileImage = async () => {
    this.setState({
      isProfileImageUploading: true,
    });

    let user = firebase.auth().currentUser;

    let downloadURL = await this.uploadImageAsync(this.state.newImage);
    let fireRef = firebase.database().ref(`users/${user.uid}/UserInfo`).update({
      profileUrl: downloadURL,
    });
    this.setState({
      newImage: "empty",
      isProfileImageUploading: false,
    });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ justifyContent: "center", flex: 1, backgroundColor: "#fff" }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 20 }}>Loading please wait ...</Text>
          </View>
          <View style={{ height: 400, width: 400 }}>
            <Image
              source={require("./Image/loadingImage.png")}
              style={{ flex: 1, height: null, width: null }}
            />
          </View>
        </View>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ebebeb" }}>
        <View style={{ flex: 0.6 }}>
          <LinearGradient
            style={styles.gradientStyle}
            // Button Linear Gradient
            colors={["#6200EE", "#9921E8"]}
          />

          <View style={{ position: "absolute", top: 25, left: 10 }}>
            <TouchableOpacity
            onPress={()=>{
              this.props.navigation.goBack()
            }}
            
            >
            <Icon name="md-arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
           
            <View style={{ marginTop: 6 }}>
              <Text style={{ fontSize: 20, color: "#fff" }}>
                {this.state.name}
              </Text>
            </View>
          </View>

          {this.state.newImage === "empty" ? (
            <View
              style={{
                height: 120,
                width: 120,
                backgroundColor: "transparent",
                position: "absolute",
                zIndex: 100,
                borderRadius: 60,
                right: 30,
                top: 20,
              }}
            >
              <Image
                source={{ uri: this.state.firebaseImage }}
                style={{ flex: 1, height: null, width: null, borderRadius: 60 }}
              />
            </View>
          ) : this.state.isProfileImageUploading ? (
            <View
              style={{
                height: 120,
                width: 120,
                backgroundColor: "transparent",
                position: "absolute",
                zIndex: 100,
                borderRadius: 60,
                right: 30,
                top: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <View
              style={{
                height: 120,
                width: 120,
                backgroundColor: "transparent",
                position: "absolute",
                zIndex: 100,
                borderRadius: 60,
                right: 30,
                top: 20,
              }}
            >
              <Image
                source={{ uri: this.state.newImage }}
                style={{ flex: 1, height: null, width: null, borderRadius: 60 }}
              />
            </View>
          )}

          {this.state.newImage === "empty" && (
            <TouchableOpacity
              onPress={() => {
                this.pickImage();
              }}
              style={{
                height: 40,
                width: 40,
                backgroundColor: "transparent",
                position: "absolute",
                zIndex: 100,
                borderRadius: 60,
                right: 30,
                top: 110,
                backgroundColor: "#25D366",
                justifyContent: "center",
                alignItems: "center",
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
              <Ionicons name="md-camera" size={20} color="#fff" />
            </TouchableOpacity>
          )}

          {this.state.newImage !== "empty" && (
            <TouchableOpacity
              onPress={() => {
                this.uploadProfileImage();
              }}
              style={{
                height: 40,
                width: 40,
                backgroundColor: "transparent",
                position: "absolute",
                zIndex: 100,
                borderRadius: 60,
                right: 30,
                top: 110,
                backgroundColor: "#25D366",
                justifyContent: "center",
                alignItems: "center",
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
              <Feather name="upload" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ flex: 2 }}>
          {this.state.isUpdating ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#3d3d3d" />
            </View>
          ) : (
            <ScrollView style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <View style={styles.iconContainer}>
                  <Icon name="md-person" size={25} color="#ffff29" />
                </View>
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ fontSize: 20, color: "grey" }}>Name</Text>
                  <TextInput
                    placeholder={this.state.name}
                    onChangeText={(newName) => {
                      this.setState({
                        newName,
                      });
                    }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: 20 }}>
              <View style={styles.iconContainer}>
                  <Icon name="md-school" size={25} color="#add8e6" />
                </View>
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ fontSize: 20, color: "grey" }}>About me</Text>
                  <TextInput
                    placeholder={this.state.aboutMe}
                    onChangeText={(newAboutMe) => {
                      this.setState({
                        newAboutMe,
                      });
                    }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: 20 }}>
              <View style={styles.iconContainer}>
                  <FontAwesome name="futbol-o" size={25} color="#90ee90" />
                </View>
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ fontSize: 20, color: "grey" }}>Hobby</Text>
                  <TextInput
                    placeholder={this.state.hobby}
                    onChangeText={(newHobby) => {
                      this.setState({
                        newHobby,
                      });
                    }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: 20 }}>
              <View style={styles.iconContainer}>
                  <Feather name="twitter" size={25} color="#00acee" />
                </View>
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ fontSize: 20, color: "grey" }}>Twitter</Text>
                  <TextInput
                    placeholder={this.state.twitter}
                    onChangeText={(newTwitter) => {
                      this.setState({
                        newTwitter,
                      });
                    }}
                  />
                </View>
              </View>

              <View style={{ flexDirection: "row", marginTop: 20 }}>
              <View style={styles.iconContainer}>
                  <Feather name="mail" size={25} color="grey" />
                </View>
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ fontSize: 20, color: "grey" }}>Email</Text>
                  <TextInput
                    placeholder={this.state.email}
                    onChangeText={(newEmail) => {
                      this.setState({
                        newEmail,
                      });
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 20,
                  marginBottom: 20,
                }}
              >
                <View style={styles.iconContainer}>
                  <Feather name="link" size={25} color="#ff0000" />
                </View>
                <View style={{ marginLeft: 20 }}>
                  <Text style={{ fontSize: 20, color: "grey" }}>
                    Find me on{" "}
                  </Text>
                  <TextInput
                    placeholder={this.state.findMeOn}
                    onChangeText={(newfindMeOn) => {
                      this.setState({
                        newfindMeOn,
                      });
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 150,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.update();
                  }}
                >
                  <View
                    style={{
                      height: 60,
                      width: Dimensions.get("window").width - 30,
                      backgroundColor: "#fff",
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,

                      elevation: 5,

                      borderRadius: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: 10,
                    }}
                  >
                    <Text style={{ fontSize: 22, color: "grey" }}>Update</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  gradientStyle: {
    flex: 1,
    height: 140,
    flexDirection: "row",
    borderBottomLeftRadius: 40,
    borderTopRightRadius: 40,
    
  },
  iconContainer: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    height: 50,
    width: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
