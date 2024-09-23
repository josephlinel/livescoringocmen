// Configuration Firebase (remplacer par les infos de ton projet)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialiser Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Soumettre les scores
document.getElementById('scoreForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Empêche le rechargement de la page

    // Récupérer les valeurs du formulaire
    const playerName = document.getElementById('player').value;
    const hole = parseInt(document.getElementById('hole').value);
    const round = parseInt(document.getElementById('round').value);
    const score = parseInt(document.getElementById('score').value);

    // Vérifier si les informations sont correctes
    if (!playerName || isNaN(hole) || isNaN(round) || isNaN(score)) {
        alert("Veuillez remplir tous les champs correctement.");
        return;
    }

    // Enregistrer les scores dans Firebase
    firebase.database().ref('scores/' + playerName + '/round' + round + '/hole' + hole).set(score)
        .then(() => {
            console.log("Score enregistré avec succès !");
        })
        .catch((error) => {
            console.error("Erreur lors de l'enregistrement du score :", error);
        });

    // Réinitialiser le formulaire après soumission
    document.getElementById('scoreForm').reset();
});

// Fonction pour mettre à jour le tableau des scores en temps réel
function updateScoreboard() {
    const tbody = document.querySelector('#liveScores tbody');
    tbody.innerHTML = '';  // Vider le tableau

    // Récupérer les scores depuis Firebase en temps réel
    firebase.database().ref('scores').on('value', (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            console.log("Aucun score disponible");
            return;
        }

        const playerTotals = Object.keys(data).map(player => {
            let totalScore = 0;
            let lastRound = 0;

            // Calculer le score total par joueur et par round
            Object.keys(data[player]).forEach(round => {
                Object.values(data[player][round]).forEach(holeScore => {
                    totalScore += holeScore;
                });
                lastRound = round;  // Mettre à jour le dernier round
            });

            return { player, totalScore, lastRound };
        });

        // Trier les joueurs par score total (le plus bas d'abord)
        playerTotals.sort((a, b) => a.totalScore - b.totalScore);

        // Afficher les scores dans le tableau
        playerTotals.forEach((playerData, index) => {
            const row = document.createElement('tr');

            // Déterminer la couleur du score en fonction de la valeur
            let scoreColor = 'black';
            if (playerData.totalScore < 0) {
                scoreColor = 'red';
            } else if (playerData.totalScore === 0) {
                scoreColor = 'green';
            }

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${playerData.player}</td>
                <td style="color:${scoreColor}">${playerData.totalScore}</td>
                <td>Round ${playerData.lastRound}</td>
            `;
            tbody.appendChild(row);
        });
    });
}

// Appeler la fonction pour mettre à jour le tableau des scores dès qu'il y a un changement dans Firebase
updateScoreboard();
