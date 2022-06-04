import { StyleSheet, Text, View } from "react-native";

import { Provider } from "react-redux";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { auth } from "./firestore";
import { useEffect, useState } from "react";

import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";

import { store } from "./redux/store";
import Loading from "./components/auth/Loading";
import { fetchUser, fetchUserFollowing, fetchUserPosts } from "./redux/actions/action";

const Stack = createStackNavigator();

export default function App() {
  const [loginState, setLoginState] = useState({ loaded: false });

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setLoginState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        setLoginState({
          loggedIn: true,
          loaded: true,
        });
      }
      fetchUser();
      fetchUserPosts();
      fetchUserFollowing();
    });
  }, []);

  if (!loginState.loaded) {
    return <Loading />;
  }

  if (!loginState.loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => <RegisterScreen setLoginState={setLoginState} />}
          </Stack.Screen>
          <Stack.Screen name="Login">
            {(props) => <LoginScreen setLoginState={setLoginState} />}
          </Stack.Screen>
          <Stack.Screen name="Save">
            {(props) => <SaveScreen setLoginState={setLoginState} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Main"
            component={MainScreen}
            // options={{ headerShown: false }}
          />
          <Stack.Screen name="Add" component={AddScreen} />
          <Stack.Screen name="Save" component={SaveScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
