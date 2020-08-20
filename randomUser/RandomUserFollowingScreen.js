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
} from "react-native";

import { ActivityIndicator } from "react-native-paper";
import * as firebase from "firebase";
import { Feather } from "@expo/vector-icons";

const FollowingScreen = ({ navigation }) => {
  let uid = navigation.getParam("uid");
  const getAllFollowings = () => {
    let fireRef = firebase
      .database()
      .ref("users/" + uid + "/userFollowing")
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

  useEffect(() => {
    getAllFollowings();
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

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
            <View
              style={{
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
              }}
            >
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
                    ></View>
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

export default FollowingScreen;
