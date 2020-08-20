import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  TouchableOpacityBase,
  StyleSheet,
  Alert,
} from "react-native";

import { ActivityIndicator } from "react-native-paper";
import * as firebase from "firebase";
import { Feather } from "@expo/vector-icons";

const FollowingScreen = ({ props, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [username, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userUid, setUserUid] = useState("");

  const pushChatID = async (uiD, followerImgUrl, name, followerUid) => {
    let user = firebase.auth().currentUser.uid;

    let userRef = firebase
      .database()
      .ref(`/users/${user}/chatThreads/${user + uiD}`);
    let followerRef = firebase
      .database()
      .ref(`/users/${uiD}/chatThreads/${user + uiD}`);
    await userRef
      .update({
        ID: firebase.auth().currentUser.uid + uiD,
        profilePic: followerImgUrl,
        name: name,
        uid: followerUid,

      })
      .then(() => {
        followerRef.update({
          ID: firebase.auth().currentUser.uid + uiD,
          profilePic: userAvatar,
          name: username,
          uid: userUid,
        });
      });
  };

  const getUserDetails = () => {
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref("users/" + user.uid + "/UserInfo")
      .on("value", (datasnpShot) => {
        if (datasnpShot.val()) {
          let name = datasnpShot.val().name;
          let userImage = datasnpShot.val().profileUrl;
          let userUid = datasnpShot.val().userUid;

          setUserName(name);
          setUserAvatar(userImage);
          setUserUid(userUid);
        }
      });
  };

  const getAllFollowings = () => {
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref("users/" + user.uid + "/userFollowing")
      .on("value", (datasnapShot) => {
        if (datasnapShot.val()) {
          let followingsKey = Object.keys(datasnapShot.val());
          let followingObj = Object.values(datasnapShot.val());
          followingsKey.forEach((item, index) => {
            followingObj[index]["key"] = item;
          });

          setData(followingObj);
          setIsLoading(false);
        }
      });
  };
  const unfollowUser= (key)=>{
    const user = firebase.auth().currentUser;
    let fireRef = firebase
      .database()
      .ref("users/" + user.uid + "/userFollowing")
      .child(key)
      .remove()
  }

  useEffect(() => {
    getAllFollowings();
    getUserDetails();
  }, []);

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <SafeAreaView style={{ flex: 1 }}>
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

      <View style={{ flex: 0.18 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
            navigation.goBack();
            }}
            style={{ marginLeft: 10 }}
          >
            <Feather name="chevron-left" size={30} />
          </TouchableOpacity>

          <View style={{ marginLeft: 80 }}>
            <Text style={{ fontSize: 22 }}>Following</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 2 }}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.followingContainer}>
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ height: 40, width: 40, marginLeft: 10 }}>
                    <Image
                      source={{ uri: item.profileImage }}
                      style={{
                        height: null,
                        width: null,
                        flex: 1,
                        borderRadius: 20,
                      }}
                    />
                  </View>

                  <View
                    style={{
                      marginLeft: 10,
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      <Text style={{ fontSize: 15 }}>{item.name}</Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          pushChatID(
                            item.uid,
                            item.profileImage,
                            item.name,
                            item.uid
                          );
                          //  navigation.navigate("Chat",{name:item.name,uid:item.uid})
                          navigation.navigate("ChatHome");
                        }}
                        style={{ marginRight: 15 }}
                      >
                        <Feather name="message-square" size={20} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                      onPress={()=>{
                        unfollowUser(item.key)
                      }}
                      
                      style={{ marginRight: 20 }}>
                        <Text
                          style={{
                            color: "#45b3e0",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        >
                          UNFOLLOW
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  followingContainer: {
    height: 60,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
});

export default FollowingScreen;
