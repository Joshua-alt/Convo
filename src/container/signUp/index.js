import React, { useState, useContext } from "react";
import { Text, SafeAreaView, View } from "react-native";
import firebase from "../../firebase/config";
import { InputField, RoundCornerButton, Logo } from "../../component";
import { globalStyle, color } from "../../utility";
import { Store } from "../../context/store";
import { LOADING_START, LOADING_STOP } from "../../context/actions/type";
import { setAsyncStorage, keys } from "../../asyncStorage";
import { setUniqueValue } from "../../utility/constants";

export default ({ navigation }) => {
  const globalState = useContext(Store);
  const { dispatchLoaderAction } = globalState;
  const [credential, setCredential] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { email, password, confirmPassword, name } = credential;

  const setInitialState = () => {
    setCredential({ email: "", password: "", confirmPassword: "" });
  };

  //   * ON SIGN UP PRESS
  const onSignUpPress = () => {
    if (!name) {
      alert("Name is required");
    } else if (!email) {
      alert("Email is required");
    } else if (!password) {
      alert("Password is required");
    } else if (password !== confirmPassword) {
      alert("Password did not match");
    } else {
      dispatchLoaderAction({
        type: LOADING_START,
      });
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          let uid = firebase.auth().currentUser.uid;
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
          setAsyncStorage(keys.uuid, uid);
          setUniqueValue(uid);
          firebase
            .database()
            .ref("users/")
            .push({
              user: {
                name: name,
                email: email,
                uuid: uid,
                profileImg: "",
              },
            });
          navigation.replace("Dashboard");
        })
        .catch((err) => {
          dispatchLoaderAction({
            type: LOADING_STOP,
          });
          alert(err);
        });
    }
  };
  // * HANDLE ON CHANGE
  const handleOnChange = (name, value) => {
    setCredential({
      ...credential,
      [name]: value,
    });
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.BLACK }}>
      <View style={[globalStyle.containerCentered]}>
        <Logo />
      </View>
      <View style={[globalStyle.flex2, globalStyle.sectionCentered]}>
        <InputField
          placeholder="Enter name"
          value={name}
          onChangeText={(text) => handleOnChange("name", text)}
        />
        <InputField
          placeholder="Enter email"
          value={email}
          onChangeText={(text) => handleOnChange("email", text)}
        />
        <InputField
          placeholder="Enter password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => handleOnChange("password", text)}
        />
        <InputField
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => handleOnChange("confirmPassword", text)}
        />

        <RoundCornerButton title="Sign Up" onPress={() => onSignUpPress()} />
        <Text
          style={{ fontSize: 28, fontWeight: "bold", color: color.LIGHT_GREEN }}
          onPress={() => {
            setInitialState();
            navigation.navigate("Login");
          }}
        >
          Login
        </Text>
      </View>
    </SafeAreaView>
  );
};