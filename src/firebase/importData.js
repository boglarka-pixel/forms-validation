import firebase from 'firebase';
import fs from 'fs';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDdsDShJgvSjEbrrMDxVUOFteWuqgKtjyc",
    authDomain: "final-exam-project-fa253.firebaseapp.com",
    projectId: "final-exam-project-fa253",
    storageBucket: "final-exam-project-fa253.appspot.com",
    messagingSenderId: "313528091817",
    appId: "1:313528091817:web:40eaab39651582fda315b8"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();



const fileName = './random.json';
let content = [];

fs.readFile(fileName, function read(err, data) {
    if (err) {
        throw err;
    }

    content = JSON.parse(data);

    for (let person of content.persons) {
        db.collection('persons')
            .add(person)
            .then(() => {
                console.log('Document written');
            })
            .catch((error) => {
                console.error('Error adding document: ', error);
            });
    }
});


firebase.auth().onAuthStateChanged(async(user) => {
    const promises = [];
    if (user) {
        const persons = Object.keys(content);

        for (let i = 0; i < persons.length; i++) {
            const query = db.collection('restaurant')
                .doc(persons[i])
                .set(content[persons[i]])
                .then(() => {
                    console.log('Document written');
                })
                .catch((error) => {
                    console.error('Error adding document: ', error);
                });
            promises.push(query);
        }
        Promise.all(promises).then(() => {
            process.exit(0);
        })
    } else {
        console.log('no user');
    }
});