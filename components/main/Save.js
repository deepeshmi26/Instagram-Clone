import { View, Text, TextInput, Image, Button } from "react-native";
import { useState } from "react";

import firebase from "firebase/app";
import "firebase/firestore";
import { auth, db } from "../../firestore";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { fetchUserPosts } from "../../redux/actions/action";

export default function Save(props) {
  const [caption, setCaption] = useState("");

  const navigation = useNavigation();
  const uploadImage = async () => {
    const uri = props.route.params.image;
    const response = await fetch(uri);
    const blob = await response.blob();
    const task = firebase
      .storage()
      .ref()
      .child(
        `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`
      )
      .put(blob);

    const taskProgress = (snapShot) => {
      console.log(`transferred: ${snapShot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshotURL) => {
        savePostData(snapshotURL);
      });
    };

    const taskError = (snapShot) => {
      console.log(snapShot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadUrl) => {
    db.collection("posts")
      .doc(auth.currentUser.uid)
      .collection("userPosts")
      .add({
        url: downloadUrl,
        caption: caption,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        fetchUserPosts();
        navigation.popToTop();
      });
  };
  return (
    <View style={{ flex: 1 }}>
      <Image source={{ uri: props.route.params.image }} />
      <TextInput
        placeholder="Write a caption . . ."
        onChangeText={(caption) => setCaption(caption)}
      ></TextInput>
      <Button title="Save" onPress={() => uploadImage()} />
      <Text>Save</Text>
    </View>
  );
}
