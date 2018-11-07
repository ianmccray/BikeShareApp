import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyACdC4D0_PHedwWPYX4cTHSWnjN90viOz8",
    authDomain: "uva-rental.firebaseapp.com",
    databaseURL: "https://uva-rental.firebaseio.com",
    projectId: "uva-rental",
    storageBucket: "uva-rental.appspot.com",
    messagingSenderId: "869560544376"
  };
firebase.initializeApp(config);
export default firebase;
