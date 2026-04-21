import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCczK3YwV0RE3Bz_pY0E3zb7cni9ZpZyeI",
  authDomain: "brain-tumor-detection-577b9.firebaseapp.com",
  projectId: "brain-tumor-detection-577b9",
  storageBucket: "brain-tumor-detection-577b9.firebasestorage.app",
  messagingSenderId: "337339059402",
  appId: "1:337339059402:web:1f150f23f23f8af9e4f833",
  measurementId: "G-ZPF3WE42WN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
