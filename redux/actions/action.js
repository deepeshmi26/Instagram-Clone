import { auth, db } from "../../firestore";
import { store } from "../store/index";
import {
  USER_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE
} from "../constants";

export function fetchUser() {
  const docRef = db.collection("users").doc(auth.currentUser.uid);
  //console.log(auth.currentUser.uid);
  docRef
    .get()
    .then((docSnap) => {
      if (docSnap.exists) {
        store.dispatch({
          type: USER_STATE_CHANGE,
          currentUser: docSnap.data(),
        });
      } else {
        console.log("does not exists");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function fetchUserPosts() {
  const docRef = db
    .collection("posts")
    .doc(auth.currentUser.uid)
    .collection("userPosts")
    .orderBy("creation", "asc");
  docRef.get().then((docSnap) => {
    let posts = docSnap.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      return { id, ...data };
    });
    //console.log(posts);
    store.dispatch({
      type: USER_POSTS_STATE_CHANGE,
      posts: posts,
    });
  });
}

export function fetchUserFollowing() {
  const docRef = db
    .collection("following")
    .doc(auth.currentUser.uid)
    .collection("userFollowing");
  docRef.onSnapshot((docSnap) => {
    let following = docSnap.docs.map((doc) => {
      const id = doc.id;
      return { id };
    });
    //console.log(posts);
    store.dispatch({
      type: USER_FOLLOWING_STATE_CHANGE,
      following: following,
    });
    for (let i = 0; i < following.length; i++) {
      fetchUsersData(following[i].id);
    }
  });
}

export function fetchUsersData(uid) {
  console.log(store.getState());
  const found = store.getState().usersState.users.some((el) => el.uid === uid);

  if (!found) {
    const docRef = db.collection("users").doc(uid);
    //console.log(auth.currentUser.uid);
    docRef
      .get()
      .then((docSnap) => {
        if (docSnap.exists) {
          let user = docSnap.data();
          user.uid = docSnap.id;
          store.dispatch({
            type: USERS_DATA_STATE_CHANGE,
            user,
          });
          fetchUsersFollowingPosts(user.uid);
        } else {
          console.log("does not exists");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export function fetchUsersFollowingPosts(uid) {
  const docRef = db
    .collection("posts")
    .doc(uid)
    .collection("userPosts")
    .orderBy("creation", "asc");
  docRef.get().then((docSnap) => {
    //const uid = docSnap.query.EP.path.segments[1];
    //console.log({ docSnap, uid });

    const user = store.getState().usersState.users.find((el) => el.uid === uid);

    let posts = docSnap.docs.map((doc) => {
      const data = doc.data();
      const id = doc.id;
      return { id, ...data, user };
    });
    store.dispatch({
      type: USERS_POSTS_STATE_CHANGE,
      posts: posts,
    });
    console.log(store.getState());
  });
}
