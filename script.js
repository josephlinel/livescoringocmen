// Configuration Firebase (à remplacer par vos informations Firebase)
const firebaseConfig = {
    apiKey: "VOTRE_API_KEY",
    authDomain: "votre-projet.firebaseapp.com",
    databaseURL: "https://votre-projet.firebaseio.com",
    projectId: "votre-projet-id",
    storageBucket: "votre-projet.appspot.com",
    messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
    appId: "VOTRE_APP_ID"
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const scoresRef = database.ref('scores');

// Ajouter un score
const form = document.getElementById('scoreForm');
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const playerData = document.getElementById('player').value.split(' ');
    const player = playerData[0];
    const nationality = playerData[1];
    const round = document.getElementById('round').value;
    const hole = document.getElementById('hole').value;
    const score = parseInt(document.getElementById('score').value);

    // Ajouter le score à Firebase
    scoresRef.push({
        joueur: player,
        nationalite: nationality,
        round: round,
        trou: hole,
        score: score
    });

    // Réinitialiser le formulaire
    form.reset();
});

// Afficher les scores en temps réel
scoresRef.on('value', (snapshot) => {
    const scoreTable = document.getElementById('scoreTable');
    let scoresArray = [];

    snapshot.forEach((scoreSnapshot) => {
        const scoreData = scoreSnapshot.val();
        scoresArray.push(scoreData);
    });

    // Trier les scores
    scoresArray.sort((a, b) => a.score - b.score);

    // Afficher les scores triés
    scoreTable.innerHTML = '';
    scoresArray.forEach((scoreData) => {
        const scoreClass = scoreData.score === 0 ? 'score-par' :
                           scoreData.score < 0 ? 'score-under-par' : 'score-over-par';

        const newRow = `
            <tr>
                <td>${scoreData.joueur}</td>
                <td>${scoreData.nationalite}</td>
                <td>${scoreData.round}</td>
                <td>${scoreData.trou}</td>
                <td class="${scoreClass}">${scoreData.score}</td>
            </tr>
        `;
        scoreTable.innerHTML += newRow;
    });
});
