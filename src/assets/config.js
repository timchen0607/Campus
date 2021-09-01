import firebase from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyDtYB7XthyeF9hIlrfXiMKf9bQMOPqVX9U",
  authDomain: "campus-f09a1.firebaseapp.com",
  databaseURL: "https://campus-f09a1-default-rtdb.firebaseio.com",
  projectId: "campus-f09a1",
  storageBucket: "campus-f09a1.appspot.com",
  messagingSenderId: "916588820563",
  appId: "1:916588820563:web:addd06471b111a90232ea6",
  measurementId: "G-4ZX5YS7MYG",
};

export const userCheck = (uid) => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!uid || !user) reject("/");
      else resolve();
    });
  });
};

export const groupCheck = (gid, gList) => {
  return new Promise((resolve, reject) => {
    const auth = gList.find((x) => x.key === gid);
    if (!auth) reject("/Error");
    else resolve(auth);
  });
};

export const getRealData = (path) => {
  return firebase.database().ref(path);
};

export const getFD = (path) => {
  return new Promise((resolve) => {
    firebase
      .database()
      .ref(path)
      .once("value", (res) => resolve(res.val()));
  });
};

export const setFD = (path, obj) => {
  return new Promise((resolve) => {
    firebase
      .database()
      .ref(path)
      .set(obj);
    resolve();
  });
};

export const pushFD = (path, obj) => {
  return new Promise((resolve) => {
    const res = firebase
      .database()
      .ref(path)
      .push(obj);
    resolve(res);
  });
};

export const delFD = (path) => {
  return new Promise((resolve) => {
    firebase
      .database()
      .ref(path)
      .remove();
    resolve();
  });
};

export const getDT = () => {
  let now = new Date();
  let mm = ("0" + (now.getMonth() + 1)).slice(-2);
  let dd = ("0" + now.getDate()).slice(-2);
  let HH = ("0" + now.getHours()).slice(-2);
  let MM = ("0" + now.getMinutes()).slice(-2);
  let SS = ("0" + now.getSeconds()).slice(-2);
  let timestamp =
    now.getFullYear() + "/" + mm + "/" + dd + " " + HH + ":" + MM + ":" + SS;
  return timestamp;
};

export const sortDT = (arr) => {
  arr.sort(function(a, b) {
    return Date.parse(b.timeStamp) - Date.parse(a.timeStamp);
  });
  return arr;
};
