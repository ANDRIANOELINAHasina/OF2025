// =======================================================
// CONFIGURATION FIREBASE (Realtime Database)
// =======================================================
// IMPORTANT : Nous utilisons la Realtime Database (RTDB) car vous avez utilisé 'app.database()'
// Ces clés sont intégrées ici mais devraient être sécurisées côté serveur dans un environnement réel.
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

// Initialisation de l'application et de la base de données Realtime
const app = firebase.initializeApp(firebaseConfig);
const database = app.database(); 
const votesRef = database.ref('votes'); // Référence à la collection racine des votes

// =======================================================
// DÉBUT DE LA LOGIQUE DE VOTE
// =======================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupération des données utilisateur de localStorage
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    const loggedInUserName = localStorage.getItem('loggedInUserName');
    
    // Récupération de la liste des votants pour la vérification de sécurité
    const votedUsers = JSON.parse(localStorage.getItem('votedUsers')) || [];

    // Sélecteurs d'éléments DOM
    const userNameElement = document.getElementById('userName');
    const cardsContainer = document.getElementById('cardsContainer');
    const btnVoter = document.getElementById('btnVoter');
    const messageContainer = document.getElementById('messageContainer');

    // Fonction utilitaire pour afficher les messages (avec type pour la couleur)
    function displayMessage(message, type) {
        if (!messageContainer) return;
        let color = '#2c3e50'; // Couleur par défaut
        if (type === 'error') color = 'red';
        else if (type === 'success') color = 'green';
        else if (type === 'warning') color = 'orange';
        else if (type === 'loading') color = '#2980b9'; // Bleu pour le chargement
        
        messageContainer.innerHTML = `<div style="color: ${color}; margin-top: 15px; font-weight: bold;">${message}</div>`;
    }

    // 2. VÉRIFICATION DE SÉCURITÉ ET INITIALISATION
    if (!loggedInUserId || !loggedInUserName) {
        // Redirection si l'utilisateur n'est pas authentifié
        displayMessage("Erreur : Session non valide. Redirection...", 'error');
        setTimeout(() => {
            window.location.replace('authentification.html');
        }, 2000);
        return;
    }

    if (votedUsers.includes(loggedInUserId)) {
        // Si l'utilisateur a déjà voté, on le bloque ici et on le redirige vers les résultats
        displayMessage("Vous avez déjà voté. Redirection vers les résultats.", 'warning');
        setTimeout(() => {
            window.location.replace('resultat.html');
        }, 2000);
        return;
    }
    
    // Affichage du nom de l'utilisateur
    if (userNameElement) {
        userNameElement.textContent = loggedInUserName;
    }

    // ----------------------------------------------------
    // Définition des candidats MISE À JOUR selon votre photo
    // ID = Identifiant (TC01, TC02, etc.)
    // Description contient Collège - Catégorie - Service
    // ----------------------------------------------------
    const candidats = [
        { 
            id: 'TC01', 
            nom: 'ANDRIANAHY Tohimahery Manantena', 
            description: 'Collège Terrain - Cadre - Service TPR', 
            imageUrl: `https://placehold.co/150x150/00796b/ffffff?text=TC01` 
        },
        { 
            id: 'TC02', 
            nom: 'RALAIAVY Stephanoel Guel', 
            description: 'Collège Terrain - Cadre - Service TPR', 
            imageUrl: `https://placehold.co/150x150/d32f2f/ffffff?text=TC02` 
        },
        { 
            id: 'TN01', 
            nom: 'TODISOA Richard Tsimanevoke Christophe', 
            description: 'Collège Terrain - Non Cadre - Service TPR', 
            imageUrl: `https://placehold.co/150x150/0288d1/ffffff?text=TN01` 
        },
        { 
            id: 'BC01', 
            nom: 'RAHENIARIJAONA Jean Christian Angelo', 
            description: 'Collège Bureau - Cadre - Service ADM', 
            imageUrl: `https://placehold.co/150x150/512da8/ffffff?text=BC01` 
        },
        { 
            id: 'BN01', 
            nom: 'RALISOA Chrétienne', 
            description: 'Collège Bureau - Non Cadre - Service ADM', 
            imageUrl: `https://placehold.co/150x150/ff7043/ffffff?text=BN01` 
        },
        { 
            id: 'BN02', 
            nom: 'RAZAFIDONAHARINARIVO Marc Anthony', 
            description: 'Collège Bureau - Non Cadre - Service DUR', 
            imageUrl: `https://placehold.co/150x150/7cb342/ffffff?text=BN02` 
        }
    ];
    // ----------------------------------------------------

    let selectedCandidatId = null;

    // 3. AFFICHAGE DES CARTES DES CANDIDATS
    function renderCandidats() {
        if (!cardsContainer) return;
        cardsContainer.innerHTML = ''; // Nettoyer le conteneur

        candidats.forEach(candidat => {
            const isSelected = candidat.id === selectedCandidatId;
            const cardHtml = `
                <div class="candidat-card ${isSelected ? 'selected' : ''}" data-id="${candidat.id}">
                    <img src="${candidat.imageUrl}" alt="Photo de ${candidat.nom}" onerror="this.onerror=null;this.src='https://placehold.co/150x150/9e9e9e/ffffff?text=${candidat.id}'}">
                    <h3>${candidat.nom}</h3>
                    <p>${candidat.description}</p>
                    <div class="selection-overlay">
                        <i class="fas fa-check-circle"></i> Sélectionné
                    </div>
                </div>
            `;
            cardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        });

        attachCardListeners();
    }
    
    // 4. LOGIQUE DE SÉLECTION
    function attachCardListeners() {
        document.querySelectorAll('.candidat-card').forEach(card => {
            card.addEventListener('click', () => {
                // Mettre à jour la sélection
                selectedCandidatId = card.dataset.id;
                
                // Mettre à jour l'affichage
                renderCandidats();

                // Activer le bouton de vote
                if (btnVoter) {
                    btnVoter.disabled = false;
                }
            });
        });
    }

    // 5. FONCTION D'ENREGISTREMENT DU VOTE (Firebase Realtime Database)
    async function submitVote() {
        if (!selectedCandidatId) {
            displayMessage("Veuillez sélectionner un candidat.", 'error');
            return;
        }

        // Désactiver le bouton pendant le traitement pour éviter les doubles clics
        if (btnVoter) btnVoter.disabled = true;
        displayMessage("Enregistrement du vote en cours...", 'loading');
        
        // Données à enregistrer
        const voteData = {
            candidatId: selectedCandidatId,
            voterId: loggedInUserId,
            voterName: loggedInUserName,
            timestamp: firebase.database.ServerValue.TIMESTAMP // Utiliser le timestamp du serveur
        };

        try {
            // Utilisation de push() pour créer une clé unique, puis set() pour enregistrer les données.
            await votesRef.push().set(voteData);

            // 6. MISE À JOUR CRITIQUE DU LOCAL STORAGE (pour bloquer le revote)
            const newVotedUsers = [...votedUsers, loggedInUserId];
            localStorage.setItem('votedUsers', JSON.stringify(newVotedUsers));
            
            // 7. Vider les identifiants de session (sécurité accrue)
            localStorage.removeItem('loggedInUserId');
            localStorage.removeItem('loggedInUserName');

            displayMessage("Vote enregistré avec succès ! Redirection vers les résultats...", 'success');
            
            // Redirection après succès
            setTimeout(() => {
                window.location.replace('resultat.html');
            }, 3000);

        } catch (error) {
            console.error("Erreur lors de l'enregistrement du vote dans Firebase:", error);
            displayMessage(`Erreur lors de l'enregistrement : ${error.message}`, 'error');

            // Rétablir les identifiants si une erreur critique se produit avant la redirection
            localStorage.setItem('loggedInUserId', loggedInUserId);
            localStorage.setItem('loggedInUserName', loggedInUserName);
            // Réactiver le bouton de vote
            if (btnVoter) btnVoter.disabled = false; 
        }
    }

    // 8. Événement du bouton de vote
    if (btnVoter) {
        btnVoter.addEventListener('click', submitVote);
        btnVoter.disabled = true; // Désactivé au départ
    }

    // Démarrer l'affichage
    renderCandidats();
});
