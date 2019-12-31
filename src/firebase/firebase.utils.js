import firebase, { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyBN7bcooleQpcpqSQG7q-sjSe87n-IgWl8",
    authDomain: "crwn-db-d7635.firebaseapp.com",
    databaseURL: "https://crwn-db-d7635.firebaseio.com",
    projectId: "crwn-db-d7635",
    storageBucket: "crwn-db-d7635.appspot.com",
    messagingSenderId: "841963862967",
    appId: "1:841963862967:web:9e5290b67dfb8d37f24632",
    measurementId: "G-5MMXL395C1"
  };

  export const createUserProfileDocument = async (userAuth, additionalData) => {
    if (!userAuth) return;

    const userRef = firestore.doc(`users/${userAuth.uid}`);

    const snapShot = await userRef.get();

   if (!snapShot.exists) {
       const { displayName, email } = userAuth;
       const createAt = new Date();

       try {
        await userRef.set({
            displayName,
            email,
            createAt,
            ...additionalData
        })
       } catch (error) {
        console.log('error creating user', error.massage);
    }
   }
   return userRef;
  }

  firebase.initializeApp(config);


  export const auth = firebase.auth();
  export const firestore = firebase.firestore();

  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account '});
  export const signInWithGoogle  = () => auth.signInWithPopup(provider);

  export default firebase;
