import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { SimpleLineIcons, Feather, Ionicons } from "@expo/vector-icons";

import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";

import { ProgressBar } from "react-native-paper";
import DropdownAlert from "react-native-dropdownalert";
import { ActivityIndicator } from "react-native-paper";

export default class AddBlogScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postImage: "",
      writeAstory: "",
      shouldExpand: false,
      data: [],
      selectedMisc: "empty",
      name: "",
      userImage: "",
      storydescp: "",
      isLoading: false,
      numberOfPostes: 0,
    };
  }

  showAlert = (item) => {
    this.dropDownAlertRef.alertWithType("warn", `Please write story ${item}.`);
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
        postImage: result.uri,
      });
    }
  };

  getAllMiscellaneous = () => {
    let postRef = firebase.database().ref("MISCELLANEOUS");
    let self = this;
    postRef.on("value", (datasnapShot) => {
      if (datasnapShot.val()) {
        let miscKey = Object.keys(datasnapShot.val());
        let miscObject = Object.values(datasnapShot.val());
        miscKey.forEach((values, item) => {
          miscObject[item]["key"] = values;
          miscObject[item]["isSelect"] = false;
        });
        self.setState({
          data: miscObject,
        });
      }
    });
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
      .ref(`${user.uid}/postImages/${Date.now()}.${fileExtension}`);
    const snapshot = await ref.put(blob);
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  publishPost = async () => {
    let self = this;

    const user = firebase.auth().currentUser;
    let postRef = firebase.database().ref("allPosts");
    let userRef = firebase.database().ref("/users/" + user.uid + "/posts");
    let userInfoRef = firebase
      .database()
      .ref("/users/" + user.uid + "/UserInfo");

    if (this.state.writeAstory === "" || this.state.storydescp === "" || this.state.selectedMisc === "empty" ) {
      if (this.state.writeAstory === "") {
        this.showAlert("heading");
      } else if ( this.state.selectedMisc === "empty" ) {
        this.showAlert("feature")
      }
      
      else {
        this.showAlert("description");
      }



    } else {
      this.setState({
        isPublishPost: true,
        isLoading: true,
      });

      let postImageDownloadUrl = "";

      if (this.state.postImage !== "empty") {
        postImageDownloadUrl = await this.uploadImageAsync(
          this.state.postImage
        );
      }

      postRef
        .push({
          type: "image",
          postImageUrl: postImageDownloadUrl,
          storyHeading:
            this.state.writeAstory === "" ? "" : this.state.writeAstory,
          userName: this.state.name,
          userProfileImage: this.state.userImage,
          userUid: user.uid,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
          numberOfComments: 0,
          likes: 0,
          story: this.state.storydescp,
          miscellaneous: this.state.selectedMisc,
          views: 0,
        })
        .then(() => {
          userRef
            .push({
              postImageUrl: postImageDownloadUrl,
              storyHeading: this.state.writeAstory,
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              story: this.state.storydescp,
              miscellaneous: this.state.selectedMisc,
            })
            .then(() => {
              userInfoRef
                .update({
                  numberOfPostes: this.state.numberOfPostes + 1,
                })
                .then(() => {
                  self.setState({
                    isLoading: false,
                    postImage: "",
                  });
                });
            });
        });

      this.props.navigation.navigate("Home");
    }
  };

  getUserInfo = () => {
    self = this;
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref("users/" + user.uid + "/UserInfo")
      .on("value", (datasnpShot) => {
        if (datasnpShot.val()) {
          let name = datasnpShot.val().name;
          let userImage = datasnpShot.val().profileUrl;
          let numberOfPostes = datasnpShot.val().numberOfPostes;
          self.setState({
            name,
            userImage,
            isLoading: false,
          });
          if (numberOfPostes !== undefined) {
            self.setState({
              numberOfPostes,
            });
          }
        }
      });
  };

  componentDidMount() {
    this.getAllMiscellaneous();
    this.getUserInfo();
    let postImage = this.props.navigation.getParam("postImage");

    this.setState({
      postImage,
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#6300EE" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#ebebeb" }}>
        <ProgressBar progress={1} color="#ff4500" />
        <View style={styles.background}>
     
        </View>
        <DropdownAlert  ref={(ref) => (this.dropDownAlertRef = ref)}   />
      
        <ScrollView style={styles.postContainer}>
       
          <View style={{ flex: 1, paddingTop: 10 }}>
       
            <View style={styles.headingContainer}>
          
              <TextInput
                style={styles.textInputStyle}
                multiline={true}
                placeholder="HEADING OF YOUR STORY"
                onChangeText={(writeAstory) => {
                  this.setState({
                    writeAstory,
                  });
                }}
              />
            </View>

            <View
              style={{
                minHeight: this.state.shouldExpand ? 150 : 30,
                marginHorizontal: 10,
                padding: 20,
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                marginBottom: 5,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                onPress={() => {
                  this.setState({
                    shouldExpand: !this.state.shouldExpand,
                  });
                }}
              >
                {this.state.selectedMisc === "empty" ? (
                  <Text style={{ fontWeight: "bold" }}> FEATURES</Text>
                ) : (
                  <Text style={{ fontWeight: "bold" }}>
                    {this.state.selectedMisc}
                  </Text>
                )}

                <Feather
                  name={this.state.shouldExpand ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
              {this.state.shouldExpand && (
                <FlatList
                  data={this.state.data}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({
                          selectedMisc: item.name,
                          shouldExpand: false,
                        });
                      }}
                      style={{ marginVertical: 10 }}
                    >
                      <Text> {item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>

            <View style={styles.descriptionContainer}>
              <TextInput
                multiline={true}
                placeholder="YOUR STORY"
                onChangeText={(storydescp) => {
                  this.setState({
                    storydescp,
                  });
                }}
              />
            </View>

            <View style={styles.imageAndButtonContainer}>
              <TouchableOpacity>
                <Animated.View
                  style={{
                    height: 100,
                    width: 200,
                    marginLeft: 10,
                  }}
                >
                  <Image
                    source={{
                      uri: this.props.navigation.getParam("postImage"),
                    }}
                    style={{ flex: 1, height: null, width: null }}
                  />
                </Animated.View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.publishPost();
                }}
                style={styles.publishButtonStyle}
              >
                <Text style={{ color: "#fff", fontSize: 15 }}>PUBLISH</Text>
                <Feather name="chevron-right" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  postContainer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    shadowColor: "#fff",
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowRadius: 4,
    shadowOpacity: 0.25,
    elevation: 0,
  },
  background: {
    borderBottomRightRadius: 60,
    backgroundColor: "#6200EE",
    borderBottomLeftRadius: 60,
    position: "absolute",
    height: 300,
    right: 0,
    left: 0,
    top: 0,
  },
  headingContainer: {
    paddingTop: 5,
    paddingHorizontal: 10,
    minHeight: 100,
  },
  textInputStyle: {
    padding: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  descriptionContainer: {
    padding: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginBottom: 10,
    height: 200,
    marginHorizontal: 10,
    marginTop: 10,
  },
  publishButtonStyle: {
    height: 40,
    width: 100,
    borderRadius: 10,
    backgroundColor: "#6200ee",
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  imageAndButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
