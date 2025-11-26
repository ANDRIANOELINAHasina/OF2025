document.addEventListener('DOMContentLoaded', () => {
    // ⭐️ AJOUTEZ VOTRE LIEN ICI ⭐️
    const GOOGLE_SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxEAaoh9Z3Z1x_IoHAGyFmDdXTQqbk8NsISmoIDRsrzwos01FJ3K1ywf6HAOT3jnwV7/exec';
    const candidatsListContainer = document.getElementById('candidatsList');
    const btnVoter = document.getElementById('btnVoter'); // L'ID de votre bouton "Valider mon vote"
    const voteMessage = document.getElementById('voteMessage');
    const voteLimitMessage = document.getElementById('voteLimitMessage');
    const votePageWelcome = document.getElementById('votePageWelcome');

    // Récupérer l'identifiant de l'utilisateur connecté depuis le localStorage
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    const loggedInUserName = localStorage.getItem('loggedInUserName');

    // Pour stocker les identifiants qui ont déjà voté
    let votedUsers = JSON.parse(localStorage.getItem('votedUsers')) || [];

    // --- DÉBUT DES MESURES DE SÉCURITÉ ET DE FLUX DE VOTE ---

    // 1. Redirection si l'utilisateur n'est pas connecté ou a déjà voté
    if (!loggedInUserId || !loggedInUserName) {
        alert("Session non valide ou non authentifiée. Redirection vers la page de connexion.");
        // Nettoyer le localStorage au cas où des données résiduelles traîneraient
        localStorage.removeItem('loggedInUserId');
        localStorage.removeItem('loggedInUserName');
        window.location.replace('authentification.html'); // Utiliser replace pour ne pas laisser de trace dans l'historique
        return; // Arrêter l'exécution du script si les conditions ne sont pas remplies
    }

    // GESTION DES VOTES DÉJÀ ENREGISTRÉS (Réactivée et nécessaire pour la fonctionnalité)
    if (votedUsers.includes(loggedInUserId)) {
        alert("Vous avez déjà voté. Redirection vers la page de connexion.");
        localStorage.removeItem('loggedInUserId');
        localStorage.removeItem('loggedInUserName');
        window.location.replace('authentification.html');
        return;
    }


    // 2. Empêcher le retour arrière sur la page de vote
    // Cela empêche de revenir à intermediate_page.html ou authentification.html via le bouton retour.
    history.replaceState(null, document.title, location.href);
    window.addEventListener('popstate', function (event) {
        history.replaceState(null, document.title, location.href);
        // Ici, on maintient l'utilisateur sur la page de vote tant qu'il n'a pas soumis son vote.
        // Après le vote, la redirection via replace() gérera la sortie.
    });
    // --- FIN DES MESURES DE SÉCURITÉ ET DE FLUX DE VOTE ---

    // Personnaliser le message de bienvenue si le nom d'utilisateur est disponible
    if (votePageWelcome && loggedInUserName) {
        // Le texte du H1 contient déjà le message par défaut, nous voulons juste ajouter le nom.
        // On va modifier le span pour ne pas casser l'icône dans le H1.
        votePageWelcome.textContent = `Bienvenue, ${loggedInUserName} ! Élection des délégués du personnel.`;
    }


    // Liste complète des candidats et des options spéciales (vote blanc/nul)
    const candidats = [
        // Collège Terrain
        // Sous-catégorie CADRE (RTPA)
        { id: 'T-C001', nom: 'ANDRIANAHY Tohimahery Manantena', matricule: '280', Service: 'TPR', photo: 'Mahery.jpg', college: 'Terrain', sous_categorie: 'CADRE', type: 'candidat' },
        { id: 'T-C003', nom: 'RALAIAVY STEPHANOEL GUEL', matricule: '018', Service: 'TPR', photo: 'Stephanoel.jpeg', college: 'Terrain', sous_categorie: 'CADRE', type: 'candidat' },
        // Options spéciales pour CADRE Terrain (bulles sans photo)
        { id: 'Vato Fotsy Terrain CADRE', nom: 'Vato Fotsy (Vote Blanc)', college: 'Terrain', sous_categorie: 'CADRE', type: 'special_category_option' },
        { id: 'Vato Maty Terrain CADRE', nom: 'Vato Maty (Vote Nul)', college: 'Terrain', sous_categorie: 'CADRE', type: 'special_category_option' },

        // Sous-catégorie NON CADRE (Terrain)
        { id: 'T-C007', nom: 'TODISOA Richard Tsimanevoke Christophe', matricule: '134', Service: 'TPR', photo: 'Todisoa Richard.jpeg', college: 'Terrain', sous_categorie: 'NON CADRE', type: 'candidat' },
        // Options spéciales pour NON CADRE Terrain (bulles sans photo)
        { id: 'Vato Fotsy Terrain NON CADRE', nom: 'Vato Fotsy (Vote Blanc)', college: 'Terrain', sous_categorie: 'NON CADRE', type: 'special_category_option' },
        { id: 'Vato Maty Terrain NON CADRE', nom: 'Vato Maty (Vote Nul)', college: 'Terrain', sous_categorie: 'NON CADRE', type: 'special_category_option' },


        // Collège Bureau
        // Sous-catégorie CADRE (Bureau)
        { id: 'B-C002', nom: 'RAHENIARIJAONA Jean Christian Angelo', matricule: '318', Service: 'ADM', photo: 'Angelo.jpeg', college: 'Bureau', sous_categorie: 'CADRE', type: 'candidat' },
        // Options spéciales pour CADRE Bureau (bulles sans photo)
        { id: 'Vato Fotsy Bureau CADRE', nom: 'Vato Fotsy (Vote Blanc)', college: 'Bureau', sous_categorie: 'CADRE', type: 'special_category_option' },
        { id: 'Vato Maty Bureau CADRE', nom: 'Vato Maty (Vote Nul)', college: 'Bureau', sous_categorie: 'CADRE', type: 'special_category_option' },

        // Sous-catégorie NON CADRE (Bureau)
        { id: 'B-C006', nom: 'RALISOA Chrétienne', matricule: '213', Service: 'ADM', photo: 'Chretienne.jpg', college: 'Bureau', sous_categorie: 'NON CADRE', type: 'candidat' },
        { id: 'B-C008', nom: 'RAZAFIDONAHARINARIVO Marc Anthony', matricule: '285', Service: 'DUR', photo: 'Anthony.jpeg', college: 'Bureau', sous_categorie: 'NON CADRE', type: 'candidat' },
        // Options spéciales pour NON CADRE Bureau (bulles sans photo)
        { id: 'Vato Fotsy Bureau NON CADRE', nom: 'Vato Fotsy (Vote Blanc)', college: 'Bureau', sous_categorie: 'NON CADRE', type: 'special_category_option' },
        { id: 'Vato Maty Bureau NON CADRE', nom: 'Vato Maty (Vote Nul)', college: 'Bureau', sous_categorie: 'NON CADRE', type: 'special_category_option' }
    ];

    // Structure pour stocker les choix de l'utilisateur
    let selectedChoices = {
        'Terrain': {
            'CADRE': null,
            'NON CADRE': null
        },
        'Bureau': {
            'CADRE': null,
            'NON CADRE': null
        }
    };

    /**
     * Crée une carte HTML pour un candidat ou une option spéciale.
     * @param {object} item - Les données du candidat ou de l'option.
     * @returns {HTMLElement} La carte créée.
     */
    function createCard(item) {
        const card = document.createElement('div');
        card.classList.add('candidat-card');
        card.dataset.id = item.id; // Stocke l'ID pour une récupération facile
        card.dataset.college = item.college;
        card.dataset.type = item.type;
        card.dataset.sousCategorie = item.sous_categorie;

        let contentHtml = '';
        if (item.type === 'candidat') {
            contentHtml = `
                <img src="${item.photo}" alt="Photo de ${item.nom}" class="candidat-image">
                <div class="candidat-name">${item.nom}</div>
                <div class="candidat-details">Matricule: ${item.matricule}</div>
                <div class="candidat-details">Service: ${item.Service}</div>
            `;
        } else if (item.type === 'special_category_option') {
            // Pour les votes blanc/nul, on utilise un style de bulle spécial
            card.classList.add('special-option-card'); // Ajout d'une classe spécifique
            contentHtml = `<span class="special-option-text">${item.nom}</span>`;
        }
        card.innerHTML = contentHtml;

        card.addEventListener('click', () => toggleSelection(card, item.college, item.sous_categorie, item.id));
        return card;
    }

    /**
     * Gère la sélection/désélection d'une carte de candidat ou d'option spéciale.
     * @param {HTMLElement} clickedCard - La carte HTML cliquée.
     * @param {string} college - Le collège (ex: 'Terrain', 'Bureau').
     * @param {string} sousCategorie - La sous-catégorie (ex: 'CADRE', 'NON CADRE').
     * @param {string} itemId - L'ID de l'élément sélectionné.
     */
    function toggleSelection(clickedCard, college, sousCategorie, itemId) {
        const currentSelection = selectedChoices[college][sousCategorie];
        const categoryCards = document.querySelectorAll(`.candidat-card[data-college="${college}"][data-sous-categorie="${sousCategorie}"]`);

        // Désélectionner toutes les cartes de la même catégorie
        categoryCards.forEach(card => {
            card.classList.remove('selected');
        });

        // Si l'élément cliqué était déjà sélectionné, le désélectionner
        if (currentSelection === itemId) {
            selectedChoices[college][sousCategorie] = null;
        } else {
            // Sélectionner le nouvel élément
            clickedCard.classList.add('selected');
            selectedChoices[college][sousCategorie] = itemId;
        }
        // Appel de la fonction pour mettre à jour l'état du bouton après chaque sélection
        updateVoteButtonState();
    }

    /**
     * Met à jour l'état du bouton de vote (activé/désactivé) en fonction des sélections.
     * Le bouton est activé si une sélection a été faite dans CHAQUE catégorie.
     */
    function updateVoteButtonState() {
        let allCategoriesSelected = true;
        for (const college in selectedChoices) {
            for (const sousCat in selectedChoices[college]) {
                if (selectedChoices[college][sousCat] === null) {
                    allCategoriesSelected = false;
                    break;
                }
            }
            if (!allCategoriesSelected) break;
        }
        if (btnVoter) {
            btnVoter.disabled = !allCategoriesSelected;
        }
    }


    /**
     * Génère l'interface utilisateur des candidats et des options de vote.
     */
    function renderCandidats() {
        if (!candidatsListContainer) {
            console.error("L'élément 'candidatsList' n'a pas été trouvé.");
            return;
        }
        candidatsListContainer.innerHTML = ''; // Nettoyer le contenu existant

        // Groupement par collège et sous-catégorie
        const groupedCandidats = {};
        candidats.forEach(candidat => {
            if (!groupedCandidats[candidat.college]) {
                groupedCandidats[candidat.college] = {};
            }
            if (!groupedCandidats[candidat.college][candidat.sous_categorie]) {
                groupedCandidats[candidat.college][candidat.sous_categorie] = [];
            }
            groupedCandidats[candidat.college][candidat.sous_categorie].push(candidat);
        });

        // Affichage des sections
        for (const college in groupedCandidats) {
            const collegeSection = document.createElement('div');
            collegeSection.classList.add('college-section');
            // DÉBUT DES MODIFICATIONS POUR COULEURS DE FOND
            if (college === 'Terrain') {
                collegeSection.classList.add('college-terrain');
            } else if (college === 'Bureau') {
                collegeSection.classList.add('college-bureau');
            }
            // FIN DES MODIFICATIONS POUR COULEURS DE FOND

            collegeSection.innerHTML = `
                <h2 class="college-title">Collège ${college}</h2>
                <p class="college-description">Sélectionnez votre choix pour le collège ${college}.</p>
            `;
            candidatsListContainer.appendChild(collegeSection);

            for (const sousCategorie in groupedCandidats[college]) {
                const sousCategorieSection = document.createElement('div');
                sousCategorieSection.classList.add('sous-categorie-section');
                // DÉBUT DES MODIFICATIONS POUR COULEURS DE FOND
                if (college === 'Terrain') {
                    if (sousCategorie === 'CADRE') {
                        sousCategorieSection.classList.add('categorie-terrain-cadre');
                    } else if (sousCategorie === 'NON CADRE') {
                        sousCategorieSection.classList.add('categorie-terrain-non-cadre');
                    }
                } else if (college === 'Bureau') {
                    if (sousCategorie === 'CADRE') {
                        sousCategorieSection.classList.add('categorie-bureau-cadre');
                    } else if (sousCategorie === 'NON CADRE') {
                        sousCategorieSection.classList.add('categorie-bureau-non-cadre');
                    }
                }
                // FIN DES MODIFICATIONS POUR COULEURS DE FOND

                sousCategorieSection.innerHTML = `
                    <h3 class="sous-categorie-title">Catégorie ${sousCategorie}</h3>
                `;
                collegeSection.appendChild(sousCategorieSection); // Ajouter à la section du collège

                const candidatsGrid = document.createElement('div');
                candidatsGrid.classList.add('candidats-grid');
                sousCategorieSection.appendChild(candidatsGrid); // Ajouter à la sous-catégorie

                // Ajouter les candidats
                const candidatsInSubcategory = groupedCandidats[college][sousCategorie].filter(item => item.type === 'candidat');
                candidatsInSubcategory.forEach(candidat => {
                    candidatsGrid.appendChild(createCard(candidat));
                });

                // Ajouter la section "Autres options de vote" (Blanc/Nul)
                const otherOptionsSection = document.createElement('div');
                otherOptionsSection.classList.add('other-options-section');
                otherOptionsSection.innerHTML = `
                    <h4 class="other-options-title">Autres options de vote</h4>
                    <p class="options-description-text">Si vous ne souhaitez voter pour aucun candidat dans cette catégorie, vous pouvez choisir l'une des options suivantes :</p>
                `;
                sousCategorieSection.appendChild(otherOptionsSection);

                const specialOptionsContainer = document.createElement('div');
                specialOptionsContainer.classList.add('special-options-bubbles-container');
                otherOptionsSection.appendChild(specialOptionsContainer);

                const specialOptionsInSubcategory = groupedCandidats[college][sousCategorie].filter(item => item.type === 'special_category_option');
                specialOptionsInSubcategory.forEach(option => {
                    specialOptionsContainer.appendChild(createCard(option));
                });
            }
        }
        updateVoteButtonState(); // Mettre à jour l'état initial du bouton
    }

    /**
     * Envoie le vote au serveur (Google Apps Script).
     */
    async function submitVote() {
        voteMessage.style.display = 'none';
        voteLimitMessage.style.display = 'none';
        btnVoter.disabled = true; // Désactiver le bouton pendant l'envoi

        // Vérification finale si toutes les catégories sont sélectionnées
        let allCategoriesSelected = true;
        for (const college in selectedChoices) {
            for (const sousCat in selectedChoices[college]) {
                if (selectedChoices[college][sousCat] === null) {
                    allCategoriesSelected = false;
                    break;
                }
            }
            if (!allCategoriesSelected) break;
        }

        if (!allCategoriesSelected) {
            voteLimitMessage.textContent = "Veuillez faire une sélection pour chaque catégorie avant de valider votre vote.";
            voteLimitMessage.style.display = 'block';
            btnVoter.disabled = false; // Réactiver le bouton si la validation échoue
            return;
        }

        // Préparation des données pour l'envoi
        const voteData = {
            action: 'submitVote', // Ajout d'une action pour le script GAS
            userId: loggedInUserId,
            userName: loggedInUserName,
            selections: selectedChoices
        };

        try {
            // --- DÉBUT DE LA REQUÊTE RÉELLE VERS GOOGLE SHEETS ---
            const response = await fetch(GOOGLE_SHEET_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(voteData)
            });

            if (response.ok) {
                // Le backend doit retourner un JSON, même si c'est juste { "success": true }
                const result = await response.json(); 
                voteMessage.textContent = result.message || "Votre vote a été enregistré avec succès !";
                voteMessage.style.display = 'block';
                voteMessage.style.color = "green"; // Pour un message de succès clair

                // --- MARQUER L'UTILISATEUR COMME AYANT VOTÉ (CÔTÉ CLIENT) ---
                votedUsers.push(loggedInUserId);
                localStorage.setItem('votedUsers', JSON.stringify(votedUsers));
                // --- FIN MARQUAGE ---

                // Nettoyer les informations de session après le vote
                localStorage.removeItem('loggedInUserId');
                localStorage.removeItem('loggedInUserName');

                // Redirection après un court délai
                setTimeout(() => {
                    alert("Vote enregistré avec succès ! Vous allez être redirigé vers la page de connexion.");
                    window.location.replace('authentification.html'); // Retour à la page de connexion
                }, 3000); // 3 secondes

            } else {
                // Le serveur a retourné un code d'erreur HTTP (ex: 400, 500)
                const errorData = await response.json();
                voteLimitMessage.textContent = errorData.message || "Erreur lors de l'enregistrement du vote. Code HTTP: " + response.status;
                voteLimitMessage.style.display = 'block';
                voteLimitMessage.style.color = "red";
                btnVoter.disabled = false; // Réactiver le bouton si erreur
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi du vote:', error);
            voteLimitMessage.textContent = "Une erreur est survenue lors de la communication avec le serveur. Veuillez réessayer. Détail: " + error.message;
            voteLimitMessage.style.display = 'block';
            voteLimitMessage.style.color = "red";
            btnVoter.disabled = false; // Réactiver le bouton si erreur
        }
    }

    // Attacher l'écouteur d'événement au bouton de vote
    if (btnVoter) {
        btnVoter.addEventListener('click', submitVote);
    } else {
        console.error("Le bouton 'btnVoter' n'a pas été trouvé. Vérifiez son ID.");
    }

    // Rendre l'interface au chargement de la page
    renderCandidats();

    // DÉBUT DES MODIFICATIONS POUR LA DATE
    // Localiser l'élément P contenant le texte et mettre à jour la date
    const resultsInfoTextElement = document.querySelector('.results-information-section .results-text-style strong');
    if (resultsInfoTextElement) {
        resultsInfoTextElement.textContent = "au plus tard le 08 Août 2025";
    }

    // S'assurer que la section des résultats est bien présente et mise à jour
    const resultsInfo = document.createElement('div');
    resultsInfo.classList.add('results-information-section');
    resultsInfo.innerHTML = `
        <p class="results-text-style">
            Les résultats du vote seront disponibles officiellement le <strong>au plus tard le 08 Août 2025</strong>.
            Nous vous remercions pour votre participation.
        </p>
    `;
    if (candidatsListContainer) {
        const existingResultsInfo = candidatsListContainer.parentNode.querySelector('.results-information-section');
        if (existingResultsInfo) {
            // Si la section existe déjà, mettez simplement à jour son contenu (au cas où elle ne le serait pas par le sélecteur `strong`)
            existingResultsInfo.innerHTML = resultsInfo.innerHTML;
        } else {
            // Sinon, insérez la nouvelle section (cela ne devrait pas arriver avec votre HTML actuel si l'élément parent est correct)
            candidatsListContainer.parentNode.insertBefore(resultsInfo, btnVoter.parentNode);
        }
    }
    // FIN DES MODIFICATIONS POUR LA DATE

});





