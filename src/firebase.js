import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, doc, setDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBOqtbV9kTZzXYGTbG2xlaAT2GnJevDlh8",
  authDomain: "voyages-doudous.firebaseapp.com",
  projectId: "voyages-doudous",
  storageBucket: "voyages-doudous.firebasestorage.app",
  messagingSenderId: "979447281587",
  appId: "1:979447281587:web:0eb7739a80119af1f2bdc6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  console.warn('IndexedDB persistence failed:', err && err.message);
});

export { db, doc, setDoc, onSnapshot };
