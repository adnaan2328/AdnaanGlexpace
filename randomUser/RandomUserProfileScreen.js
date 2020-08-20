import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TouchableOpacityBase,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import * as firebase from "firebase";
import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Container, Header, Tab, Tabs, ScrollableTab } from "native-base";
import RandomUserBlogScreen from "./RandomUserBlogScreen"
import RandomUserImageScreen from "./RandomUserImageScreen"
import { LinearGradient } from "expo-linear-gradient";
import RandomUserMedalsScreen from "./RandomUserMedalsScreen"
// import ImageScreen from "./ImageScreen";
// import UserStoriesScreen from "./Stories/UserStoriesScreen";
// import MedalsScreen from "./Medals/MedalsScreen";

export default class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      name: "",
      aboutMe: "",
      hobby: "",
      firebaseImage: "",
      test: "",
      twitter: "",
      email: "",
      findMeOn: "",
      followingNumber: null,
      followerNumber: null
    };
  }

  getFollowingsNumber = (key) => {
    let self = this;
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref(`/users/${key}/Followers/`)
      .on("value", (datasnapShot) => {
        if (datasnapShot.val()) {
          let followerObj = Object.keys(datasnapShot.val());
          let followerNumber = followerObj.length;
          self.setState({
            followerNumber,
          });
        }
      });
  };

  getFollowerNumber= (key)=>{
    let self = this;
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref(`/users/${key}/userFollowing/`)
      .on("value", (datasnapShot) => {
        if (datasnapShot.val()) {
          let followingObj = Object.keys(datasnapShot.val());
          let followingNumber = followingObj.length;
          self.setState({
            followingNumber,
          });
        }
      });

  }

  componentDidMount() {
    let key = this.props.navigation.getParam("uid")
    this.getFollowingsNumber(key);
    this.getFollowerNumber(key);

    
    self = this;
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref("users/" + key + "/UserInfo")
      .on("value", (datasnpShot) => {
        if (datasnpShot.val()) {
          let name = datasnpShot.val().name;
          let aboutMe = datasnpShot.val().aboutMe;
          let hobby = datasnpShot.val().hobby;
          let findMeOn = datasnpShot.val().findMeOn;
          let email = datasnpShot.val().email;
          let twitter = datasnpShot.val().twitter;

          let firebaseImage = datasnpShot.val().profileUrl;
          this.setState({
            name,
            aboutMe,
            hobby,
            firebaseImage,
            isLoading: false,
            twitter,
            findMeOn,
            email,
          });
        }
      });
    this.setState({
      isLoading: false,
    });
  }

  openEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  openURL = (url) => {
    Linking.openURL(`https://${url}`);
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
      
        </View>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ebebeb" }}>
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

        <View style={{ flex: 1 }}>
          <Tabs
            tabBarUnderlineStyle={{
              backgroundColor: "red",
              height: 1,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
            renderTabBar={() => <ScrollableTab />}
          >
            <Tab
              activeTabStyle={{ backgroundColor: "#fff" }}
              activeTextStyle={{ color: "#000" }}
              tabStyle={{ backgroundColor: "#fff" }}
              textStyle={{ color: "#000" }}
              heading="ABOUT"
            >
              <ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 0.6,  }}>
                  <View style={{ flex: 1 }}>
                  <LinearGradient
                    style={{
                      flex: 1,
                      height: 150,
                      flexDirection: "row",
                      borderBottomLeftRadius: 40,
                      borderTopRightRadius:40
                    }}
                    // Button Linear Gradient
                    colors={["#6200EE", "#9921E8"]}
                  />
                 

                    <View style={{ position: "absolute", top: 25, left: 10 }}>
                      <View style={{ marginTop: 6 }}>
                        <Text style={{ fontSize: 20, color: "#fff" }}>
                          {this.state.name}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        height: 100,
                        width: 100,
                        backgroundColor: "transparent",
                        position: "absolute",
                        zIndex: 100,
                        borderRadius: 50,
                        right: 30,
                        top: 20,
                      }}
                    >
                      <Image
                        source={{ uri: this.state.firebaseImage }}
                        style={{
                          flex: 1,
                          height: null,
                          width: null,
                          borderRadius: 60,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        backgroundColor: "transparent",
                        position: "absolute",
                        zIndex: 100,

                        top: 70,
                        left: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate("RandomUserFollowing",{uid:this.props.navigation.getParam("uid")});
                        }}
                        style={{
                          height: 60,
                          width: 100,
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "#fff",
                          }}
                        >
                          {this.state.followingNumber === null
                            ? 0
                            : this.state.followingNumber}
                        </Text>
                        <Text style={{ color: "#fff" }}>FOLLOWING</Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        backgroundColor: "transparent",
                        position: "absolute",
                        zIndex: 100,

                        top: 70,
                        left: 110,
                      }}
                    >
                      <View
                        style={{
                          height: 60,
                          width: 100,
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 20,
                            color: "#fff",
                          }}
                        >
                          {this.state.followerNumber === null ?  0  : this.state.followerNumber }
                        </Text>
                        <Text style={{ color: "#fff" }}>FOLLOWER</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={{ flex: 2 }}>
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <View style={styles.profileIcons}>
                      <Icon name="md-person" size={25} color="#ffff29" />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                      <Text style={{ fontSize: 20, color: "grey" }}>Name</Text>
                      <Text style={{ fontSize: 18 }}>{this.state.name}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <View style={styles.profileIcons}>
                      <Icon name="md-school" size={25} color="#add8e6" />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                      <Text style={{ fontSize: 20, color: "grey" }}>
                        About Me
                      </Text>
                      <Text style={{ fontSize: 18 }}>{this.state.aboutMe}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <View style={styles.profileIcons}>
                      <Icon name="md-call" size={25} color="#90ee90" />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                      <Text style={{ fontSize: 20, color: "grey" }}>Hobby</Text>
                      <Text style={{ fontSize: 18 }}>{this.state.hobby}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <View style={styles.profileIcons}>
                      <Feather name="twitter" size={25} color="#00acee" />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                      <Text style={{ fontSize: 20, color: "grey" }}>
                        Twitter
                      </Text>
                      <Text style={{ fontSize: 18 }}>{this.state.twitter}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <View style={styles.profileIcons}>
                      <Feather name="mail" size={25} color="grey" />
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        this.openEmail(this.state.email);
                      }}
                    >
                      <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 20, color: "grey" }}>
                          Email
                        </Text>
                        <Text style={{ fontSize: 18, color: "blue" }}>
                          {this.state.email}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <View style={styles.profileIcons}>
                      <Feather name="link" size={25} color="#ff0000" />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                      <Text style={{ fontSize: 20, color: "grey" }}>
                        Find me on
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          this.openURL(this.state.findMeOn);
                        }}
                      >
                        <Text style={{ fontSize: 18, color: "blue" }}>
                          {this.state.findMeOn}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ height: 100 }}></View>
                </View>
              </ScrollView>
            </Tab>
            <Tab
              activeTabStyle={{ backgroundColor: "#fff" }}
              activeTextStyle={{ color: "#000" }}
              tabStyle={{ backgroundColor: "#fff" }}
              textStyle={{ color: "#000" }}
              heading="STORIES"
            >
             <RandomUserBlogScreen uid={this.props.navigation.getParam("uid")} />
            </Tab>
            <Tab
              activeTabStyle={{ backgroundColor: "#fff" }}
              activeTextStyle={{ color: "#000" }}
              tabStyle={{ backgroundColor: "#fff" }}
              textStyle={{ color: "#000" }}
              heading="TACTILE"
            ></Tab>
            <Tab
              activeTabStyle={{ backgroundColor: "#fff" }}
              activeTextStyle={{ color: "#000" }}
              tabStyle={{ backgroundColor: "#fff" }}
              textStyle={{ color: "#000" }}
              heading="IMAGE"
            >
              < RandomUserImageScreen uid={this.props.navigation.getParam("uid")} />
            </Tab>
            <Tab
              activeTabStyle={{ backgroundColor: "#fff" }}
              activeTextStyle={{ color: "#000" }}
              tabStyle={{ backgroundColor: "#fff" }}
              textStyle={{ color: "#000" }}
              heading="MEDALS"
            >
            < RandomUserMedalsScreen uid = {this.props.navigation.getParam("uid")}  />
            </Tab>
          </Tabs>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  profileIcons: {
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
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  updateButton: {
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
    width: 250,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
