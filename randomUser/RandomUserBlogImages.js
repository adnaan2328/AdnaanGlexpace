import React, { Component } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import * as firebase from "firebase";

import * as ImagePicker from "expo-image-picker";

export default class UserBlogImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: [],
      pImage: "empty",
      isUploading: false,
    };
  }

  componentDidMount() {
    let self = this;
    let user = firebase.auth().currentUser;
    let uid = this.props.uid
    let userRef = firebase
      .database()
      .ref(`users/${uid}/blogImages`)
      .on("value", (datasnapShot) => {
        if (datasnapShot.val()) {
          let blogImagesKeys = Object.keys(datasnapShot.val());
          let blogImagesObj = Object.values(datasnapShot.val());
          blogImagesKeys.forEach((value, key) => {
            blogImagesObj[key]["key"] = value;
          });
          self.setState({
            data: blogImagesObj,
            isLoading: false,
          });
        }
      });
      this.setState({
          isLoading:false
      })
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.2,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.cancelled) {
      this.setState({
        pImage: result.uri,
      });
    }
  };



 
  render() {
    if (this.state.isLoading) {
      return (
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}} >
              <ActivityIndicator size="large" color="grey" />
          </View>
      )
    }
    return (
      <View style={{ flex: 1, paddingTop: 5 }}>
        {this.state.pImage !== "empty" && (
          <View
            style={{
              position: "absolute",
              top: 220,
              bottom: 0,
              left: 10,
              right: 10,

              zIndex: 1000,

              alignItems: "center",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <View style={{ height: 200, width: "100%" }}>
              <Image
                source={{ uri: this.state.pImage }}
                style={{ flex: 1, height: null, width: null }}
              />
            </View>
          </View>
        )}

        {this.state.isUploading && (
          <View
            style={{
              position: "absolute",
              top: 220,
              bottom: 0,
              left: 10,
              right: 10,

              zIndex: 1000,

              alignItems: "center",
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <View
              style={{
                height: 200,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="grey" />
            </View>
          </View>
        )}

      
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 22 }}>Photos</Text>
        </View>
        
        <FlatList
          numColumns={3}
          data={this.state.data}
          renderItem={({ item }) => (
            <View style={{ marginLeft: 10, marginBottom: 10 }}>
              <View style={{ height: 130, width: 100 }}>
                <Image
                  source={{ uri: item.blogImages }}
                  style={{ flex: 1, height: null, width: null }}
                />
              </View>
            </View>
          )}
        />
      </View>
    );
  }
}
