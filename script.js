document.addEventListener('DOMContentLoaded', () => {
    const identifiantSelect = document.getElementById('identifiant');
    const passwordInput = document.getElementById('password');
    const btnConnecter = document.getElementById('btnConnecter');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const matchMessage = document.getElementById('matchMessage');

    // Empêcher le retour arrière sur cette page d'authentification elle-même une fois qu'on y est
    history.replaceState(null, document.title, location.href);
    window.addEventListener('popstate', function (event) {
        history.replaceState(null, document.title, location.href);
    });

    // Liste des utilisateurs et de leurs mots de passe
    const utilisateurs = [
        { id: '007 - RANDRIANANDRASANA Daudet Emilien', mdp: 'D8JS' },
        { id: '012 - ANDZANATIORA Sanda Sitraka', mdp: '3UXC' },
        { id: '018 - RALAIAVY STEPHANOEL GUEL', mdp: 'RA9S' },
        { id: '028 - FRANCOIS Edouard', mdp: '7R5X' },
        { id: '031 - GLADIA Alverson Antoine', mdp: 'UAR3' },
        { id: '033 - DIASY Jean Bonhôte', mdp: 'NM2D' },
        { id: '037 - RANDRIAMAMPIONONA Hajatiana Aristide', mdp: 'MAN9' },
        { id: '039 - ANDRIANAROVANDRAZANY Bargass Mon Désir', mdp: '8ZQZ' },
        { id: '043 - TOVONDRAINY Danielson', mdp: 'K3UP' },
        { id: '046 - MANANTSOA Joslin Rigobert', mdp: 'FZ2F' },
        { id: '052 - RENGY Thierry', mdp: 'G0QW' },
        { id: '056 - RAMIANDRISOA Toky Mamy', mdp: 'M4DX' },
        { id: '058 - NAMBININJANAHARY Ali Martial Léonce', mdp: 'C9HT' },
        { id: '061 - JEAN MARIE Adolphe', mdp: 'ULM5' },
        { id: '068 - HERINTOKY Christian Robinson', mdp: 'L2BE' },
        { id: '070 - RAMAKASOANIRINA Vonintsoanandraina', mdp: '7YNP' },
        { id: '073 - RAKOTONANAHARY Jérôme', mdp: '4WDN' },
        { id: '076 - EHODA Jean Claude', mdp: 'T1UN' },
        { id: '082 - NOMENJANAHARY Prosper Rolland', mdp: 'TGP4' },
        { id: '084 - RAVAOAVY Jean Claude', mdp: 'QYQ6' },
        { id: '090 - TOVONDRAZANY Anselme Elson Anivo', mdp: 'RV4A' },
        { id: '092 - RAZAFIMAHEFA Duca', mdp: 'V6YD' },
        { id: '094 - RAHARIMALALA Stéphan Selman', mdp: 'GD1Z' },
        { id: '095 - ARIA LOROSA PROSPER', mdp: 'FF0Z' },
        { id: '109 - MELODE', mdp: '2KPD' },
        { id: '117 - RAHARISOA Nomejanahary', mdp: 'P7CC' },
        { id: '118 - STEPHAN Manisokely', mdp: 'R4CC' },
        { id: '119 - RABENAMBININA Maurizios', mdp: '1KE6' },
        { id: '123 - ANDRIANANTENAINA Marolahy', mdp: '59NB' },
        { id: '134 - TODISOA Richard Tsimanevoke Christophe', mdp: '9RZN' },
        { id: '135 - LOVA Jean Ferdinand', mdp: 'DG4F' },
        { id: '137 - FARALAHY Tsiraty Ninokely', mdp: '9RG2' },
        { id: '139 - RAZAFINDRASOA Florentine', mdp: 'V2WX' },
        { id: '142 - TAVONGY Arnaud', mdp: 'NU5M' },
        { id: '147 - ROMUALD Christophe Germain', mdp: '9XJO' },
        { id: '164 - SAMBILAHY Tsimafaitsy Honoré', mdp: 'VF99' },
        { id: '165 - THEODORE Dépè Téléphère', mdp: 'YLB7' },
        { id: '175 - MASINANDRO Theodore Felix', mdp: 'BSH4' },
        { id: '185 - KAMBETA Roméo Brunel', mdp: '67SH' },
        { id: '186 - TSIAMBARAKOAZY Brutal Gaspard', mdp: 'BP7Z' },
        { id: '188 - RAOELISON Patrick', mdp: '2XYT' },
        { id: '190 - RAZAFIMANANTSOA Sambandraibe Ely Gabriel', mdp: 'U3DR' },
        { id: '193 - TAHINDRAZANY Jean Albertinie', mdp: 'QZ6Q' },
        { id: '199 - RATOVONIRINA Kely Robuson', mdp: 'ER8D' },
        { id: '207 - BONAVENTURE Razy', mdp: 'LE4R' },
        { id: '212 - MIAMBY Brusto', mdp: 'SZ2C' },
        { id: '213 - RALISOA Chrétienne', mdp: '74EX' },
        { id: '220 - HASSAN Léonard', mdp: 'HAM7' },
        { id: '227 - RAMAHAVELO Jean Luc', mdp: 'U6VC' },
        { id: '229 - RANAIVO Riantsoa Lauriane', mdp: '6ZSA' },
        { id: '231 - KALO Ulrich', mdp: 'F8UR' },
        { id: '233 - MAHALASITSE Minardin', mdp: 'KZV5' },
        { id: '236 - RANDRIANANTOANDRO Driquaire ', mdp: 'WP3L' },
        { id: '258 - TOVONIAINA Jean Marcellin', mdp: 'X7GG' },
        { id: '259 - TSIRAFESY Elgif César', mdp: 'YQ8W' },
        { id: '260 - RAZAFIARIMANANA Paul Sylla', mdp: 'ROA8' },
        { id: '261 - ANDRINDRAZANY Duodoland Emmanuel', mdp: 'JY6R' },
        { id: '268 - RALAIMANAHIRANA Dédes', mdp: 'ZE9U' },
        { id: '280 - ANDRIANAHY Tohimahery Manantena', mdp: 'UR8A' },
        { id: '285 - RAZAFIDONAHARINARIVO Marc Anthony', mdp: '4DJB' },
        { id: '303 - CEDRIC Asaly', mdp: '5WJX' },
        { id: '307 - HERIMANITRA Paul Bonheur François', mdp: 'DB2X' },
        { id: '308 - TOVOSOA Tohandrainy', mdp: 'WM4N' },
        { id: '309 - RAVAOAVY Soafiavy Pièrre', mdp: 'YQ8E' },
        { id: '310 - RAFIDINIRINA Raphael', mdp: 'ZQ5P' },
        { id: '313 - MIANDRISOA Georges Aimé', mdp: 'E2VV' },
        { id: '317 - TOVONIRINA Ando', mdp: 'WV2U' },
        { id: '318 - RAHENIARIJAONA Jean Christian Angelo', mdp: 'S0XW' },
        { id: '319 - MANAHIRANTSOA Evariste', mdp: 'RYZ8' },
        { id: '321 - RAZAFY Tsialonina', mdp: 'AWC8' },
        { id: '323 - TOLOJANAHARY Sébastien', mdp: '89PU' },
        { id: '328 - TSANARA Estack Danie', mdp: '4XU6' },
        { id: '338 - RAZAFINDRANORO Chatelin Kenedy', mdp: '0EQG' },
        { id: '339 - FANAMPINDRAINY Borello Marcel', mdp: 'DVO4' },
        { id: '341 - MICHEL Chrisologue Soave', mdp: '9NUB' },
        { id: '342 - RASOANIRINA Nathalie', mdp: 'BSE4' },
        { id: '343 - NANTENAINA Jean Bien Venu Cornelle', mdp: 'P4PG' },
        { id: '344 - TIARAY Thomas', mdp: 'Z8RU' },
        { id: '346 - BETSIAHILIKA Ludovic', mdp: '3EEZ' },
        { id: '349 - RAZANAN-DRABE Elmine Stéphanie', mdp: 'G94F' },
        { id: '354 - MENDRIDAZA Digastin', mdp: '8XGD' },
        { id: '356 - NOVATIANA Léa Henricia', mdp: '8ZPA' },
        { id: '357 - RENAUD RODDY Maurelle', mdp: '905G' },
        { id: '358 - VAOHITA Jean Marie Vianney', mdp: '94Y4' },
        { id: '359 - JESSICA Tsanahia', mdp: '9H4B' },
        { id: '360 - RANDRIANANTENAINA Alain John', mdp: '9HDV' },
        { id: '361 - HOVAMARINA Isabelle Rancia Jonary', mdp: '9N5W' },
        { id: '362 - TSIPY TAHY Mychée Richard', mdp: '9OI7' },
        { id: '363 - GEOVIN', mdp: '9PNM' },
        { id: '364 - RABE Jean Rodrigue', mdp: '9S0P' },
        { id: '365 - TOVONAY Julien', mdp: '9V30' },
        { id: '366 - ROBERTOT Jean Robuste', mdp: '9WGN' },
        { id: '367 - RAKOTONDRADONA Heriniaina Jean Franco', mdp: 'A1MO' },
    ];

    // --- NOUVEAUTÉ : Récupérer la liste des utilisateurs qui ont déjà voté ---
    const votedUsers = JSON.parse(localStorage.getItem('votedUsers')) || [];
    // --- FIN NOUVEAUTÉ ---

    function peuplerIdentifiants() {
        if (!identifiantSelect) return;

        identifiantSelect.innerHTML = '<option value="">Sélectionnez votre identifiant</option>';
        utilisateurs.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            let displayId = user.id;

            // --- NOUVEAUTÉ : Afficher "(a déjà voté)" et désactiver l'option ---
            if (votedUsers.includes(user.id)) {
                displayId += " (a déjà voté)";
                option.disabled = true; // Désactiver l'option dans le menu déroulant
                option.style.fontStyle = 'italic';
                option.style.color = '#888';
            }
            // --- FIN NOUVEAUTÉ ---

            option.textContent = displayId;
            identifiantSelect.appendChild(option);
        });
    }

    peuplerIdentifiants();

    function checkMatch() {
        const identifiantSaisi = identifiantSelect.value;
        const motDePasseSaisi = passwordInput.value;

        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        matchMessage.style.display = 'none';

        let isMatch = false;

        if (identifiantSaisi !== "" && motDePasseSaisi.length > 0) {
            const utilisateurTrouve = utilisateurs.find(user => user.id === identifiantSaisi);

            if (utilisateurTrouve && utilisateurTrouve.mdp === motDePasseSaisi) {
                // --- NOUVEAUTÉ : Vérifier si l'utilisateur a déjà voté APRES que le mot de passe soit correct ---
                if (votedUsers.includes(utilisateurTrouve.id)) {
                    matchMessage.textContent = "Cet identifiant a déjà voté.";
                    matchMessage.style.color = "orange"; // Indique un statut "spécial"
                    matchMessage.style.display = 'block';
                    isMatch = false; // Ne permet PAS la connexion si déjà voté
                } else {
                    matchMessage.textContent = "Identifiant et mot de passe correspondent.";
                    matchMessage.style.color = "green";
                    matchMessage.style.display = 'block';
                    isMatch = true;
                }
                // --- FIN NOUVEAUTÉ ---
            } else {
                matchMessage.textContent = "Mot de passe incorrect.";
                matchMessage.style.color = "red";
                matchMessage.style.display = 'block';
            }
        }

        if (btnConnecter) {
            btnConnecter.disabled = !isMatch;
        }
    }

    identifiantSelect.addEventListener('change', checkMatch);
    passwordInput.addEventListener('input', checkMatch);

    checkMatch(); // Appel initial pour définir l'état du bouton

    const authForm = document.getElementById('authForm');
    if (authForm && btnConnecter && identifiantSelect && passwordInput && errorMessage && successMessage && matchMessage) {
        authForm.addEventListener('submit', (event) => {
            event.preventDefault();

            checkMatch(); // Vérifier une dernière fois l'état d'authentification et de vote

            // --- NOUVEAUTÉ : Empêcher la soumission si le bouton est désactivé (incluant "a déjà voté") ---
            if (btnConnecter.disabled) {
                console.log("Soumission bloquée : Identifiant/Mot de passe invalide ou utilisateur a déjà voté.");
                return;
            }
            // --- FIN NOUVEAUTÉ ---

            const identifiantSaisi = identifiantSelect.value;
            const motDePasseSaisi = passwordInput.value;

            const utilisateurTrouve = utilisateurs.find(user => user.id === identifiantSaisi && user.mdp === motDePasseSaisi);

            // Double vérification, au cas où l'état du bouton aurait été manipulé ou une race condition
            if (utilisateurTrouve && !votedUsers.includes(utilisateurTrouve.id)) { // Assurer qu'il n'a pas déjà voté
                successMessage.textContent = "Authentification réussie. Redirection...";
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                matchMessage.style.display = 'none';

                const parts = utilisateurTrouve.id.split(' - ');
                const userName = parts.length > 1 ? parts[1] : utilisateurTrouve.id;

                localStorage.setItem('loggedInUserId', utilisateurTrouve.id);
                localStorage.setItem('loggedInUserName', userName);

                // Cette ligne utilise déjà window.location.replace()
                // pour empêcher le retour à la page d'authentification.
                window.location.replace('intermediate_page.html');
            } else {
                // Si l'utilisateur n'est pas trouvé ou s'il a déjà voté
                if (votedUsers.includes(identifiantSaisi)) {
                    errorMessage.textContent = "Cet identifiant a déjà voté. Vous ne pouvez plus vous connecter.";
                } else {
                    errorMessage.textContent = "Identifiant ou mot de passe incorrect. Veuillez réessayer.";
                }
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
                matchMessage.style.display = 'none';
                btnConnecter.disabled = true; // Assurer que le bouton est désactivé
                console.log("Échec de connexion ou vote déjà effectué pour :", identifiantSaisi);
            }
        });
    } else {
        console.error("Un ou plusieurs éléments HTML nécessaires au script d'authentification n'ont pas été trouvés. Vérifiez les IDs.");
    }
});