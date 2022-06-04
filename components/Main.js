import React, { useEffect } from "react";
import { View, Text } from "react-native-web";
import { useSelector } from "react-redux";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { auth } from "../firestore";
import FeedScreen from "./main/Feed";
import AddScreen from "./main/Add";
import ProfileScreen from "./main/Profile";
import SearchScreen from "./main/Search";
import { fetchUserFollowing } from "../redux/actions/action";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
  return null;
};

export default function Main() {
  const userState = useSelector((state) => state);
  const email = userState?.user?.currentUser?.email;
  //console.log(email);
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      labeled={false}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={26}
            ></MaterialCommunityIcons>
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="magnify"
              color={color}
              size={26}
            ></MaterialCommunityIcons>
          ),
        }}
      />

      <Tab.Screen
        name="AddContainer"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Add");
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-box"
              color={color}
              size={26}
            ></MaterialCommunityIcons>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Profile", { uid: auth.currentUser.uid });
          },
        })}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle"
              color={color}
              size={26}
            ></MaterialCommunityIcons>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
