import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Overlay } from "react-native-elements";

import { TextInput } from "react-native-paper";

export default class UserLikesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      userLikes: [],
      pop: false,
      alternative: false,
      Soul: false,
      Gospel: false,
      Punk: false,
      Electronic: false,
      HipHop: false,
      Reggae: false,
      Jazz: false,
      Country: false,
      Instrument: false,
      HardRock: false,
      New: false,
      Flock: false,
      Acoustic: false,
      EDM: false,
    };
  }

  render() {
    return (
      <ImageBackground
        source={require("./images/UserLikes.jpg")}
        style={{ height: "100%", width: "100%" }}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)" }}>
          <View>
            <View
              style={{
                height: 180,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 24 }}>
                Selecet your most
              </Text>
              <Text style={{ color: "#fff", fontSize: 24 }}>
                favorite genres
              </Text>
              <Text style={{ color: "#fff", marginTop: 10 }}>
                You can change these later
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    pop: this._pop ? false : true,
                  });
                  this._pop = !this._pop;
                }}
                style={{
                  minHeight: 40,
                  minWidth: 80,
                  borderRadius: 20,
                  borderWidth: 3,
                  borderColor: "#3c3cc2",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  backgroundColor: this.state.pop ? "#3c3cc2" : "transparent",
                }}
              >
                <Text style={{ fontSize: 16, color: "#fff" }}>Pop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    alternative: this._alternative ? false : true,
                  });
                  this._alternative = !this._alternative;
                }}
                style={{
                  minHeight: 40,
                  minWidth: 80,
                  borderRadius: 20,
                  borderWidth: 3,
                  borderColor: "#3c3cc2",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  backgroundColor: this.state.alternative
                    ? "#3c3cc2"
                    : "transparent",
                }}
              >
                <Text style={{ fontSize: 16, color: "#fff" }}>Alternative</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    Soul: this._soul ? false : true,
                  });
                  this._soul = !this._soul;
                }}
                style={{
                  minHeight: 40,
                  minWidth: 80,
                  borderRadius: 20,
                  borderWidth: 3,
                  borderColor: "#3c3cc2",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  backgroundColor: this.state.Soul ? "#3c3cc2" : "transparent",
                }}
              >
                <Text style={{ fontSize: 16, color: "#fff" }}>Soul</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                marginTop: 10,
              }}
            >
              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>Gospel</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>Punk rock</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>
                    Electronic
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                marginTop: 10,
              }}
            >
              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>Hip-hop</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>Reggae</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>Jazz</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                marginTop: 10,
              }}
            >
              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>Country</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>
                    Instrument
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>Hard rock</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                marginTop: 10,
              }}
            >
              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>New wave</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>Folk</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>Acoustic</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-evenly",
                marginTop: 10,
              }}
            >
              <TouchableOpacity>
                <View
                  style={{
                    minHeight: 40,
                    minWidth: 80,
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#3c3cc2",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 15,
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#fff" }}>EDM</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>


          {/* {
            <Overlay
              isVisible={this.state.isVisible}
              onBackdropPress={() => this.setState({ isVisible: false })}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    height: 80,
                    justifyContent: "center",
                    marginLeft: 5,
                    borderBottomColor: "#000",
                    borderBottomWidth: 0.4,
                  }}
                >
                  <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                    Terms of services
                  </Text>
                </View>
                <View>
                  <Text>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum. It
                    is a long established fact that a reader will be distracted
                    by the readable content of a page when looking at its
                    layout. The point of using Lorem Ipsum is that it has a
                    more-or-less normal distribution of letters, as opposed to
                    using 'Content here, content here', making it look like
                    readable English.
                  </Text>
                </View>
              </View>
              <View style={{ height: 40 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("Dashboard");
                    }}
                  >
                    <View
                      style={{
                        height: 40,
                        width: 120,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 2,
                        borderColor: "#3c3cc2",
                        backgroundColor: "#3c3cc2",
                      }}
                    >
                      <Text style={{ fontSize: 18, color: "#fff" }}>
                        Accept
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: 40,
                      width: 120,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: "#3c3cc2",
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>Decline</Text>
                  </View>
                </View>
              </View>
            </Overlay>
          } */}



        </View>
        <TouchableOpacity
           onPress={() => {
            this.props.navigation.navigate("Dashboard");
          }}
        >
          <View
            style={{
              height: 50,
              backgroundColor: "#3c3cc2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 22, color: "#fff" }}>NEXT</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}
