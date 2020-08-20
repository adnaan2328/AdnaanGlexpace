import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Progress from "react-native-progress";
import * as firebase from "firebase";
import { withNavigation } from "react-navigation";
import { LinearGradient } from "expo-linear-gradient";
import {Feather } from "@expo/vector-icons"

class ShowUserStories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    // this.deleteStory()

    let self = this;
    let user = firebase.auth().currentUser;
    let userRef = firebase
      .database()
      .ref(`/users/${user.uid}/Stories`)

      .on("value", (datasnpShot) => {
        if (datasnpShot.val()) {
          let storiesKey = Object.keys(datasnpShot.val());
          let storiesObj = Object.values(datasnpShot.val());
          storiesKey.forEach((item, index) => {
            storiesObj[index]["key"] = item;
          });
          self.setState({
            data: storiesObj,
          });
        }
      });
  }

  deleteStory = (key) => {
    const user = firebase.auth().currentUser
     
     let storyRef = firebase.database().ref(`users/${user.uid}/Stories`);
     storyRef.child(key).remove() ;
     



     

  };

  _onRemove = (_item) => { 

    this.setState({ 
      data: this.state.data.filter(item => item.key !== _item.key) 
    });
 }

  render() {
    return (
      <FlatList
        horizontal
        data={this.state.data}
        renderItem={({ item }) => (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
          >
            <LinearGradient
              // Button Linear Gradient
              colors={["#fd1d1d", "#C13584", "#833ab4"]}
              style={{
                height: 52,
                width: 52,
                borderRadius: 26,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("ShowStImage", {
                    imageSource: item.storyImage,
                  });
                }}
                style={[styles.addStoryButton]}
              >
                <TouchableOpacity
                  onPress={()=>{
                    this.deleteStory(item.key)
                    this._onRemove(item);
                  }}
                  style={{
                    height: 15,
                    width: 15,
                    borderRadius: 7.5,
                    backgroundColor: "red",
                    position: "absolute",
                    zIndex: 1000,
                    elevation: 1000,
                    right:0,
                    justifyContent:"center",
                    alignItems:"center"
                  }}
                > 
                <Feather name="x" color="#fff" size={10} />



                </TouchableOpacity>
                <Image
                  source={{ uri: item.Image }}
                  style={{
                    flex: 1,
                    height: null,
                    width: null,
                    borderRadius: 30,
                  }}
                />
              </TouchableOpacity>
            </LinearGradient>
            {/**/}
            <Text>{item.name}</Text>
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  addStoryButton: {
    height: 50,
    width: 50,

    borderRadius: 25,
    borderRadius: 30,
  },
});

export default withNavigation(ShowUserStories);
