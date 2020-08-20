import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { createDrawerNavigator, DrawerItems } from "react-navigation-drawer";

import {
  createStackNavigator,
  TransitionSpecs,
  CardStyleInterpolators,
  TransitionPresets,
} from "react-navigation-stack";
import HomeScreen from "./Home/HomeScreen";
import LoginScreen from "./Login/LoginScreen";
import UserLikesScreen from "./Login/UserLikesScreen";
import ProfileScreen from "./Home/ProfileScreen";
import SignupScreen from "./Login/SignupScreen";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";
import * as firebase from "firebase";
import UpdateProfileScreen from "./Home/UpdateProfileScreen";
import LoadingScreen from "./Login/LoadingScreen";

import PostdetailScreen from "./Home/Post/PostdetailScreen";
import CommentsScreen from "./Home/Post/CommentsScreen";
import ImageScreen from "./Home/ImageScreen";
import Chat from "./Home/MessageScreen";
import FollowingScreen from "./Home/FollowingScreen";
import ForgetPasswordScreen from "./Login/ForgetPasswordScreen";
import AddBlogButton from "./Component/AddBlogButton";
import { createBottomTabNavigator, createTabNavigator } from "react-navigation-tabs";
import AddBlogScreen from "./Home/AddBlog/AddBlogScreen";
import SettingsScreen from "./Home/Setting/SettingsScreen";
import ExploreScreen from "./Home/Explore/ExploreScreen";
import NotificationsScreen from "./Home/Notifications/NotificationsScreen";
import TactileScreen from "./Home/Tactile/TactileScreen";
import AddBlogScreen2 from "./Home/AddBlog/AddBlogScreen2";
import PostStoryScreen from "./Home/Stories/PostStoryScreen";
import ShowStoryImage from "./Home/Stories/ShowStoryImage";
import RandomUserProfileScreen from "./randomUser/RandomUserProfileScreen";
import RandomUserFollowingScreen from "./randomUser/RandomUserFollowingScreen";
import FollowerScreen from "./Home/FollowersScreen"
import ChatHomeScreen from "./Home/Chat/ChatHomeScreen";
import NotificationIcon from "./Home/Notifications/NotificationIcon";
import FeaturesStoriesScreen from "./Home/Explore/FeaturesStoriesScreen";
import ExploreAllStories from "./Home/Explore/ExploreAllStories";



var firebaseConfig = {
  apiKey: "AIzaSyAMgfH6RIYKJB0a-FlPIQuafKugBtAduZo",
  authDomain: "glexpace-cb1f4.firebaseapp.com",
  databaseURL: "https://glexpace-cb1f4.firebaseio.com",
  projectId: "glexpace-cb1f4",
  storageBucket: "glexpace-cb1f4.appspot.com",
  messagingSenderId: "571297492872",
  appId: "1:571297492872:web:adc65b9252eab76bd7543d",
  measurementId: "G-JBEXRPBDP4",
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

//Welcome screen

// DashboardScreen

const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const RandomUserProfileStack = createStackNavigator(
  {
    RandomUserProfile: { screen: RandomUserProfileScreen },
    RandomUserFollowing: { screen: RandomUserFollowingScreen },
  },
  {
    defaultNavigationOptions: () => {
      return {
        headerShown: false,
      };
    },
  }
);
const ExploreScreenStack =  createStackNavigator(  {
  Explore:ExploreScreen,
  ChatHome:ChatHomeScreen,
  FeaturesStoriesScr:FeaturesStoriesScreen,
  PostInExplore:PostdetailScreen,
  RandomUserInExplore: RandomUserProfileStack,
  ExploreAllStories:ExploreAllStories


},
{
  defaultNavigationOptions: () => {
    return {
      headerShown: false,
    };
  },
})


const HomeScreenStack = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    PostDetail: PostdetailScreen,
    PostComment: CommentsScreen,
    ImageScreen: ImageScreen,
    Chat: Chat,
    PostStory: PostStoryScreen,
    ShowStImage: ShowStoryImage,
    RandomUser: RandomUserProfileStack,
    ChatInHome:ChatHomeScreen,
    Explore:ExploreScreenStack
  },
  {
    defaultNavigationOptions: () => {
      return {
        headerShown: false,
        // transitionSpec: {
        //   open: config,
        //   close: config,
        // },
        gestureEnabled: true,
        gestureDirection: "horizontal",

        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      };
    },
  }
);

const ProfileStack = createStackNavigator(
  {
    Profile: { screen: ProfileScreen },
    UpdateProfile: { screen: UpdateProfileScreen },
    ImageScreen: { screen: ImageScreen },
    FollowingScreen: { screen: FollowingScreen },
    FollowerScreen:{screen:FollowerScreen}
  },
  {
    defaultNavigationOptions: () => {
      return {
        headerShown: false,
      };
    },
  }
);

const AddBlogStack = createStackNavigator(
  {
    AddBlog: AddBlogScreen,
    AddBlog2: AddBlogScreen2,
  },
  {
    defaultNavigationOptions: () => {
      return {
        headerShown: false,
      };
    },
  }
);


// Tab navigator
const DashboardTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreenStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={25} color={tintColor} />
        ),
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="user" size={25} color={tintColor} />
        ),
      },
    },
  
    Blog: {
      screen: AddBlogStack,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <AddBlogButton />,
      },
    },
    // ChatHome: {
    //   screen: ChatHomeScreen,
    //   navigationOptions: {
    //     tabBarIcon: ({ tintColor }) => (
    //       <Icon name="send" size={25} color={tintColor} />
    //     ),
    //   },
    // },
    Notification: {
      screen: NotificationsScreen,
     
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => <NotificationIcon color={tintColor} />,
      },
  
    },
    
    Settings: {
      screen: SettingsScreen,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => (
          <Icon name="cog" size={25} color={tintColor} />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: false,
      activeTintColor: "#6200EE",
    },
  }
);

const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator,
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerShown: false,
      };
    },
  }
);

HomeScreenStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible,
  };
};

//Drawer Navigator
const AppDrawerNavigator = createDrawerNavigator({
  Dashboard: {
    screen: DashboardStackNavigator,
  },
});

// Login stack
const LoginStack = createStackNavigator(
  {
    Welcome: { screen: LoginScreen },
    Signup: { screen: SignupScreen },
    Forget: { screen: ForgetPasswordScreen },
  },
  {
    defaultNavigationOptions: () => {
      return {
        headerShown: false,
      };
    },
  }
);

// Switch Navigator
const AppSwitchNavigator = createSwitchNavigator({
  Loading: { screen: LoadingScreen },
  LoginStack: { screen: LoginStack },
  UserLikes: { screen: UserLikesScreen },
  Dashboard: { screen: AppDrawerNavigator },
});

const AppContainer = createAppContainer(AppSwitchNavigator);
