            Object.values(data[player][round]).forEach(holeData => {
                    totalScore += holeData.score;  // Somme des scores
                });
                lastRound = round;  // Dernier round
            });

            // Ajouter les données du joueur au tableau
            playerTotals.push({ player, totalScore, lastRound });
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
