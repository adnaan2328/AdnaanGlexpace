import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,

} from "react-native";
import * as firebase from "firebase"
// import { Constants } from 'expo';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 100,
    };
  }


  onLogout = ()=>{

      firebase.auth().signOut()
    .then(()=>{
        this.props.navigation.navigate("Welcome")
    })
    .catch((err)=>{
        alert(err)
    })

  }

  render() {
    let screenHeight = Dimensions.get("window").height;

    return (
      <View style={styles.root}>
        <View style={{ height: screenHeight }}>
          <ScrollView style={{ paddingTop: 10 }}>
            <TouchableOpacity
        
            
            style={styles.box}>
              <View style={{ height: 40, width: 40, marginLeft: 10 }}>
                <Image
                  source={require("./images/gallery.png")}
                  style={{ height: null, width: null, flex: 1 }}
                />
              </View>
              <View style={{ marginLeft: 40 }}>
                <Text>Gallery</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.box}>
              <View style={{ height: 40, width: 40, marginLeft: 10 }}>
                <Image
                  source={require("./images/communities.png")}
                  style={{ height: null, width: null, flex: 1 }}
                />
              </View>
              <View style={{ marginLeft: 40 }}>
                <Text>Communities</Text>
              </View>
            </View>


            <View style={styles.box}>
              <View style={{ height: 40, width: 40, marginLeft: 10 }}>
                <Image
                  source={require("./images/market.png")}
                  style={{ height: null, width: null, flex: 1 }}
                />
              </View>
              <View style={{ marginLeft: 40 }}>
                <Text>Market</Text>
              </View>
            </View>

            <View style={styles.box}>
              <View style={{ height: 40, width: 40, marginLeft: 10 }}>
                <Image
                  source={require("./images/nearby.png")}
                  style={{ height: null, width: null, flex: 1 }}
                />
              </View>
              <View style={{ marginLeft: 40 }}>
                <Text>People Nearby</Text>
              </View>
            </View>

            <View style={styles.box}>
              <View style={{ height: 40, width: 40, marginLeft: 10 }}>
                <Image
                  source={require("./images/fav.png")}
                  style={{ height: null, width: null, flex: 1 }}
                />
              </View>
              <View style={{ marginLeft: 40 }}>
                <Text>Favorities</Text>
              </View>
            </View>

            <View style={styles.box}>
              <View style={{ height: 40, width: 40, marginLeft: 10 }}>
                <Image
                  source={require("./images/video.png")}
                  style={{ height: null, width: null, flex: 1 }}
                />
              </View>
              <View style={{ marginLeft: 40 }}>
                <Text>Stream</Text>
              </View>
            </View>

            <View style={styles.box}>
              <View style={{ height: 40, width: 40, marginLeft: 10 }}>
                <Image
                  source={require("./images/popular.png")}
                  style={{ height: null, width: null, flex: 1 }}
                />
              </View>
              <View style={{ marginLeft: 40 }}>
                <Text>Popular</Text>
              </View>
            </View>

            <View style={styles.box}>
              <View style={{ height: 40, width: 40, marginLeft: 10 }}>
                <Image
                  source={require("./images/upgrades.png")}
                  style={{ height: null, width: null, flex: 1 }}
                />
              </View>
              <View style={{ marginLeft: 40 }}>
                <Text>Upgrades</Text>
              </View>
            </View>

           <TouchableOpacity
           onPress={()=>{
               this.onLogout()
           }}
           
           >
           <View style={styles.box}>
              <View style={{ height: 40, width: 40, marginLeft: 10 }}>
                <Image
                  source={require("./images/logout.png")}
                  style={{ height: null, width: null, flex: 1 }}
                />
              </View>
              <View style={{ marginLeft: 40 }}>
                <Text>Logout</Text>
              </View>
            </View>
           </TouchableOpacity>



          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ebebeb",
  },
  box: {
    height: 60,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginHorizontal: 10,
    borderRadius: 5,

    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
