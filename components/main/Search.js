import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { db } from "../../firestore";

export default function Search() {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const fetchUsers = (search) => {
    db.collection("users")
      .where("name", ">=", search.nativeEvent.text)
      .get()
      .then((snapShot) => {
        let users = snapShot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };
  return (
    <View>
      <TextInput
        placeholder="Type Here ..."
        onChange={(search) => fetchUsers(search)}
      />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
           onPress={() => navigation.navigate("Profile", {uid: item.id})}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
