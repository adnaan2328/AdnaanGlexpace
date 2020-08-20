import React, { Component } from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  TouchableOpacityBase,
  TextInput,
} from "react-native";
import * as firebase from "firebase";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
import TimeAgo from "react-native-timeago";

export default class CommentsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      postKey: "",
      isLoading: true,
      name: "",
      school: "",
      phone: "",
      userImage: "",
      comment: "",
      numberOfComments: "",
    };
  }

  getUserInfo = async () => {
    self = this;
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref("users/" + user.uid + "/UserInfo")
      .on("value", (datasnpShot) => {
        if (datasnpShot.val()) {
          let name = datasnpShot.val().name;
          let userImage = datasnpShot.val().profileUrl;
          let userUid = datasnpShot.val().userUid;
          self.setState({
            name,
            userUid,

            userImage,
            isLoading: false,
          });
        }
      });
  };

  UNSAFE_componentWillMount() {
    this.getUserInfo();
    // Alert.alert(this.props.rUserUid)
  }

  postAComment = () => {
    this.textInput.clear();
    let key = this.props.keY;
    let self = this;
    let postRef = firebase.database().ref("allPosts/" + key);
    let userNotifications = firebase
      .database()
      .ref(`users/${this.props.rUserUid}/notifications`);
    let postCommentRef = firebase
      .database()
      .ref("allPosts/" + key + "/allComments");
    postCommentRef.push({
      comment: this.state.comment,
      name: this.state.name,
      userImage: this.state.userImage,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
    });
    postRef
      .update({
        numberOfComments: parseInt(this.state.numberOfComments) + 1,
      })
      .then(() => {
        userNotifications.push({
          type: "COMMENT",
          userName: this.state.name,
          profileImage: this.state.userImage,
          userUid: this.state.userUid,
          comment: self.state.comment,
          timestamp: firebase.database.ServerValue.TIMESTAMP,
        });
      });
  };

  componentDidMount() {
    let key = this.props.keY;

    let postRef = firebase.database().ref("allPosts/" + key);

    let commentRef = firebase
      .database()
      .ref("allPosts/" + key + "/allComments");
    commentRef.on("value", (datasnapShot) => {
      if (datasnapShot.val()) {
        let commentKey = Object.keys(datasnapShot.val());
        let commentObject = Object.values(datasnapShot.val());
        commentKey.forEach((values, item) => {
          commentObject[item]["key"] = values;
        });
        self.setState({
          data: commentObject,
          isLoading: false,
        });
      }
    });
    postRef.on("value", (datasnapShot) => {
      if (datasnapShot.val()) {
        let numberOfComments = datasnapShot.val().numberOfComments;
        this.setState({
          numberOfComments: parseInt(numberOfComments),
        });
      }
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#3d3d3d" />
        </View>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            flex: 0.3,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <View>
            <Text style={{ fontSize: 20, marginLeft: 20 }}>Comments</Text>
          </View>
        </View>

        <View style={{ flex: 2, backgroundColor: "#fff" }}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View
                style={{
                  height: 100,

                  flexDirection: "row",
                  paddingTop: 10,
                  paddingHorizontal: 15,
                }}
              >
                <View style={{ height: 50, width: 50 }}>
                  <Image
                    source={{ uri: item.userImage }}
                    style={{
                      height: null,
                      width: null,
                      flex: 1,
                      borderRadius: 25,
                    }}
                  />
                </View>
                <View style={{ marginLeft: 15 }}>
                  <Text style={{ fontSize: 18 }}>
                    {item.name}{" "}
                    <Text style={{ color: "grey", fontSize: 15 }}>
                      {" "}
                      - <TimeAgo time={item.timestamp} />
                    </Text>
                  </Text>

                  <Text style={{ marginRight: 50 }}>{item.comment}</Text>
                </View>
              </View>
            )}
          />
        </View>

        <View
          style={{
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            <TextInput
              ref={(input) => {
                this.textInput = input;
              }}
              placeholder="Type a comment..."
              style={{ backgroundColor: "#fff" }}
              style={{ justifyContent: "center", backgroundColor: "#fff" }}
              onChangeText={(comment) => {
                this.setState({
                  comment,
                });
              }}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              this.postAComment();
            }}
            style={{
              width: 80,
              backgroundColor: "#00bfff",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Feather name="corner-down-right" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
