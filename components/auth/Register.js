import React, { useEffect, useState } from "react";

import { View, Text, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { auth, db } from "../../firestore";

export default function Register(props) {
  let state = {
    email: "",
    password: "",
    name: "",
  };

  async function onRegister() {
    const { email, password, name } = state;
    try {
      let user = await auth.createUserWithEmailAndPassword(email, password);
      db.collection("users").doc(user.user.uid).set({
        email,
        password,
        name,
      });
      props.setLoginState({
        loggedIn: true,
        loaded: true,
      });
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  return (
    <View>
      <TextInput
        placeholder="name"
        onChangeText={(name) => (state.name = name)}
      />
      <TextInput
        placeholder="email"
        onChangeText={(email) => (state.email = email)}
      />
      <TextInput
        placeholder="password"
        secureTextEntry={true}
        onChangeText={(password) => (state.password = password)}
      />
      <Button onPress={() => onRegister()} title="Sign Up" />
    </View>
  );
}
