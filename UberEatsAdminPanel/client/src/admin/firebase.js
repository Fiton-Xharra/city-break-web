import firebase from 'firebase/app';
import 'firebase/auth';
// import 'firebase/firestore';

//enter your web app configuration options
const firebaseConfig = {
    apiKey: "AIzaSyDEAf4kN7EMKaWuxw9KZf9eUmB0cknOtlQ",
    authDomain: "uoycitybreakapp-da5d4.firebaseapp.com",
    databaseURL: "https://uoycitybreakapp-da5d4-default-rtdb.firebaseio.com",
    projectId: "uoycitybreakapp-da5d4",
    storageBucket: "uoycitybreakapp-da5d4.appspot.com",
    messagingSenderId: "667084036102",
    appId: "1:667084036102:web:97f790eb4e252981414b87",
    measurementId: "G-M8TRC5VZFC"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export { firebase };