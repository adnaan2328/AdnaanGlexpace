import React, { Component } from "react";
import { Text, View, Image, Alert, StyleSheet, Dimensions } from "react-native";
import { ProgressBar } from "react-native-paper";
import FitImage from "react-native-fit-image";

export default class ShowStoryImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0.0,
    };
  }

  countDown = () => {
    let self = this;

    var downloadTimer = setInterval(function () {
      if (self.state.number <= 1) {
       
        self.setState({
          number: self.state.number + 0.1,
        });
      }
    
    }, 1000);

    setInterval(()=>{
        if (self.state.number === 0.9999999999999999){
           this.props.navigation.goBack()
      
          }
    },1000)


   
  
  };
  componentDidMount(){
      this.countDown()
  }

 
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <ProgressBar progress={this.state.number} color="#ff4500" />
        <View style={{ flex: 1}}>
          <Image
     
            source={{
              uri: this.props.navigation.getParam("imageSource"),
            }}
            style={{height:Dimensions.get("window").height,resizeMode:"contain",flex:1,height:null,width:null}}
        
          />
        </View>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
    fitImage:{
        borderRadius:20
    }
})
