import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, FlatList, Button } from "react-native";
import { useSelector } from "react-redux";
import { auth, db } from "../../firestore";

export default function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const currentUserState = useSelector((state) => state.user);
  const currentUser = currentUserState.currentUser;
  const currentUserPosts = currentUserState.posts;
  const currentUserFollowing = currentUserState.following;
  useEffect(() => {
    if (props.route.params.uid == auth.currentUser.uid) {
      setUser(currentUser);
      setUserPosts(currentUserPosts);
    } else {
      db.collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((docSnap) => {
          if (docSnap.exists) {
            setUser(docSnap.data());
          } else {
            console.log("does not exists");
          }
        })
        .catch((error) => {
          console.log(error);
        });

      db.collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((docSnap) => {
          let posts = docSnap.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }
    if (
      currentUserFollowing.findIndex(
        (following) => following.id === props.route.params.uid
      ) > -1
    ) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, currentUserFollowing]);

  const onFollow = () => {
    db.collection("following")
      .doc(auth.currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };

  const onUnFollow = () => {
    db.collection("following")
      .doc(auth.currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  const onLogout = () => {
      auth.signOut();
  }
  if (user == null) {
    return <View />;
  }

  return (
    <View styles={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.email}</Text>
        <Text>{user.name}</Text>
        {props.route.params.uid !== auth.currentUser.uid ? (
          !following ? (
            <Button title="Follow" onPress={() => onFollow()} />
          ) : (
            <Button title="Unfollow" onPress={() => onUnFollow()} />
          )
        ) : <Button title="Logout" onPress={()=> onLogout()}/>}
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <Image style={styles.image} source={{ uri: item.url }} />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  containerImage: {
    flex: 1 / 3,
  },
});
