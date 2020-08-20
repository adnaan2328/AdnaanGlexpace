import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import * as firebase from "firebase";
import { withNavigation } from "react-navigation";

class LoadingScreen extends Component {

    constructor(props){
        super(props)
        this.setState({
            isBlocked:null
        })
    }
  componentDidMount() {
    firebase.auth().onAuthStateChanged((authenticate) => {
      if (authenticate) {
        this.props.navigation.navigate("Dashboard");
      } else {
        this.props.navigation.navigate("Welcome");
      }
    });
  }

  // componentDidMount (){
  //     let user = firebase.auth().currentUser ;
  //     let self = this ;
  //        let userRef = firebase
  //          .database()
  //      .ref(`/users/${user.uid}/UserInfo`)
  //      .on("value",(datasnpaShot)=>{
  //       let isBlocked = datasnapShot.val()?.isBlocked;
  //       self.setState({
  //         isBlocked
  //       })

  //      })


  //      if(this.state.isBlocked){
  //        Alert.alert("You are blocked by admin")
  //       this.props.navigation.navigate("Welcome");

  //      } else {
  //       this.props.navigation.navigate("Welcome");
  //      }
                                               
      


  // }


//   componentDidMount() {
//     let self = this;
//     firebase.auth().onAuthStateChanged((authenticate) => {
//       if (authenticate) {
//         console.log("adnaan");

//         let userRef = firebase
//           .database()
//           .ref(`/users/${authenticate.uid}/UserInfo`)
//           .on("value", (datasnapShot) => {
//             if (datasnapShot.val()) {
//               let isBlocked = datasnapShot.val()?.isBlocked;
//               if (isBlocked === true) {
//                 firebase.auth().signOut();
//                 Alert.alert("You are blocked by admin.");

//                 self.props.navigation.navigate("Welcome");
//               } else {
//                 self.props.navigation.navigate("Dashboard");
//               }
//             }
//           });

//         //  this.props.navigation.navigate("Dashboard")
//       }
//     });
//   }

  render() {
    return (
      <View style={styles.activityStyle}>
        <ActivityIndicator size="large" color="#3d3d3d" />
      </View>
    );
  }
}

export default withNavigation(LoadingScreen);

const styles = StyleSheet.create({
  activityStyle: { flex: 1, justifyContent: "center", alignItems: "center" },
});
