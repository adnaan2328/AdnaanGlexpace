import React, { Component } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import { SimpleLineIcons, Feather, Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import { Overlay } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as firebase from "firebase";
import FitImage from "react-native-fit-image";
import { ProgressBar } from "react-native-paper";
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from "react-native-material-textfield";
import TimeAgo from "react-native-timeago";

export default class AddBlogScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postImage: "",
    };
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
        postImage: result.uri,
      });
    }
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ProgressBar progress={0.5} color="#6200EE" />
        <View style={{ flex: 1 }}>
          <View style={{ marginTop: 10, marginLeft: 10 }}>
            <Feather name="x" color="#000" size={30} />
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View>
              <View style={{ height: 300, width: 350 ,marginBottom:10}}>
                {this.state.postImage === "" ? (
                  <Image
                    source={require("./images/gallery.png")}
                    style={{ height: null, width: null, flex: 1 }}
                  />
                ) : (
                  <Image source={{ uri: this.state.postImage }}
                  style={{ height: null, width: null, flex: 1 }} />
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.pickImage();
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      height: 60,
                      width: 60,
                      borderRadius: 30,
                      backgroundColor: "#fff",
                      justifyContent: "center",
                      alignItems: "center",
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
                    <View
                      style={{
                        height: 50,
                        width: 50,
                        borderRadius: 25,
                        backgroundColor: "#ff4500",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Feather name="plus" size={30} color="#fff" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
           
        
         
          </View>
          <View style={{height:100}} >
            <View style={{flex:1,flexDirection:"row",justifyContent:"space-evenly"}} >
            <View style={{height:50,width:140,backgroundColor:"#6200EE",borderRadius:40,
          justifyContent:"center",alignItems:"center"}} >
              <Text style={{fontSize:20,color:"#fff"}} >SKIP</Text>

            </View>

            <TouchableOpacity
            onPress={()=>{
              this.props.navigation.navigate("AddBlog2",{postImage:this.state.postImage})
            }}
            style={{height:50,width:140,backgroundColor:"#6200EE",borderRadius:40,
          justifyContent:"center",alignItems:"center"}} >
              <Text style={{fontSize:20,color:"#fff"}} >NEXT</Text>

            </TouchableOpacity>
            </View>

         

          </View>
        
        </View>
      </SafeAreaView>
    );
  }
}
