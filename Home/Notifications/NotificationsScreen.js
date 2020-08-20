import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SwipeListView } from "react-native-swipe-list-view";
import { Feather } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native-paper";
import * as firebase from "firebase";
import TimeAgo from "react-native-timeago";

export default class NotificationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listViewData: Array(20)
        .fill("")
        .map((_, i) => ({ key: `${i}`, text: `item #${i}` })),
      isLoading: true,
    };
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    let self = this;
    let userNofyRef = firebase
      .database()
      .ref(`/users/${user.uid}/notifications`)
      .on("value", (datasnapShot) => {
        if (datasnapShot.val()) {
          let notfyKeys = Object.keys(datasnapShot.val());
          let notfyObj = Object.values(datasnapShot.val());
          notfyKeys.forEach((item, index) => {
            notfyObj[index]["key"] = item;
          });
          self.setState({
            data: notfyObj,
            isLoading: false,
          });
        }
      });
  }

  deleteNotfy = (item) => {
    const user = firebase.auth().currentUser;
    let self = this;
    let userNofyRef = firebase
      .database()
      .ref(`/users/${user.uid}/notifications`)
      .child(item)
      .remove();
  };


  _onRemove = (_item) => { 

    this.setState({ 
      data: this.state.data.filter(item => item.key !== _item.key) 
    });
 }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <LinearGradient
          style={{ height: 80 }}
          // Button Linear Gradient
          colors={["#6200EE", "#9921E8"]}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "bold",
                letterSpacing: 1,
              }}
            >
              NOTIFICATIONS
            </Text>
          </View>
        </LinearGradient>

        <View style={{ flex: 1 }}>
          <SwipeListView
            data={this.state.data.sort(function (a, b) {
              a = new Date(a.timestamp);
              b = new Date(b.timestamp);
              return a > b ? -1 : a < b ? 1 : 0;
            })}
            renderItem={({ item }) => (
              <View
                style={{
                  height: 80,

                  backgroundColor: "#fff",
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        marginLeft: 10,
                      }}
                    >
                      <Image
                        source={{ uri: item.profileImage }}
                        style={{
                          height: null,
                          width: null,
                          flex: 1,
                          borderRadius: 25,
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {item.userName}{" "}
                      {item.type === "LIKE" ? (
                        <Text style={{ fontWeight: "normal", color: "grey" }}>
                          Liked your post
                        </Text>
                      ) : (
                        <Text style={{ fontWeight: "normal", color: "grey" }}>
                          "{item.comment}"   Comment on your post
                        </Text>
                      )}{" "}
                    </Text>
                    <Text> <TimeAgo time={item.timestamp} /></Text>
                  </View>
                </View>
              </View>
            )}
            renderHiddenItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "red",
                    height: 80,
                    width: 75,
                    justifyContent: "center",
                  }}
                >
                  <Text> Left</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    this._onRemove(item);
                    this.deleteNotfy(item.key);
                  }}
                  style={{
                    backgroundColor: "#6200EE",
                    height: 80,
                    width: 75,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Feather name="trash-2" color="#fff" size={28} />
                </TouchableOpacity>
              </View>
            )}
            leftOpenValue={0}
            rightOpenValue={-75}
          />
        </View>
      </SafeAreaView>
    );
  }
}
