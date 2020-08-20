import React from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import * as firebase from "firebase";

export default class AddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfNotifications: [],
    };
  }

  componentDidMount() {
    this.getNotificationsNumber();
  }

  getNotificationsNumber = () => {
    const user = firebase.auth().currentUser;
    let self = this;
    let notfyRef = firebase.database().ref(`users/${user.uid}/notifications`);
    notfyRef.on("value", (datasnapShot) => {
      if (datasnapShot.val()) {
        let notfyKeys = Object.keys(datasnapShot.val());
        self.setState({
          numberOfNotifications: notfyKeys.length,
        });
      }
    });
  };

  render() {
    return (
      <View
        style={{ position: "absolute", alignItems: "center", zIndex: 1000 }}
      >
        {this.state.numberOfNotifications > 0 && (
          <View style={styles.notificationDot}></View>
        )}

        <View style={styles.button}>
          <TouchableHighlight underlayColor="#7F58FF">
            <View>
              <FontAwesome name="bell" size={22} color={this.props.color} />
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 45,
    height: 45,
    borderRadius: 25,
    position: "absolute",
    top: -22,
    shadowRadius: 5,
    shadowOffset: {
      height: 10,
    },
    shadowOpacity: 0.3,
    borderWidth: 3,
    borderColor: "#fff",
  },
  notificationDot: {
    position: "absolute",
    height: 10,
    width: 10,
    backgroundColor: "red",
    zIndex: 1000,
    bottom: 0,
    left: 0,
    borderRadius: 5,
  },
});
