import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  TextInput,
  CheckBox,
  Pressable,
  Image,
  ToastAndroid
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from "firebase";
import {Feather} from "@expo/vector-icons"

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
     
    };
  }

  signIn = (email) => {
   firebase.auth().sendPasswordResetEmail(email)
   .then((()=>{
       this._toastWithDurationGravityHandler()
   }))
   .catch(()=>{
       this._failedToSendEmail()


   })
  };

  _toastWithDurationGravityHandler=()=>{
    //function to make Toast With Duration And Gravity
   ToastAndroid.showWithGravity(
      "Password reset email send successfully.",
      ToastAndroid.SHORT, //can be SHORT, LONG
      ToastAndroid.CENTER //can be TOP, BOTTON, CENTER
    );
  }

  _failedToSendEmail=()=>{
    //function to make Toast With Duration And Gravity
   ToastAndroid.showWithGravity(
      "Network error try agian later.",
      ToastAndroid.SHORT, //can be SHORT, LONG
      ToastAndroid.CENTER //can be TOP, BOTTON, CENTER
    );
  }

  render() {
    return (
      <View style={{ flex: 1}}>

        <View style={{flex:1.5,backgroundColor:"#4537cd",borderBottomRightRadius:50,borderBottomLeftRadius:50,alignItems:"center"}} >
          <Image source={require("./images/gplogo.png")}  style={{height:200,width:200,marginTop:20}}  />


        </View>
        <View style={{flex:2,justifyContent:"center",alignItems:"center"}} >
        <View
          style={{
            height: 400,
            backgroundColor: "#fff",
            width: Dimensions.get("window").width - 50,
            borderRadius:30,marginTop:-250,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 100,
          }}
        >
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              {" "}
              FORGET PASSWORD ?
            </Text>
          </View>
          <View style={{ flex: 1, paddingRight: 25, paddingLeft: 30 }}>
            <View
              style={{
                flexDirection: "row",

                alignItems: "center",
                marginTop: 20,
                borderBottomWidth: 0.4,
                borderBottomColor: "grey",
                paddingBottom: 10,
                borderStyle: "dotted",
              }}
            >
              <View>
                <Feather name="mail" size={22} color="grey" />
              </View>
              <View style={{ marginLeft: 40 }}>
                <TextInput
         
                  onChangeText={(email) => {
                    this.setState({
                      email,
                    });
                  }}
                  placeholder="Enter email"
                  style={{ fontSize: 15 }}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <View>
                  <CheckBox />
                </View> */}
                <View>
                  {/* <Text style={{ color: "grey", fontWeight: "bold" }}>
                    Show Password
                  </Text> */}
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <View>
                  <CheckBox />
                </View> */}
                {/* <View>
                  <Text style={{ color: "grey", fontWeight: "bold" }}>
                    Remember Me
                  </Text>
                </View> */}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.signIn(this.state.email, this.state.password);
              }}
              style={{
                height: 45,
                width: 300,
                backgroundColor: "#4537cd",
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 22.5,
              }}
            >
              <Text style={{ fontSize: 15, letterSpacing: 1,color:"#fff" }}>SEND VERIFICATION EMAIL </Text>
            </TouchableOpacity>
            <View style={{ marginTop: 20, flexDirection: "row" }}>
              <Text>New to Glexspace ? </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Signup");
                }}
              >
                <Text style={{ color: "blue" }}>Register Here</Text>
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text>{"\u00A9"} Glexpace</Text>
            </View>
          </View>
        </View>
  

        </View>

        {/* <View>
          <Image source={require("./images/login.png")}  />

        </View> */}
      </View>
    );
  }
}
