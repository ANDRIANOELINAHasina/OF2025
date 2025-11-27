// =======================================================
// DÉBUT DU BLOC D'INTÉGRATION FIREBASE
// =======================================================

const firebaseConfig = {
    apiKey: "AIzaSyDSbSeXO9CKWSDhNup51XPL0FKEgQc7xiT8", // VOS CLÉS
    authDomain: "voteof2025.firebaseapp.com",
    projectId: "voteof2025",
    databaseURL: "https://voteof2025-default-rtdb.firebaseio.com", 
    storageBucket: "voteof2025.firebasestorage.app",
    messagingSenderId: "340380987924",
    appId: "1:340380987924:web:d1d38acc06d02a3bc42d01",
    measurementId: "G-HBN2JMS2M1" 
};

// Initialisation de l'application et de la base de données
// NOTE : Ces fonctions sont disponibles grâce aux balises <script> ajoutées à index.html/authentification.html
const app = firebase.initializeApp(firebaseConfig);
const database = app.database(); 
const votesRef = database.ref('votes'); // La référence de la collection de votes

// =======================================================
// FIN DU BLOC D'INTÉGRATION FIREBASE
// =======================================================
