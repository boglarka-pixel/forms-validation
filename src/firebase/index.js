import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDdsDShJgvSjEbrrMDxVUOFteWuqgKtjyc",
    authDomain: "final-exam-project-fa253.firebaseapp.com",
    projectId: "final-exam-project-fa253",
    storageBucket: "final-exam-project-fa253.appspot.com",
    messagingSenderId: "313528091817",
    appId: "1:313528091817:web:40eaab39651582fda315b8"
};

firebase.initializeApp(firebaseConfig);

export { firebase };