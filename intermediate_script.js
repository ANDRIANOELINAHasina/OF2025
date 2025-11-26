document.addEventListener('DOMContentLoaded', () => {
    const userNameDisplay = document.getElementById('userNameDisplay');
    const countdownElement = document.getElementById('countdown');

    const userName = localStorage.getItem('loggedInUserName');
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    const votedUsers = JSON.parse(localStorage.getItem('votedUsers')) || [];

    // TEMPORAIREMENT MODIFIÉ POUR LE DÉVELOPPEMENT:
    // La vérification `votedUsers.includes(loggedInUserId)` est commentée
    // pour permettre des tests répétés sans blocage.
    if (!loggedInUserId || !userName /* || votedUsers.includes(loggedInUserId) */) {
        alert("Session non valide, non authentifiée ou vote déjà enregistré. Redirection vers la page de connexion.");
        // Nettoyer le localStorage pour éviter des boucles ou des accès non autorisés
        localStorage.removeItem('loggedInUserId');
        localStorage.removeItem('loggedInUserName');
        window.location.replace('authentification.html'); // Utiliser replace pour ne pas laisser de trace dans l'historique
        return; // Arrêter l'exécution du script si les conditions ne sont pas remplies
    }

    // Empêcher le retour arrière sur cette page intermédiaire
    history.replaceState(null, document.title, location.href);
    window.addEventListener('popstate', function (event) {
        history.replaceState(null, document.title, location.href);
    });

    // Afficher le nom d'utilisateur
    if (userNameDisplay) {
        userNameDisplay.textContent = userName;
    }

    let countdown = 5; // Temps de redirection en secondes
    if (countdownElement) {
        countdownElement.textContent = countdown;
    }

    // Démarrer le compte à rebours
    const intervalId = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }

        if (countdown <= 0) {
            clearInterval(intervalId); // Arrêter le compte à rebours
            // Redirection vers la page de vote
            window.location.replace('vote.html'); // Utiliser replace pour ne pas permettre le retour vers intermediate_page
        }
    }, 1000); // Mettre à jour toutes les secondes
});