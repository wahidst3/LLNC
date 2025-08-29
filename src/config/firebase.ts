import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyDH_H7yWQkAnTk6Qg6wbKrPqg6pRZO_yTo",
//   authDomain: "lncc-organic.firebaseapp.com",
//   databaseURL: "https://lncc-organic-default-rtdb.firebaseio.com",
//   projectId: "lncc-organic",
//   storageBucket: "lncc-organic.firebasestorage.app",
//   messagingSenderId: "541453850147",
//   appId: "1:541453850147:web:6b02e54ffd8343d2188396"
// };
const firebaseConfig = {
  apiKey: "AIzaSyBizAWWNMNT2B5Z12npgeSSX_ONaKFR6Fo",
  authDomain: "llnc-51eda.firebaseapp.com",
  projectId: "llnc-51eda",
  storageBucket: "llnc-51eda.firebasestorage.app",
  messagingSenderId: "48391084878",
  appId: "1:48391084878:web:7feb5d8c96eb33e33bdc1f",
  measurementId: "G-KBYP9SRESW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);
export const storage = getStorage(app);

export default app;