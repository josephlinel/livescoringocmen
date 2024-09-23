// Configuration Firebase
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

// Initialiser les joueurs (ceci est utilisé pour le stockage local avant l'envoi à Firebase)
let players = {
    "Dominic Morton": [],
    "Adam Bresnu": [],
    "Chase Williams": [],
    "Joseph Linel": [],
    "Gianni Perilli": [],
    "Reda El Hali": [],
    "Ken Gao": [],
    "Dian": [],
    "Corley": [],
    "Jorge de la Caba": []
};

// Écouter l'événement de soumission du formulaire de score
document.getElementById('scoreForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Empêche le rechargement de la page

    // Récupérer les valeurs du formulaire
    const playerName = document.getElementById('player').value;
    const hole = parseInt(document.getElementById('hole').value);
    const round = parseInt(document.getElementById('round').value);
    const score = parseInt(document.getElementById('score').value);

    // Vérifier si le joueur existe dans la liste
    if (players[playerName]) {
        if (!players[playerName][round]) {
            players[playerName][round] = [];
        }
        players[playerName][round].push(score);

        // Enregistrer les scores dans Firebase
        firebase.database().ref('scores/' + playerName).set(players[playerName]);

    } else {
        alert("Joueur introuvable !");
        return;
    }

    // Réinitialiser le formulaire
    document.getElementById('scoreForm').reset();
});

// Fonction pour mettre à jour le tableau des scores en direct
function updateScoreboard() {
    const tbody = document.querySelector('#liveScores tbody');
    tbody.innerHTML = ''; // Vider le tableau pour réafficher les nouvelles données

    // Récupérer les scores depuis Firebase en temps réel
    firebase.database().ref('scores').on('value', (snapshot) => {
        const data = snapshot.val();  // Récupérer les données de Firebase

        const playerTotals = Object.keys(data).map(player => {
            let totalScore = 0;
            let lastRound = 0;

            // Calculer le score total par joueur
            Object.keys(data[player]).forEach(round => {
                totalScore += data[player][round].reduce((a, b) => a + b, 0);
                lastRound = round;  // Mettre à jour le dernier round joué
            });

            return { player, totalScore, lastRound };
        });

        // Trier les joueurs par leur score total (le plus bas d'abord)
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

// Mettre à jour le tableau des scores dès qu'il y a un changement dans Firebase
updateScoreboard();
