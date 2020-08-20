import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  TextInput,
  CheckBox,
  Pressable,
  Alert,
  ScrollView,
  Image
} from "react-native";
import { Overlay } from "react-native-elements";
import Icon from "@expo/vector-icons/FontAwesome";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as firebase from "firebase"

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      email:"" ,
      password :"",
      username:"",
      isLoading:false
    };
  }

  signupUser = async (name,email,password)=>{
  await  this.setState({
        isLoading:true
    });
      firebase
      .auth()
      .createUserWithEmailAndPassword(email,password)
      .then(async (authenticate)=>{
          
          await authenticate.user

          .updateProfile({
            displayName: name
          });
        firebase.database().ref("/users/" + authenticate.user.uid + "/UserInfo")
          .set({
            name: name,
            userUid: authenticate.user.uid,
            profileUrl: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
          });
        this.props.navigation.navigate("UserLikes");
      })
      .catch((error)=>{
          alert(error.message)

      })
      this.setState({
          isLoading:false
      })


  }

  render() {
      if(this.state.isLoading){
          return(
              <View style={{flex:1,justifyContent:"center",alignItems:"center"}} >
                  <Text style={{fontSize:30,color:"grey",marginBottom:10}} >
                      Loading please wait
                  </Text>
                  <Image source={require("./images/loading.png")} style={{height:200,width:200}}  />

              </View>
          )

      }
    return (
    
        <View
          style={{ flex: 1}}
        >
           <View style={{flex:1.5,backgroundColor:"#4537cd",borderBottomRightRadius:50,borderBottomLeftRadius:50,alignItems:"center"}} >
          <Image source={require("./images/gplogo.png")}  style={{height:200,width:200,marginTop:20}}  />


        </View>
        <View style={{flex:2,justifyContent:"center",alignItems:"center"}} >
        <View
            style={{
              height: 450,
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
                  letterSpacing: 5,
                  textAlign: "center",
                }}
              >
                {" "}
                NEW
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  letterSpacing: 5,
                  textAlign: "center",
                }}
              >
                {" "}
                TO GLEXPACE ?
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
                  <Icon name="envelope" size={22} color="grey" />
                </View>
                <View style={{ marginLeft: 40 }}>
                  <TextInput placeholder="E-mail" style={{ fontSize: 15 }} onChangeText={(email)=>{
                      this.setState({
                          email

                      })
                  }} />
                </View>
              </View>

           
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
                  <Icon name="user" size={22} color="grey" />
                </View>
                <View style={{ marginLeft: 40 }}>
                  <TextInput placeholder="Penname (Username)" style={{ fontSize: 15 }} onChangeText={(username)=>{
                      this.setState({
                          username
                      })

                  }} />
                </View>
              </View>

       
       

              

              

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
                  <Icon name="lock" size={22} color="grey" />
                </View>
                <View style={{ marginLeft: 40 }}>
                  <TextInput placeholder="Password" style={{ fontSize: 15 }} onChangeText={(password)=>{
                      this.setState({
                          password
                      })
                  }} />
                </View>
              </View>

              <View style={{ marginTop: 20, flexDirection: "row" }}>
                <Text>By continuing you agree to our </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      isVisible: true,
                    });
                  }}
                >
                  <Text style={{ color: "blue" }}>Privacy policy</Text>
                </TouchableOpacity>
              </View>
              {
                <Overlay
                  isVisible={this.state.isVisible}
                  onBackdropPress={() => this.setState({ isVisible: false })}
                >
                  <ScrollView style={{ flex: 1 }}>
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
                        Glexpace.com recognises the importance of maintaining
                        your privacy. We value your privacy and appreciate your
                        trust in us. This Policy describes how we treat user
                        information we collect on https://www.glexpace.com. This
                        Privacy Policy applies to current and former visitors to
                        our website. By visiting and/or using our website, you
                        agree to this Privacy Policy. At glexpace, accessible
                        from glexpace.com, one of our main priorities is the
                        privacy of our visitors and users. This Privacy Policy
                        document contains types of information that is collected
                        and recorded by glexpace and how we use it. If you have
                        additional questions or require more information about
                        our Privacy Policy, do not hesitate to contact us. This
                        Privacy Policy applies only to our online activities and
                        is valid for visitors to our website with regards to the
                        information that they shared and/or collect in glexpace.
                        This policy is not applicable to any information
                        collected offline or via channels other than this
                        website. Consent By using our website, you hereby
                        consent to our Privacy Policy and agree to its terms.
                        Information we collect The personal information that you
                        are asked to provide, and the reasons why you are asked
                        to provide it, is to make it easy for you to use this
                        website. If you contact us directly, we may receive
                        additional information about you such as your name,
                        email address, phone number, the contents of the message
                        and/or attachments you may send us, and any other
                        information you may choose to provide. When you register
                        for an Account, we may ask for your contact information,
                        including name and email address only. How we use your
                        information We use the information we collect in various
                        ways, including to:
                        • Provide, operate, and maintain
                        glexpace website 
                        • Improve, personalize, and expand
                        glexpace website 
                        • Understand and analyze how you use
                        glexpace website 
                        • Develop new products, services,
                        features, and functionality 
                        • Communicate with you,
                        either directly or through one of our partners,
                        including for customer service, to provide you with
                        updates and other information relating to the glexpace
                        website, and for making it easy to send your gifts to
                        you as we send gifts to our users who got most viewed,
                        inspiring and other type of stories. • Send you emails •
                        Find and prevent fraud Log Files Glexpace follows a
                        standard procedure of using log files. These files log
                        visitors when they visit websites. All hosting companies
                        do this and a part of hosting services' analytics. The
                        information collected by log files include internet
                        protocol (IP) addresses, browser type, Internet Service
                        Provider (ISP), date and time stamp, referring/exit
                        pages, and possibly the number of clicks. These are not
                        linked to any information that is personally
                        identifiable. The purpose of the information is for
                        analyzing trends, administering the site, tracking
                        users' movement on the website. Cookies and Web Beacons
                        Like any other website, Glexpace uses 'cookies'. These
                        cookies are used to store information including
                        visitors' preferences, and the pages on the website that
                        the visitor accessed or visited. The information is used
                        to optimize the users' experience by customizing our web
                        page content based on visitors' browser type and/or
                        other information. For more general information on
                        cookies, please read "What Are Cookies". Children's
                        Information Another part of our priority is adding
                        protection for children while using the internet. We
                        encourage parents and guardians to observe, participate
                        in, and/or monitor and guide their online activity.
                        glexpace does not knowingly collect any Personal
                        Identifiable Information from children under the age of
                        13. If you think that your child provided this kind of
                        information on our website, we strongly encourage you to
                        contact us immediately and we will do our best efforts
                        to promptly remove such information from our records.
                        Privacy Policy Changes Although most changes are likely
                        to be minor, Glexpace may change its Privacy Policy from
                        time to time, and in Glexpace's sole discretion.
                        Glexpace encourages visitors to frequently check this
                        page for any changes to its Privacy Policy. Your
                        continued use of this site after any change in this
                        Privacy Policy will constitute your acceptance of such
                        change. Contact In accordance with Information
                        Technology Act 2000 and rules made there under, the
                        contact details are provided below: Email:
                        info@glexpace.com If you have any questions about this
                        Policy or other privacy concerns, you can also email us
                        at glexpace@gmail.com | info@glexpace.com |
                        ayushglexpace@gmail.com | shashankglexpace@gmail.com
                        Updates to this policy This Privacy Policy was last
                        updated on 02.07.2020. From time to time we may change
                        our privacy practices. We will notify you of any
                        material changes to this policy as required by law. We
                        will also post an updated copy on our website. Please
                        check our site periodically for updates.
                      </Text>
                    </View>
                  </ScrollView>
                   </Overlay>
              }

              <View style={{height:50,justifyContent:"center",alignItems:"center"}} >
              <TouchableOpacity
                onPress={() => {
                 this.signupUser(this.state.username,this.state.email,this.state.password)
                }}
                style={{
                  height: 45,
                  width: 280,
                  backgroundColor: "#4537cd",
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 22.5,
                  flexDirection:"row"
                }}
              >
                <Text style={{ fontSize: 22, letterSpacing: 1 ,color:"#fff"}}>
                  REGISTER TO{" "}
                </Text>
                <View style={{height:40,width:40}} >
                    <Image source={require("./images/gplogo.png")} style={{flex:1,height:null,width:null}} />
                </View>
              </TouchableOpacity>

              </View>

             
              <View style={{ marginTop: 20, flexDirection: "row" }}>
                <Text>Already a Glexpace Writer ? </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("Welcome");
                  }}
                >
                  <Text style={{ color: "blue" }}>Login Here</Text>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text>{"\u00A9"} Glexpace</Text>
              </View>
            </View>
          </View>
 

        </View>
          </View>
     
    );
  }
}
