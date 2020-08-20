import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import * as firebase from "firebase";
import FitImage from "react-native-fit-image";
import { Feather } from "@expo/vector-icons";
import CommentsScreen from "./CommentsScreen";

const IMAGE_HEIGHT = 300;
const IMAGE_WIDTH = Dimensions.get("window").width;

const AnimatedFeather = Animated.createAnimatedComponent(Feather);

export default class PostdetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      scrollY: new Animated.Value(0),
      animation: new Animated.Value(0),
      likeAnimation: new Animated.Value(1),
      showCommentScreen: false,
      key: "",
      isPostLiked: false,
      userPostLikesArray: [],
      name: "",
      userImage: "",
      userUid: "",
    };
  }

  UNSAFE_componentWillMount() {
    let self = this;
    let key = this.props.navigation.getParam("key");
    this.getUserInfo()
    let numberOfViews = this.props.navigation.getParam("numberOfViews");
    this.getAllUserLikes();

    let postRef = firebase
      .database()
      .ref("allPosts")
      .child(key)
      .update({
        views: numberOfViews + 1,
      });
  }

  getAllUserLikes = () => {
    let self = this;
    let user = firebase.auth().currentUser;
    let userLikeRef = firebase.database().ref(`/users/${user.uid}/postLikes`);
    userLikeRef.on("value", (datasnapShot) => {
      if (datasnapShot.val()) {
        let likeKeys = Object.keys(datasnapShot.val());
        let likeObj = Object.values(datasnapShot.val());
        self.setState({
          userPostLikesArray: likeObj,
        });
      }
    });
  };

  checkLikes = () => {
    let key = this.props.navigation.getParam("key");
    let userLikesArray = this.state.userPostLikesArray;

    for (let i = 0; i < userLikesArray.length; i++) {
      if (userLikesArray[i].postId === key) {
        return true;
      }
    }
  };

  componentDidMount() {
    let key = this.props.navigation.getParam("key");
    this.setState({
      key,
    });
    let self = this;
    let postRef = firebase.database().ref("allPosts").child(key);
    postRef.on("value", (datasnapShot) => {
      if (datasnapShot.val()) {
        let userName = datasnapShot.val().userName;
        let story = datasnapShot.val().story;
        let postImageUrl = datasnapShot.val().postImageUrl;
        let userProfileImage = datasnapShot.val().userProfileImage;
        let storyHeading = datasnapShot.val().storyHeading;
        let storyDes = datasnapShot.val().story;
        self.setState({
          userName,
          story,
          postImageUrl,
          userProfileImage,
          isLoading: false,
          storyHeading,
          storyDes,
        });
      }
    });
  }

  triggerCommentAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 200,
    }).start(() => {
      this.setState({
        showCommentScreen: true,
      });
    });
  };

  reverseAnimation = () => {
    this.setState({
      showCommentScreen: false,
    });
    Animated.timing(this.state.animation, {
      toValue: 0,
      duration: 400,
     
    }).start();
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
          let userUid = datasnpShot.val().userUid;
          self.setState({
            name,
            userImage,
            userUid,
          });
        }
      });
  };

  likePost = () => {
    let user = firebase.auth().currentUser;
  
    let rUserUid = this.props.navigation.getParam("rUserUid");

    let userPostLikeRef = firebase
      .database()
      .ref(`/users/${user.uid}/postLikes`);
    let userNotifications = firebase
      .database()
      .ref(`users/${rUserUid}/notifications`);
    userPostLikeRef
      .push({
        postId: this.props.navigation.getParam("key"),
      })
      .then(() => {
        userNotifications.push({
          type: "LIKE",
          userName:this.state.name,
          profileImage:this.state.userImage,
          userUid:this.state.userUid,
          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      });
  };

  render() {
    const ANIMATED_SCALE = this.state.scrollY.interpolate({
      inputRange: [0, 0.5, IMAGE_HEIGHT],
      outputRange: [1, 1, 0],
    });

    const ANIMATED_RIGHT = this.state.scrollY.interpolate({
      inputRange: [0, IMAGE_HEIGHT],
      outputRange: [30, 170],
      extrapolate: "clamp",
    });

    const bgStyle = {
      transform: [
        {
          scale: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 30],
          }),
        },
      ],
    };

    const zINDEX = {
      zIndex: this.state.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1000],
      }),
    };

    const animatedLikeStyle = {
      transform: [
        {
          scale: this.state.animation,
        },
      ],
    };

    const scaleAnimation = {
      transform: [
        {
          scale: ANIMATED_SCALE,
        },
      ],
    }

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
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.showCommentScreen && (
          <View
            style={{
              backgroundColor: "#fff",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 100000,
              flex: 1,
              marginHorizontal: 20,
              marginVertical: 60,
              borderRadius: 10,
            }}
          >
            <CommentsScreen keY={this.state.key} rUserUid ={ this.props.navigation.getParam("rUserUid")}   />
          </View>
        )}

        {!this.state.showCommentScreen ? (
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
            style={{ position: "absolute", top: 20, left: 2, zIndex: 10 }}
          >
            <Feather size={30} name="chevron-left" color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              this.reverseAnimation();
            }}
            style={{ position: "absolute", top: 20, left: 2, zIndex: 10 }}
          >
            <Feather size={30} name="x" color="#fff" />
          </TouchableOpacity>
        )}

        <Animated.ScrollView
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: { contentOffset: { y: this.state.scrollY } },
            },
          ])}
        >
          <Animated.View
            style={{
              height: IMAGE_HEIGHT,
              width: IMAGE_WIDTH,
              transform: [
                {
                  scaleY: ANIMATED_SCALE,
                },
              ],
              justifyContent: "center",
           
            }}
          >
            <Image
              source={{ uri: this.state.postImageUrl }}
              style={{ height: null, width: null, flex: 1 }}
            />
          </Animated.View>

          <View
            style={{
              minHeight: 800,
              backgroundColor: "#fff",
              marginTop: -25,
              borderTopRightRadius: 32,
              borderTopLeftRadius: 32,
            }}
          >
            <Animated.View
              style={{
                height: 70,
                width: 70,
                borderRadius: 25,
                position: "absolute",
                right: ANIMATED_RIGHT,
                top: -25,

                shadowColor: "#000",
                shadowOffset: {
                  width: 5,
                  height: 3,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 0,
                zIndex: 0,
              }}
            >
              <Image
                source={{ uri: this.state.userProfileImage }}
                style={{ height: null, width: null, flex: 1, borderRadius: 35 }}
              />
            </Animated.View>

            <View
              style={{
                minHeight: 10,
                marginTop: 50,
                paddingLeft: 20,
                marginHorizontal: 20,
                borderBottomColor: "grey",
                borderBottomWidth: 0.2,
                borderStyle: "dotted",
              }}
            >
              <Animated.View
                style={[styles.background, bgStyle, zINDEX]}
              ></Animated.View>

              {!this.checkLikes() ? (
                <TouchableOpacity
                  onPress={() => {
                    this.likePost();
                  }}
                  style={styles.likeIconContainer}
                >
                  <Image
                    source={require("./images/like.png")}
                    style={{ flex: 1, height: 35, width: 35 }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  disabled={true}
                  style={styles.likeIconContainer}
                >
                  <Image
                    source={require("./images/liked.png")}
                    style={{ flex: 1, height: 35, width: 35 }}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  this.triggerCommentAnimation();
                }}
                style={styles.commentIconContainer}
              >
                <Feather name="message-circle" size={30} color="grey" />
              </TouchableOpacity>

              <View style={styles.userNameContainer}>
                <Text style={styles.userNameText}>{this.state.userName}</Text>
              </View>

              <View style={styles.headingContainer}>
                <Text style={styles.headingText}>
                  {this.state.storyHeading}
                </Text>
              </View>
            </View>
            <View style={styles.postDescription}>
              <Text>{this.state.storyDes}</Text>
            </View>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    right: 10,
    height: 35,
    width: 35,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17.5,
  },
  likeButton: {
    position: "absolute",
    right: 50,
    height: 35,
    width: 35,
  },
  postDescription: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headingText: {
    color: "grey",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 1,
  },
  headingContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  userNameText: {
    fontSize: 32,
    fontFamily: "sans-serif-light",
    letterSpacing: 2,
  },
  userNameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentIconContainer: {
    position: "absolute",
    right: 10,
    height: 35,
    width: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17.5,
  },
  likeIconContainer: {
    position: "absolute",
    right: 60,
    height: 35,
    width: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});
