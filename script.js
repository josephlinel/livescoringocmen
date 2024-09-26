// Function to open a tab
function openTab(evt, tabName) {
    var i, content, tablinks;
    content = document.getElementsByClassName("content");
    for (i = 0; i < content.length; i++) {
        content[i].style.display = "none";
        content[i].classList.remove("active");
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// Array to hold scores
var scores = [];

function addScore() {
    var playerSelect = document.getElementById("playerSelect");
    var scoreInput = document.getElementById("scoreInput").value;
    var playerName = playerSelect.options[playerSelect.selectedIndex].text;

    if (!playerSelect.value || scoreInput === "") {
        alert("Please select a player and enter a score.");
        return;
    }

    // Add score to the array
    scores.push({ player: playerName, score: parseInt(scoreInput) });

    // Sort scores
    scores.sort((a, b) => a.score - b.score);

    // Reset the table
    var tableBody = document.querySelector("#rankingTable tbody");
    tableBody.innerHTML = "";

    // Display the updated ranking
    scores.forEach(function (item) {
        var row = document.createElement("tr");
        var playerCell = document.createElement("td");
        playerCell.textContent = item.player;
        var scoreCell = document.createElement("td");
        scoreCell.textContent = item.score;
        scoreCell.className = "score " + (item.score < 0 ? "negative" : item.score === 0 ? "neutral" : "positive");
        row.appendChild(playerCell);
        row.appendChild(scoreCell);
        tableBody.appendChild(row);
    });

    // Reset input fields
    document.getElementById("scoreInput").value = "";
    playerSelect.value = "";
}
