import React, { Component } from "react";
import {
  Text,
  View,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import * as firebase from "firebase";

export default class FeaturesStoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  getAllPost = () => {
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
        self.setState(
          {
            data: postObject,
            isLoading: false,
          },
          function () {
            this.arrayholder = postObject;
          }
        );
      }
    });
  };

  componentDidMount() {
    this.getAllPost();
    // Alert.alert(this.props.navigation.getParam("name"));
  }
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
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => {
              if(item.miscellaneous === this.props.navigation.getParam("name")  ){
                  return (
                    <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("PostInExplore", {
                        key: item.key,
                        numberOfViews: item.views,
                        likes: item.likes,
                        rUserUid: item.userUid,
                      });
                    }}
                    style={styles.storiesContainer}
                  >
                    <View style={{ marginLeft: 15, justifyContent: "space-evenly" }}>
                      <Text style={{ fontSize: 20, color: "#00bfff" }}>
                        {item.storyHeading}
                      </Text>
                      <Text style={{ color: "#000" }}>{item.story}</Text>
                    </View>
                  </TouchableOpacity>
                  )
              }
          }}
        />
      </View>
    );
  }
}

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
