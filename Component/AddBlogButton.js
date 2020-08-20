import React from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";

export default class AddButton extends React.Component {
  render() {
    return (
      <View
        style={{ position: "absolute", alignItems: "center", zIndex: 1000 }}
      >
        <View style={styles.button}>
          <TouchableHighlight underlayColor="#7F58FF">
            <View>
              <Feather name="plus" size={22} color="#fff" />
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6200EE",
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
});
