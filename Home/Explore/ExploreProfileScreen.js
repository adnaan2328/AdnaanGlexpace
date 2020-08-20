import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import * as firebase from "firebase";
import { Feather,FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { withNavigation } from "react-navigation";

class ExploreStoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      isDataMoreFetched: false,
      followingKeyArray: [],
      name: "",
      userImage: "",
      userUid: "",
      goToGetAllFollowings:false,
      goToGetUserInfo:false
    };
    this.arrayholder = [];
  }

  getAllFollowings = () => {
    self = this;
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref("users/" + user.uid + "/userFollowing")
      .on("value", (datasnpShot) => {
        if (datasnpShot.val()) {
          let followingKey = Object.keys(datasnpShot.val());
          let followingObj = Object.values(datasnpShot.val());

          self.setState({
            followingKeyArray: followingObj,
            goToGetUserInfo:true
           
          });
        }
        this.getUserInfo();
      })
      
  };

  checkUserIsFollowingOrNot = (randomUserUid) => {
    let userFollowingArray = this.state.followingKeyArray;

    for (let i = 0; i < userFollowingArray.length; i++) {
      if (userFollowingArray[i].uid === randomUserUid) {
        return true;
      }
    }
  };

  getAllUsers = () => {
    let postRef = firebase.database().ref("/users");
    let self = this;
    postRef.once("value", (datasnapShot) => {
      if (datasnapShot.val()) {
        let postKey = Object.keys(datasnapShot.val());
        let postObject = Object.values(datasnapShot.val());
        postKey.forEach((values, item) => {
          postObject[item]["key"] = values;
          postObject[item]["isSelect"] = false;
        });
        self.setState(
          {
            data: postObject,
           
            goToGetAllFollowings:true
          },
          function () {
            this.arrayholder = postObject;
          }
        );
      }
    }).then(()=>{
      this.getAllFollowings();
    })
    
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
            isLoading:false,

            userUid,
          });
        }
      });
  };

  componentDidMount() {
    this.getAllUsers();

    

   

  }

  selectItem = (item) => {
    item.isSelect = !item.isSelect;

    const index = this.state.data.findIndex((iteM) => item._id === iteM._id);

    this.state.data[index] = item;
    this.setState({
      data: this.state.data,
    });
  };

  loadMoreProfiles = () => {
    this.setState({
      isDataMoreFetched: true,
    });

    setTimeout(() => {
      let postRef = firebase
        .database()
        .ref("/users")
        .limitToLast(this.state.data.length + 5);
      let self = this;
      postRef.once("value", (datasnapShot) => {
        if (datasnapShot.val()) {
          let postKey = Object.keys(datasnapShot.val());
          let postObject = Object.values(datasnapShot.val());
          postKey.forEach((values, item) => {
            postObject[item]["key"] = values;
            postObject[item]["isSelect"] = false;
          });
          self.setState({
            data: postObject,
            getAllPost: false,
            isDataMoreFetched: false,
          });
        }
      });
    }, 1500);
  };

  _toastWithDurationGravityHandler = (name) => {
    //function to make Toast With Duration And Gravity
    ToastAndroid.showWithGravity(
      `Following ${name}`,
      ToastAndroid.SHORT, //can be SHORT, LONG
      ToastAndroid.CENTER //can be TOP, BOTTON, CENTER
    );
  };

  followButton = (userUid, name, image) => {
    const user = firebase.auth().currentUser;
    let self = this;

    let userFollowingRef = firebase
      .database()
      .ref(`/users/${user.uid}/userFollowing`);

    let followerRef = firebase.database().ref(`users/${userUid}/Followers`);

    if (user.uid == userUid) {
      //
    } else {
      this._toastWithDurationGravityHandler(name);
      let that = self;

      userFollowingRef
        .push({
          uid: userUid,
          profileImage: image,
          name: name,
        })
        .then(() => {
          followerRef.push({
            uid: this.state.userUid,
            name: this.state.name,
            profileImage: this.state.userImage,
          });
        });
    }
  };

  SearchFilterFunction = (text) => {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.UserInfo.name
        ? item.UserInfo.name.toUpperCase()
        : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      //setting the filtered newData on datasource
      //After setting the data it will automatically re-render the view
      data: newData,
      text: text,
    });
  };
  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, paddingTop: 0 }}>
        <LinearGradient
          style={styles.gradient}
          // Button Linear Gradient
          colors={["#6200EE", "#9921E8"]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={(text) => this.SearchFilterFunction(text)}
                placeholder="Search"
                placeholderTextColor="#000"
                style={{ paddingVertical: 10 }}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("ChatHome");
              }}
              style={{ marginLeft: 10 }}
            >
              <Feather name="message-square" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.data}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("RandomUserInExplore", {
                    uid: item.UserInfo.userUid,
                  });
                }}
                style={styles.storiesContainer}
              >
                <View style={styles.storiesImageContainer}>
                  <Image
                    source={{ uri: item.UserInfo?.profileUrl }}
                    style={{ flex: 1, height: null, width: null }}
                  />
                </View>
                <View
                  style={{ marginLeft: 15, justifyContent: "space-evenly" }}
                >
                  <Text style={{ fontSize: 18 }}>{item.UserInfo?.name}</Text>
                  <Text style={{ color: "grey" }}>{item.story}</Text>
                </View>

                {!this.checkUserIsFollowingOrNot(item.UserInfo?.userUid) ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.followButton(
                        item.UserInfo.userUid,
                        item.UserInfo.name,
                        item.UserInfo.profileUrl
                      );
                    }}
                    style={{ flex: 1, alignItems: "flex-end" }}
                  >
                    <Text
                      style={{
                        marginRight: 10,
                        fontWeight: "bold",
                        color: "#00bfff",
                      }}
                    >
                      Follow
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    disabled={true}
                    style={{ flex: 1, alignItems: "flex-end" }}
                  >
                    <Text
                      style={{
                        marginRight: 10,
                        fontWeight: "bold",
                        color: "#00bfff",
                      }}
                    >
                      Following
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            )}
            ListFooterComponent={() => (
              <View style={styles.footer}>
                {!this.state.isDataMoreFetched ? (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      this.loadMoreProfiles();
                    }}
                    //On Click of button calling loadMoreData function to load more data
                    style={styles.loadMoreBtn}
                  >
                    <Text style={styles.btnText}>Load More</Text>
                  </TouchableOpacity>
                ) : (
                  <ActivityIndicator />
                )}
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

export default withNavigation(ExploreStoriesScreen);

const styles = StyleSheet.create({
  storiesContainer: {
    height: 80,
    marginHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
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
  },
  storiesImageContainer: {
    height: 60,
    width: 60,
    backgroundColor: "#fff",
    marginLeft: 10,
    borderRadius: 5,
  },
  inputContainer: {
    height: 40,
    backgroundColor: "#fff",
    width: Dimensions.get("window").width - 80,
    borderRadius: 5,
    opacity: 0.8,
    justifyContent: "center",
    paddingLeft: 10,
  },
  gradient: {
    flex: 0.13,
    justifyContent: "center",
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 100,
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: "#6200EE",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
  },
});
