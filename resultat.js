// =======================================================
// FICHIER: resultat.js - Logique de Traitement des Résultats
// =======================================================

// 1. CONFIGURATION FIREBASE (Realtime Database)
// ** ASSUREZ-VOUS QUE CETTE CONFIGURATION CORRESPONDE À VOTRE PROJET FIREBASE **
const firebaseConfig = {
    apiKey: "AIzaSyDSbSeXO9CKWSDhNup51XPL0FKEgQc7xiT8", // REMPLACER PAR VOS VRAIES CLÉS
    authDomain: "voteof2025.firebaseapp.com",
    projectId: "voteof2025",
    databaseURL: "https://voteof2025-default-rtdb.firebaseio.com", 
    storageBucket: "voteof2025.firebasestorage.app",
    messagingSenderId: "340380987924",
    appId: "1:340380987924:web:d1d38acc06d02a3bc42d01",
    measurementId: "G-HBN2JMS2M1" 
};

// Initialisation de Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = app.database(); 
const votesRef = database.ref('votes'); // Référence à la collection 'votes'

// 2. DÉFINITION DES CANDIDATS (Identique à vote.js pour l'affichage des noms complets)
const candidats = [
    { 
        id: 'TC01', 
        nom: 'ANDRIANAHY Tohimahery Manantena', 
        description: 'Collège Terrain - Cadre - Service TPR'
    },
    { 
        id: 'TC02', 
        nom: 'RALAIAVY Stephanoel Guel', 
        description: 'Collège Terrain - Cadre - Service TPR'
    },
    { 
        id: 'TN01', 
        nom: 'TODISOA Richard Tsimanevoke Christophe', 
        description: 'Collège Terrain - Non Cadre - Service TPR' 
    },
    { 
        id: 'BC01', 
        nom: 'RAHENIARIJAONA Jean Christian Angelo', 
        description: 'Collège Bureau - Cadre - Service ADM'
    },
    { 
        id: 'BN01', 
        nom: 'RALISOA Chrétienne', 
        description: 'Collège Bureau - Non Cadre - Service ADM'
    },
    { 
        id: 'BN02', 
        nom: 'RAZAFIDONAHARINARIVO Marc Anthony', 
        description: 'Collège Bureau - Non Cadre - Service DUR' 
    }
];

// 3. LOGIQUE PRINCIPALE AU CHARGEMENT DU DOCUMENT
document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('results-container');
    const totalCountElement = document.getElementById('totalCount');
    const loadingMessage = document.getElementById('loadingMessage');
    const logoutButton = document.getElementById('logoutButton');

    // Gestion de la déconnexion et redirection vers la page d'authentification
    logoutButton.addEventListener('click', () => {
        // Nettoyage des données de session (si utilisées)
        localStorage.clear();
        // Redirection
        window.location.replace('authentification.html');
    });

    // Écoute des votes en temps réel (on('value'))
    votesRef.on('value', (snapshot) => {
        
        loadingMessage.style.display = 'none'; // Cacher le message de chargement
        resultsContainer.innerHTML = ''; // Nettoyer l'affichage précédent
        
        const votesData = snapshot.val();
        
        // Initialiser le compteur de votes à zéro pour tous les candidats
        const voteCounts = {};
        candidats.forEach(c => voteCounts[c.id] = 0);
        
        let totalVotes = 0;

        if (votesData) {
            // 4. Calcul des résultats
            Object.keys(votesData).forEach(key => {
                const vote = votesData[key];
                const candidatId = vote.candidatId; // Champ enregistré par vote.js
                
                // Vérifier si l'ID du candidat est valide
                if (candidatId && voteCounts.hasOwnProperty(candidatId)) {
                    voteCounts[candidatId]++;
                    totalVotes++;
                }
            });
        }
        
        // 5. Affichage des résultats
        renderResults(voteCounts, totalVotes);
        
    }, (error) => {
        // En cas d'erreur de lecture (ex: règles de sécurité mal configurées)
        console.error("Erreur de lecture des données Firebase:", error);
        resultsContainer.innerHTML = `<p class="error">Erreur: Impossible de charger les résultats en temps réel. Vérifiez les règles de sécurité Firebase. Détail: ${error.message}</p>`;
    });

    // 6. Fonction de Rendu des résultats dans le HTML
    function renderResults(voteCounts, totalVotes) {
        // Mise à jour du total
        totalCountElement.textContent = totalVotes;
        
        // Tri des candidats par nombre de votes (du plus grand au plus petit)
        const sortedCandidats = candidats.slice().sort((a, b) => {
            return voteCounts[b.id] - voteCounts[a.id];
        });

        if (totalVotes === 0) {
             resultsContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d;">En attente des premiers votes...</p>';
             return;
        }

        sortedCandidats.forEach(candidat => {
            const votes = voteCounts[candidat.id] || 0;
            // Calcul du pourcentage (éviter la division par zéro)
            const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
            
            const card = document.createElement('div');
            card.className = 'candidate-card';
            card.innerHTML = `
                <div class="candidate-info">
                    <div class="candidate-name">${candidat.nom} (${candidat.id})</div>
                    <div class="candidate-details">${candidat.description}</div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${getBarColor(percentage)};"></div>
                    </div>
                </div>
                <div class="vote-count-section">
                    <span class="vote-count">${votes}</span>
                    <span class="percentage">${percentage}%</span>
                </div>
            `;
            resultsContainer.appendChild(card);
        });
    }

    // 7. Fonction utilitaire pour la couleur de la barre de progression
    function getBarColor(percentage) {
        const p = parseFloat(percentage);
        if (p >= 50) return '#27ae60'; // Vert pour la majorité
        if (p >= 25) return '#f39c12'; // Orange
        return '#e74c3c'; // Rouge
    }
});
