// Initialize Firebase
import * as firebase from 'firebase'

var config = {
  apiKey: "AIzaSyAmJBXk8-6Ag5e-VTpHwqCa3zooEdd3KHM",
  authDomain: "wk-08-firebase-app.firebaseapp.com",
  databaseURL: "https://wk-08-firebase-app.firebaseio.com",
  storageBucket: "wk-08-firebase-app.appspot.com",
  messagingSenderId: "592761265728"
};

const fbRef = firebase
  .initializeApp(config)
  .database()
  .ref()
  .child('test1')

export default fbRef

// var FbApp = firebase.initializeApp(config);
//
// import * as firebase from "firebase";
//
// module.export.FbApp = FbApp.database();
