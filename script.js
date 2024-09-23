// Initialiser les joueurs
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

// Écouter l'événement pour soumettre les scores
document.getElementById('scoreForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Récupérer les valeurs du formulaire
    const playerName = document.getElementById('player').value;
    const hole = parseInt(document.getElementById('hole').value);
    const round = parseInt(document.getElementById('round').value);
    const score = parseInt(document.getElementById('score').value);

    // Vérifier si le joueur existe
    if (players[playerName]) {
        if (!players[playerName][round]) {
            players[playerName][round] = [];
        }
        players[playerName][round].push(score);
    } else {
        alert("Player not found!");
        return;
    }

    // Réinitialiser le formulaire après soumission
    document.getElementById('scoreForm').reset();

    // Mettre à jour le tableau des scores
    updateScoreboard(round, hole);

    // Lancer le rafraîchissement de la page après 60 secondes
    setTimeout(function() {
        location.reload(); // Recharge la page après 60 secondes
    }, 60000); // 60 000 ms = 60 secondes
});

// Fonction pour mettre à jour le tableau des scores
function updateScoreboard(round, hole) {
    const tbody = document.querySelector('#liveScores tbody');
    tbody.innerHTML = ''; // Vider le tableau actuel

    // Calculer les scores totaux des joueurs
    const playerTotals = Object.keys(players).map(player => {
        let totalScore = 0;
        let lastRound = round;
        for (let i = 1; i <= round; i++) {
            if (players[player][i]) {
                totalScore += players[player][i].reduce((a, b) => a + b, 0);
            }
        }
        return { player, totalScore, lastRound, lastHole: hole };
    });

    // Trier les joueurs par leur score total (le plus bas d'abord)
    playerTotals.sort((a, b) => a.totalScore - b.totalScore);

    // Afficher le classement et les scores
    playerTotals.forEach((player, index) => {
        const row = document.createElement('tr');

        // Déterminer la couleur du score en fonction de la valeur
        let scoreColor = 'black';
        if (player.totalScore < 0) {
            scoreColor = 'red';
        } else if (player.totalScore === 0) {
            scoreColor = 'green';
        }

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.player}</td>
            <td style="color:${scoreColor}">${player.totalScore}</td>
            <td>Round ${player.lastRound}</td>
            <td>After hole ${player.lastHole}</td>
        `;
        tbody.appendChild(row);
    });
}
