import React, { Component } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import * as firebase from "firebase";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { withNavigation } from 'react-navigation';

class ExploreStoriesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      isDataMoreFetched: false,
      referesh:true
    };
    this.arrayholder = [];
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

  getAllFeatures = ()=>{
    let self= this ;
    let fireRef = firebase.database().ref("/MISCELLANEOUS/")
    .on("value",(datasnapShot)=>{
      if(datasnapShot.val()){
    
        let featuresKey = Object.keys(datasnapShot.val());
        let featuresObject = Object.values(datasnapShot.val());
        featuresKey.forEach((values, item) => {
          featuresObject[item]["key"] = values;
         
        });
        self.setState({
          
          data:featuresObject,
          isLoading:false
        })

      }

    })
  }

  UNSAFE_componentWillMount() {
    this.getAllFeatures();
    // this.getAllPost();
  }

  loadMorePosts = () => {
    
    
    this.setState({
      isDataMoreFetched: true,
    });

      let postRef = firebase
        .database()
        .ref("allPosts")
        .limitToLast(this.state.data.length + 5);
      let self = this;
      postRef.once("value", (datasnapShot) => {
        if (datasnapShot.val()) {
          let postKey = Object.keys(datasnapShot.val());
          let postObject = Object.values(datasnapShot.val());
          postKey.forEach((values, item) => {
            postObject[item]["key"] = values;
            postObject[item]["isSelect"] = false;
          });
          let newArraySearch = [...this.state.data,postObject]
          self.setState({
            data: postObject,
            getAllPost: false,
            isDataMoreFetched: false,
            referesh:false
          },function () {
            this.arrayholder = newArraySearch
          });
        }
      });
   
  };

  SearchFilterFunction = (text) => {

    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.storyHeading
        ? item.storyHeading.toUpperCase()
        : "".toUpperCase();
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


  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 150; // how far from the bottom
  
    return layoutMeasurement.height + contentOffset.y >= 
    contentSize.height - paddingToBottom;
  };



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
      <View style={{ flex: 1, paddingTop: 0 }}>
        <LinearGradient
          style={styles.gradient}
          // Button Linear Gradient
          colors={["#6200EE", "#9921E8"]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
            onPress={()=>{
              this.props.navigation.navigate("ExploreAllStories")
            }}
            style={styles.inputContainer}>
              <Text>
                Search
              </Text>
           
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("ChatHome");
              }}
              style={{ marginLeft: 10 }}
            >
              <Feather name="message-square" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={{ flex: 1 }}>
          <FlatList 
          data={this.state.data}
          renderItem={({item})=>(
            <TouchableOpacity 
            onPress={()=>{
              this.props.navigation.navigate("FeaturesStoriesScr",{name:item.name})
            }}
             
              style={styles.storiesContainer}>
             
                <View
                  style={{ marginLeft: 15, justifyContent: "space-evenly" }}
                >
                  <Text style={{ fontSize: 20,color:"#00bfff" }}>{item.name}</Text>
          
                </View>
              </TouchableOpacity>


          )}
          
          
          />

         

          {/* <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <TouchableOpacity 
              onPress={()=>{
                this.props.navigation.navigate("PostInExplore", {
                  key: item.key,
                  numberOfViews: item.views,
                  likes:item.likes
                })
              }}
              style={styles.storiesContainer}>
             
                <View
                  style={{ marginLeft: 15, justifyContent: "space-evenly" }}
                >
                  <Text style={{ fontSize: 20,color:"#00bfff" }}>{item.storyHeading}</Text>
                  <Text style={{ color: "#000" }}>{item.story}</Text>
                </View>
              </TouchableOpacity>
            )}
         

          /> */}
        </View>
      </View>
    );
  }
}


export default withNavigation(ExploreStoriesScreen);

const styles = StyleSheet.create({
  storiesContainer: {
    height: 60,
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
