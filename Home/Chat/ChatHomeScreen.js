import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import * as firebase from "firebase";
import TimeAgo from "react-native-timeago";
import { Feather } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";

export default class ChatHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      text: "",
    };
    this.arrayholder = [];
  }

  SearchFilterFunction = (text) => {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
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

  componentDidMount() {
    let user = firebase.auth().currentUser;
    let self = this;
    let userChatRef = firebase.database().ref(`users/${user.uid}/chatThreads`);
    userChatRef.on("value", (datasnapShot) => {
      if (datasnapShot.val()) {
        let chatObj = datasnapShot.val();
        let chatKey = Object.keys(chatObj);
        let chatValues = Object.values(chatObj);

        self.setState(
          {
            data: chatValues,
          },
          function () {
            this.arrayholder = chatValues;
          }
        );
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.header}>
          <Text style={styles.headerHeadingText}>Direct</Text>
        </View>
        <View
          style={{
            height: 40,
            backgroundColor: "#ebebeb",
            marginHorizontal: 10,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Feather
            name="search"
            size={18}
            color="grey"
            style={{ marginLeft: 10 }}
          />
          <View style={{ marginLeft: 10 }}>
            <TextInput
              onChangeText={(text) => this.SearchFilterFunction(text)}
              value={this.state.text}
              placeholder="Search"
              placeholderTextColor="grey"
            />
          </View>
        </View>

        <FlatList
          data={this.state.data}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Chat", {
                  chatUNIQUEID: this.state.data[index].ID,
                  uid: item.uid,
                  pPic: item.profilePic,
                });
              }}
              style={styles.chatBgc}
            >
              <View
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,

                  marginLeft: 10,
                }}
              >
                <Image
                  source={{ uri: item.profilePic }}
                  style={{
                    height: null,
                    width: null,
                    flex: 1,
                    borderRadius: 30,
                  }}
                />
              </View>
              <View style={{ marginLeft: 10, flex: 1, flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                  <Text style={{ marginTop: 4, color: "grey" }}>
                    {item.LastMessage === undefined
                      ? `Say hi to ${item.name}`
                      : item.LastMessage.lastMessage.text}{" "}
                    .
                    <Text>
                      {" "}
                      {item.LastMessage === undefined ? (
                        ` `
                      ) : (
                        <TimeAgo
                          time={item.LastMessage.lastMessage.createdAt}
                        />
                      )}
                    </Text>
                    {/* {item.LastMessage.lastMessage.text} . <TimeAgo time={item.LastMessage.lastMessage.createdAt} /> */}
                  </Text>
                </View>
                <View>
                  <Text style={{ marginRight: 10 }}>
                    <Feather name="chevron-right" size={30} color="#000" />{" "}
                    {/* {item.LastMessage.lastMessage.createdAt} */}
                    {/* <TimeAgo time={item.LastMessage.lastMessage.createdAt} /> */}
                  </Text>
                </View>

                {/* <Text>       <TimeAgo time={item.LastMessage.lastMessage.createdAt} /></Text> */}
              </View>

              {/* <Text>{this.state.data[index].ID}</Text> */}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.name}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height: 80,

    justifyContent: "center",
    alignItems: "center",
  },
  headerHeadingText: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#000",
  },
  chatBgc: {
    height: 80,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 5,

    flex: 1,

    flexDirection: "row",
    alignItems: "center",
  },
});
