const admin = require('firebase-admin');
const path = require('path');

// NOTE: You must place your serviceAccountKey.json in the backend folder
// Download this from Firebase Console: Project Settings -> Service Accounts -> Generate new private key
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.warn('Firebase Admin Error: serviceAccountKey.json not found or invalid.');
  console.warn('Analysis results will be logged to console but NOT saved to Firestore.');
}

const db = admin.firestore();

module.exports = { admin, db };
