import React, { Component } from "react";
import { Text, View, Alert, SafeAreaView, Image } from "react-native";
import Carousel from "react-native-snap-carousel";
import {Feather} from "@expo/vector-icons"
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";

const NUMBER = 449;

export default class BadgesWinScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      carouselItems: [
        {
          locked: require("./BadgeImages/b1L.jpg"),
          unLocked: require("./BadgeImages/b1.jpeg"),
          unLockedText: "You have won",
        },
        {
          locked: require("./BadgeImages/b2L.jpg"),
          unLocked: require("./BadgeImages/b2.jpeg"),
          unLockedText: "You have won",
          lockedText: "Post 59 stories to unlock",
        },
        {
          locked: require("./BadgeImages/b3L.jpg"),
          unLocked: require("./BadgeImages/b3.jpeg"),
          unLockedText: "You have won",
          lockedText: "Post 199 stories to unlock",
        },
        {
          locked: require("./BadgeImages/b4L.jpg"),
          unLocked: require("./BadgeImages/b4.jpeg"),
          unLockedText: "You have won",
          lockedText: "Post 450 stories to unlock",
        },
      ],
    };
  }

  componentDidMount() {
    let number = this.props.number;
    this.setState({
      number,
    });
    console.log(number);
  }

  _renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          backgroundColor: "floralwhite",
          borderRadius: 5,
          height: 250,

          marginLeft: 25,
          marginRight: 25,
          paddingHorizontal: 20,
        }}
      >

          
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            color: "grey",
            fontWeight: "bold",
            marginBottom: 5,
          }}
        >
          {(this.state.number < 6 &&
            ((this.state.number === 5 && index === 0 && item.unLockedText) ||
              item.lockedText)) ||
            (this.state.number < 60 &&
              ((this.state.number === 59 &&
                (index === 0 || index === 1) &&
                item.unLockedText) ||
                item.lockedText)) ||
            (this.state.number < 200 &&
              ((this.state.number === 199 &&
                (index === 0 || index === 1 || index === 2) &&
                item.unLockedText) ||
                item.lockedText)) ||
            (NUMBER < 450 &&
              ((NUMBER === 449 &&
                (index === 0 || index === 1 || index === 2 || index === 3) &&
                item.unLockedText) ||
                item.lockedText))}
        </Text>

        <Image
          source={
            (this.state.number < 6 &&
              ((this.state.number === 5 && index === 0 && item.unLocked) ||
                item.locked)) ||
            (this.state.number < 60 &&
              ((this.state.number === 59 &&
                (index === 0 || index === 1) &&
                item.unLocked) ||
                item.locked)) ||
            (this.state.number < 200 &&
              ((this.state.number === 199 &&
                (index === 0 || index === 1 || index === 2) &&
                item.unLocked) ||
                item.locked)) ||
            (NUMBER < 450 &&
              ((NUMBER === 449 &&
                (index === 0 || index === 1 || index === 2 || index === 3) &&
                item.unLocked) ||
                item.locked))
          }
          style={{ height: null, width: null, flex: 1 }}
        />
      </View>
    );
  };

  render() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 100000,
          elevation: 1000,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
           <TouchableOpacity
           style={{paddingTop:50}}
           onPress={()=>{
               this.props.disableBADGESCREEN()
           }}
           
           >
            <Feather name="x" size={30} color="#fff" />
           </TouchableOpacity>
   
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
           
            {/* <View>
              <Feather name="x" size={30} color="#000" ></Feather>
          </View> */}
          <Carousel
            layout={"default"}
            ref={(ref) => (this.carousel = ref)}
            data={this.state.carouselItems}
            sliderWidth={300}
            itemWidth={300}
            renderItem={this._renderItem}
            onSnapToItem={(index) => this.setState({ activeIndex: index })}
          />
        </View>
      </View>
    );
  }
}
