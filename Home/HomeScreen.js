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
  Animated,
} from "react-native";
import {
  SimpleLineIcons,
  Feather,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import FitImage from "react-native-fit-image";
import TimeAgo from "react-native-timeago";
import ShowUserStories from "./Stories/ShowUserStories";
import BadgesWinScreen from "./Badges/BadgesWinScreen";

const HEADER_HEIGHT = 130;

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      getAllPost: true,
      writeAstory: "empty",
      isVisible: false,
      name: "",
      userImage: "",
      postImage: "empty",
      isPublishPost: false,
      postLikeObj: [],
      refereshing: false,
      scrollY: new Animated.Value(0),
      numberOfpostes: 0,
      showBadgeScreen: true,
      isDataMoreFetched: false,
      followingKeyArray: [],
      numberOfNotifications: null,
    };
  }

  getUserInfo = () => {
    self = this;
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref("users/" + user.uid + "/UserInfo")
      .on("value", (datasnpShot) => {
        console.log("GETTING USER INFO")
        if (datasnpShot.val()) {
          let name = datasnpShot.val().name;
          let userImage = datasnpShot.val().profileUrl;
          let numberOfpostes = datasnpShot.val().numberOfPostes;
          let userUid = datasnpShot.val().userUid;
          self.setState({
            name,
            userImage,
            numberOfpostes,
            userUid,
            isLoading: false,
          });
        }
      });
  };

  trimTheDescription = (string) => {
    var length = 100;
    var trimmedString =
      string?.length > length
        ? string?.substring(0, length - 3) + "..."
        : string?.substring(0, length);
    return trimmedString;
  };

  refereshData = () => {
    let postRef = firebase.database().ref("allPosts");
    let self = this;
    postRef.on("value", (datasnapShot) => {
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
        });
      }
    });
  };

  // fieldRef = React.createRef();

  getAllFollowings = () => {
    self = this;
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref("users/" + user.uid + "/userFollowing")
      .on("value", (datasnpShot) => {
        console.log("GETTING USER FOLLOWING")
        if (datasnpShot.val()) {
          let followingKey = Object.keys(datasnpShot.val());
          let followingObj = Object.values(datasnpShot.val());

          self.setState({
            followingKeyArray: followingObj,
            
          });
        }
      });
    this.getUserInfo();
   
  };

  // componentWillUnmount(){
  //   this.getAllFollowings()
  // }

 

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

    let userFollowingRef = firebase
      .database()
      .ref(`/users/${user.uid}/userFollowing`);

    let followerRef = firebase.database().ref(`users/${userUid}/Followers`);

    if (user.uid == userUid) {
      //
    } else {
      this._toastWithDurationGravityHandler(name);

      userFollowingRef
        .push({
          uid: userUid,
          profileImage: image,
          name: name,
        })
        .then(() => {
          followerRef.push({
            uid: user.uid,
            name: this.state.name,
            profileImage: this.state.userImage,
          });
        });
    }
  };

  

  getAllPost = () => {
    let postRef = firebase.database().ref("allPosts").limitToLast(5);
    let self = this;
    postRef
      .on("value", (datasnapShot) => {
        console.log("GETTING ALL POSTS")
        
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
          });
        }
        this.getAllFollowings();
      })
      
      
  };


  checkUserIsBlocked = ()=>{
    let user = firebase.auth().currentUser;
    let userRef = firebase.database().ref(`/users/${user.uid}/UserInfo`)
    .on("value",(datasnapShot)=>{
      if(datasnapShot.val()){
        let isBlocked = datasnapShot.val().isBlocked;
        if(isBlocked){
          firebase.auth().signOut();
          Alert.alert("Please contact admin.")
        }
      }

    })

  }


 

  componentDidMount() {
    this.getAllPost();
    this.checkUserIsBlocked()
  }

  selectItem = (item) => {
    item.isSelect = !item.isSelect;

    const index = this.state.data.findIndex((iteM) => item._id === iteM._id);

    this.state.data[index] = item;
    this.setState({
      data: this.state.data,
    });
  };

  hideBadgeScreen = () => {
    this.setState({
      showBadgeScreen: false,
    });

    self = this;
    const user = firebase.auth().currentUser;
    let fireRef = firebase.database().ref("users/" + user.uid + "/UserInfo");
    fireRef.update({
      numberOfPostes: this.state.numberOfpostes + 1,
    });
  };

  loadMorePosts = () => {
    this.setState({
      isDataMoreFetched: true,
    });

    setTimeout(() => {
      let postRef = firebase
        .database()
        .ref("allPosts")
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

  checkUserIsFollowingOrNot = (randomUserUid) => {
    let userFollowingArray = this.state.followingKeyArray;

    for (let i = 0; i < userFollowingArray.length; i++) {
      if (userFollowingArray[i].uid === randomUserUid) {
        return true;
      }
    }
  };

  

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 150; // how far from the bottom

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  render() {
    const diffClampScrollY = Animated.diffClamp(
      this.state.scrollY,
      0,
      HEADER_HEIGHT
    );

    const headerY = diffClampScrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT],
    });

    if (this.state.isLoading) {
      return (
        <View
          style={{ justifyContent: "center", flex: 1, backgroundColor: "#fff" }}
        >
          <ActivityIndicator size="large" color="#3d3d3d" />
        </View>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar
          barStyle="dark-content"
          // dark-content, light-content and default
          hidden={false}
          //To hide statusBar
          backgroundColor="#ebebeb"
          //Background color of statusBar only works for Android
          translucent={false}
          //allowing light, but not detailed shapes
          networkActivityIndicatorVisible={true}
        />

        

        {this.state.showBadgeScreen &&
          ((this.state.numberOfpostes === 5 && (
            <BadgesWinScreen
              number={this.state.numberOfpostes}
              disableBADGESCREEN={this.hideBadgeScreen}
            />
          )) ||
            (this.state.numberOfpostes === 59 && (
              <BadgesWinScreen
                number={this.state.numberOfpostes}
                disableBADGESCREEN={this.hideBadgeScreen}
              />
            )) ||
            (this.state.numberOfpostes === 199 && (
              <BadgesWinScreen
                number={this.state.numberOfpostes}
                disableBADGESCREEN={this.hideBadgeScreen}
              />
            )) ||
            (this.state.numberOfpostes === 449 && (
              <BadgesWinScreen
                number={this.state.numberOfpostes}
                disableBADGESCREEN={this.hideBadgeScreen}
              />
            )))}

        <Animated.View
          style={{
            height: HEADER_HEIGHT,
            borderBottomWidth: 0.4,
            borderBottomColor: "#ebebeb",
            backgroundColor: "#fff",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            elevation: 1000,
            transform: [{ translateY: headerY }],
          }}
        >
          <View
            style={{
              height: 40,
              backgroundColor: "#fff"
            }}
          >
            <Animated.View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 0,
               
              }}
            >
              <View
                style={{ height: 30, width: 100, justifyContent: "center" }}
              >
                <Image
                  source={require("./Image/gpL.png")}
                  style={{ height: 40, width: 100 }}
                />
              </View>
              <TouchableOpacity
              onPress={()=>{
                this.props.navigation.navigate("Explore")
              }}
              style={{height:30,width:220,backgroundColor:"rgba(0,0,0,0.1)"}} >
              <View style={{flexDirection:"row",alignItems:"center",flex:1,paddingLeft:10}} >
              <Feather name="search" size={18} color="grey"  />
              <Text style={{color:"grey",marginLeft:10}} >Search</Text>
              </View>

              </TouchableOpacity>

              <TouchableOpacity
              style={{marginRight:10}}
            onPress={() => {
              this.props.navigation.navigate("ChatInHome");
            }}
          >
              <FontAwesome5 name="comment-alt" size={20} color="#111" />

              </TouchableOpacity>
  
            </Animated.View>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={{ alignItems: "center" }}
            showsHorizontalScrollIndicator={false}
          >
            <View style={{ marginLeft: 10 }}>
              <TouchableOpacity
                style={styles.addStoryButton}
                onPress={() => {
                  this.props.navigation.navigate("PostStory", {
                    name: this.state.name,
                    userImage: this.state.userImage,
                  });
                }}
              >
                <Image
                  source={{ uri: this.state.userImage }}
                  style={styles.userProfileImageStyle}
                />
              </TouchableOpacity>
              <Text style={{ marginTop: 6 }}>Your Story</Text>
            </View>

            <ShowUserStories />
          </ScrollView>
        </Animated.View>

        {this.state.getAllPost ? (
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
          <Animated.FlatList
            style={{ paddingTop: HEADER_HEIGHT }}
            bounces={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {
                nativeEvent: { contentOffset: { y: this.state.scrollY } },
                
              },
              
            ],{
              useNativeDriver:true,
              listener:({nativeEvent})=>{
                if (this.isCloseToBottom(nativeEvent)) {
                  // Dont forget to debounce or throttle this function.
                  this.loadMorePosts();
                }

              }

            })}
            showsVerticalScrollIndicator={false}
            data={this.state.data.sort(function (a, b) {
              a = new Date(a.timestamp);
              b = new Date(b.timestamp);
              return a > b ? -1 : a < b ? 1 : 0;
            })}
            renderItem={({ item }) => (
              <View
                style={{
                  minHeight: item.postImageUrl !== "" ? 360 : 170,
                  backgroundColor: "#fff",
                  marginHorizontal: 0,
                  marginTop: 20,
                  borderRadius: 10,
                  marginBottom: 10,
                  borderRadius: 10,
                }}
              >
                {item.postImageUrl !== "" && (
                  <FitImage
                    source={{ uri: item.postImageUrl }}
                    style={{ borderRadius: 10 }}
                  />
                )}
                <View
                  style={{
                    minHeight: 10,
                    padding: 8,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 10,
                  }}
                >
                  <View>
                    <Text style={{ fontWeight: "bold", color: "grey" }}>
                      {" "}
                      {item.miscellaneous}{" "}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.timeAgoStyle}>
                      <TimeAgo time={item.timestamp} />
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("PostDetail", {
                      key: item.key,
                      numberOfViews: item.views,
                      likes: item.likes,
                      rUserUid: item.userUid,
                    });
                  }}
                >
                  <View style={styles.storyHeading}>
                    <Text style={{ fontSize: 22, color: "#45b3e0" }}>
                      {item.storyHeading}
                    </Text>
                  </View>
                  <View style={styles.story}>
                    <Text style={{ fontSize: 15, color: "#000" }}>
                      {this.trimTheDescription(item.story)}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    height: 80,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={styles.randomUserProfileImage}>
                      <Image
                        source={{ uri: item.userProfileImage }}
                        style={{
                          height: null,
                          width: null,
                          flex: 1,
                          borderRadius: 25,
                        }}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate("RandomUserProfile", {
                          uid: item.userUid,
                        });
                      }}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                        {item.userName}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    disabled={this.checkUserIsFollowingOrNot(item.userUid)}
                    onPress={() => {
                      this.followButton(
                        item.userUid,
                        item.userName,
                        item.userProfileImage
                      );
                    }}
                    style={{ marginRight: 20 }}
                  >
                    {this.checkUserIsFollowingOrNot(item.userUid) === true ? (
                      <Text style={styles.followingStyle}>Following</Text>
                    ) : (
                      <Text style={styles.followStyle}>Follow</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <View
                  style={styles.viewsContainer}
                >
                  <View style={{ marginRight: 10 }}>
                    <Text style={{ color: "grey", fontSize: 18 }}>
                      {item.views}
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Feather name="eye" size={30} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.timestamp}
            ListFooterComponent={() => (
              <View style={styles.footer}>
                <ActivityIndicator size="large" color="grey" />
              </View>
            )}
            // onScroll={({ nativeEvent }) => {
            //   if (this.isCloseToBottom(nativeEvent)) {
            //     // Dont forget to debounce or throttle this function.
            //     this.loadMorePosts();
            //   }
            // }}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  addStoryButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 30,
    marginLeft: 10,
    marginTop: 2,
  },
  commentButtonStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
  },
  likeButtonStyle: {
    marginHorizontal: 20,
    flexDirection: "row",
    marginBottom: 15,
  },
  storyHeading: {
    marginLeft: 10,
    marginTop: 10,
    borderBottomColor: "#ebebeb",
    borderBottomWidth: 0.7,
    paddingBottom: 5,
  },
  story: {
    marginLeft: 10,
    marginTop: 10,
    borderBottomColor: "#ebebeb",
    borderBottomWidth: 0.7,
    paddingBottom: 5,
  },
  userProfileImageStyle: {
    height: null,
    width: null,
    flex: 1,
    borderRadius: 30,
  },
  randomUserProfileImage: {
    height: 50,
    width: 50,
    marginLeft: 10,
    marginRight: 15,
  },
  followingStyle: {
    color: "#45b3e0",
    fontSize: 16,
    fontWeight: "bold",
  },
  followStyle: {
    color: "#45b3e0",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 150,
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
  gradientStyle: {
    position: "absolute",
    height: 50,
    width: 50,

    bottom: 70,
    right: 10,
    zIndex: 1000,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  timeAgoStyle: {
    color: "grey",
    fontWeight: "bold",
    marginRight: 10,
  },
  viewsContainer:{
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
    marginBottom: 10,
    justifyContent: "flex-end",
  }
});
