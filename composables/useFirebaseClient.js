import { initializeApp } from 'firebase/app';
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDjPk1hWALrFDytEEeXN2udVZU4GHIrr4E",
  authDomain: "silent-complex-381416.firebaseapp.com",
  projectId: "silent-complex-381416",
  storageBucket: "silent-complex-381416.appspot.com",
  messagingSenderId: "396369508726",
  appId: "1:396369508726:web:f642cf86a7a2e91e8ce257",
  measurementId: "G-2Q8KGMQEQM"
};

const app = initializeApp(firebaseConfig);

export const useFirebaseClient = () => {
  const storage = getStorage(app);
  return storage;
}
