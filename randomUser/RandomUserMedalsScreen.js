import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import * as firebase from "firebase";
import DropdownAlert from "react-native-dropdownalert";

export default class ImageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      userImage: "",
      isLoading: true,
    };
  }

  showAlert = (number) => {
    this.dropDownAlertRef.alertWithType(
      "warn",
      `Badge is locked.`
    );
  };

  getUserInfo = async (key) => {
    
    self = this;
    const user = firebase.auth().currentUser;
    let fireRef = await firebase
      .database()
      .ref("users/" + key + "/UserInfo")
      .on("value", (datasnpShot) => {
        if (datasnpShot.val()) {
          let name = datasnpShot.val().name;
          let numberOfpostes = datasnpShot.val().numberOfPostes;
          let userImage = datasnpShot.val().profileUrl;
          self.setState({
            name,
            userImage,
            isLoading: false,
            numberOfpostes,
          });
        }
      });
  };

  UNSAFE_componentWillMount() {
    let key = this.props.uid
 
     this.getUserInfo(key);
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
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 0.8,
            backgroundColor: "#6200EE",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DropdownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
          <Image
            source={{
              uri:
                "https://image.freepik.com/free-vector/employee-month-concept-golden-medal_23-2148464181.jpg",
            }}
            style={{ height: 140, width: 180, borderRadius: 5 }}
          />
        </View>

        <View style={{ flex: 2, backgroundColor: "#ebebeb" }}>
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
              marginTop: -10,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
          >
            <View style={{ flex: 0.6 }}>
              <View
                style={{
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomColor: "grey",
                  borderBottomWidth: 0.5,
                }}
              >
                <Text
                  style={{ fontWeight: "bold", color: "grey", fontSize: 20 }}
                >
                  NUMBER OF POSTES
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#006400", fontSize: 30 }}>
                  {this.state.numberOfpostes === 5
                    ? this.state.numberOfpostes - 1
                    : this.state.numberOfpostes}
                </Text>
              </View>
            </View>

            <View style={{ flex: 2 }}>
              <View
                style={{
                  height: 50,
                  paddingLeft: 10,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", color: "grey" }}
                >
                  Badges earned
                </Text>
              </View>

              <View style={{ flex: 1, padding: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                  }}
                >
                  {this.state.numberOfpostes >= 5 ? (
                    <View style={{ height: 120, width: 120 }}>
                      <Image
                        source={require("../Home/Medals/BadgeImages/b1.jpeg")}
                        style={styles.badgeImages}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        this.showAlert(5);
                      }}
                      style={{ height: 120, width: 120 }}
                    >
                      <Image
                        source={require("../Home/Medals/BadgeImages/b1L.jpg")}
                        style={styles.badgeImages}
                      />
                      <View
                        style={{
                          flex: 1,
                          borderRadius: 60,
                          backgroundColor: "rgba(0,0,0,0.8)",
                          position: "absolute",
                          zIndex: 100,
                          top: 0,
                          left: 0,
                        }}
                      ></View>
                    </TouchableOpacity>
                  )}
                  {this.state.numberOfpostes >= 59 ? (
                    <View style={{ height: 120, width: 120 }}>
                      <Image
                        source={require("../Home/Medals/BadgeImages/b2.jpeg")}
                        style={styles.badgeImages}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        this.showAlert(59);
                      }}
                      style={{ height: 120, width: 120 }}
                    >
                      <Image
                        source={require("../Home/Medals/BadgeImages/b2L.jpg")}
                        style={styles.badgeImages}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginTop: 30,
                  }}
                >
                  {this.state.numberOfpostes >= 199 ? (
                    <View style={{ height: 120, width: 120 }}>
                      <Image
                        source={require("../Home/Medals/BadgeImages/b3.jpeg")}
                        style={styles.badgeImages}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        this.showAlert(199);
                      }}
                      style={{ height: 120, width: 120 }}
                    >
                      <Image
                        source={require("../Home/Medals/BadgeImages/b3L.jpg")}
                        style={styles.badgeImages}
                      />
                    </TouchableOpacity>
                  )}
                  {this.state.numberOfpostes >= 449 ? (
                    <View style={{ height: 120, width: 120 }}>
                      <Image
                        source={require("../Home/Medals/BadgeImages/b4.jpeg")}
                        style={styles.badgeImages}
                      />
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        this.showAlert(450);
                      }}
                      style={{ height: 120, width: 120 }}
                    >
                      <Image
                        source={require("../Home/Medals/BadgeImages/b4L.jpg")}
                        style={styles.badgeImages}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  badgeImages: {
    height: null,
    width: null,
    flex: 1,
    borderRadius: 60,
    zIndex: 1,
  },
});
