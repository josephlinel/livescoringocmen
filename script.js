   // Connexion au serveur Socket.IO
const socket = io('http://localhost:3000');

// Fonction pour déterminer la classe de couleur en fonction du score par rapport au par
function getScoreClass(score) {
    if (score < 0) {
        return 'under-par';
    } else if (score === 0) {
        return 'par';
    } else {
        return 'over-par';
    }
}

// Gérer la soumission du formulaire pour envoyer les scores au serveur
document.getElementById('scoreForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupérer les valeurs du formulaire
    const player = document.getElementById('player').value;
    const round = document.getElementById('round').value;
    const hole = document.getElementById('hole').value;
    const score = document.getElementById('score').value;

    // Envoi des données au serveur via Socket.IO
    socket.emit('submit_score', {
        player_name: player,
        nationality: player.includes('🇲🇦') ? '🇲🇦' :
                     player.includes('🇬🇧') ? '🇬🇧' :
                     player.includes('🇲🇽') ? '🇲🇽' :
                     player.includes('🇺🇸') ? '🇺🇸' :
                     player.includes('🇦🇺') ? '🇦🇺' :
                     player.includes('🇩🇪') ? '🇩🇪' :
                     player.includes('🇿🇦') ? '🇿🇦' :
                     '🇫🇷', // Récupération du drapeau
        score: parseInt(score),
        hole_number: parseInt(hole)
    });

    // Réinitialiser le formulaire après soumission
    document.getElementById('scoreForm').reset();
});

// Écouteur pour recevoir les scores en temps réel
socket.on('new_score', function(data) {
    const scoreTable = document.getElementById('scoreTable');
    const newRow = document.createElement('tr');
    
    // Création des cellules avec les informations du score
    newRow.innerHTML = `
        <td>${data.player_name}</td>
        <td>${data.nationality}</td>
        <td class="${getScoreClass(data.score)}">${data.score}</td>
        <td>${data.hole_number}</td>
    `;

    // Ajout de la nouvelle ligne au tableau
    scoreTable.appendChild(newRow);
});
