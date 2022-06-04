import React from "react";
import { View, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { auth } from "../../firestore";
export default function Login(props) {
  let state = {
    email: "",
    password: "",
  };

  const onSignUp = () => {
    const { email, password } = state;
    auth
      .signInWithEmailAndPassword(email, password)
      .then((credentials) =>
        props.setLoginState({
          loggedIn: true,
          loaded: true,
        })
      )
      .catch((error) => console.log(error));
  };

  return (
    <View>
      <TextInput
        placeholder="email"
        onChangeText={(email) => (state.email = email)}
      />
      <TextInput
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(password) => (state.password = password)}
      />
      <Button onPress={() => onSignUp()} title="Sign Up" />
    </View>
  );
}
