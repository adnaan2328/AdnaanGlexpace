import React, { Component } from "react";
import { View, Text, FlatList, Image } from "react-native";
import * as firebase from "firebase";
import { ActivityIndicator } from "react-native-paper";
import TimeAgo from "react-native-timeago";

export default class UserStoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
    };
  }

  componentDidMount() {
    let self = this;
    let uid = this.props.uid
    let userRef = firebase
      .database()
      .ref(`users/${uid}/posts`)
      .on("value", (datasnapShot) => {
        if (datasnapShot.val()) {
          let postsKeys = Object.keys(datasnapShot.val());
          let postsObj = Object.values(datasnapShot.val());
          postsKeys.forEach((value, key) => {
            postsObj[key]["key"] = value;
          });
          self.setState({
            data: postsObj,
            isLoading: false,
          });
        }
      });
    this.setState({
      isLoading: false,
    });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="grey" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1,paddingTop:20}}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <View
              style={{
                minHeight: 120,

                justifyContent: "center",
                marginBottom: 10,
               
                backgroundColor: "#fff",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,
                marginHorizontal:10

              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    height: 110,
                    width: 100,

                    marginLeft: 10,
                  }}
                >
                  <Image
                    source={{ uri: item.postImageUrl === "" ? "http://lorempixel.com/output/abstract-q-g-640-480-7.jpg"  : item.postImageUrl  }}
                    style={{ height: null, width: null, flex: 1 }}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 20 }}>
                  <Text style={{ color: "grey" }}>
                    <TimeAgo time={item.timestamp} />
                  </Text>
                  <Text style={{ fontSize: 15, color: "grey" }}>
                    {item.story}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}
