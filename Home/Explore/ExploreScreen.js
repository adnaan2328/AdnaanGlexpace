import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  TextInput,
} from "react-native";
import {
  Container,
  Header,
  Tab,
  Tabs,
  ScrollableTab,
  Image,
} from "native-base";

const SCREEN_WIDTH = Dimensions.get("window").width;
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import ExploreStoriesScreen from "./ExploreStoriesScreen";
import ExploreProfileScreen from "./ExploreProfileScreen";


export default class ExploreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Tabs
            tabBarUnderlineStyle={{
              backgroundColor: "#6200EE",
              height: 1,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}
            renderTabBar={() => <ScrollableTab />}
          >
            <Tab
              activeTabStyle={{
                backgroundColor: "#fff",
                width: SCREEN_WIDTH / 3,
              }}
              activeTextStyle={{ color: "#000" }}
              tabStyle={{ backgroundColor: "#fff", width: SCREEN_WIDTH / 3 }}
              textStyle={{ color: "#000" }}
              heading="STORIES"
            >
              <ExploreStoriesScreen />
            </Tab>
            <Tab
              activeTabStyle={{
                backgroundColor: "#fff",
                width: SCREEN_WIDTH / 3,
              }}
              activeTextStyle={{ color: "#000" }}
              tabStyle={{ backgroundColor: "#fff", width: SCREEN_WIDTH / 3 }}
              textStyle={{ color: "#000" }}
              heading="PROFILE"
            >

<ExploreProfileScreen  />
            </Tab>
            <Tab
              activeTabStyle={{
                backgroundColor: "#fff",
                width: SCREEN_WIDTH / 3,
              }}
              activeTextStyle={{ color: "#000" }}
              tabStyle={{ backgroundColor: "#fff", width: SCREEN_WIDTH / 3 }}
              textStyle={{ color: "#000" }}
              heading="TACTILE"
            >




            </Tab>
          </Tabs>
        </View>
      </View>
    );
  }
}
