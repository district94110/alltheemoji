// Initialize the Web Worker
let emojiWorker;
if (window.Worker) {
    emojiWorker = new Worker("emojiWorker.js");

    emojiWorker.addEventListener("message", function (e) {
        const { emoji, color } = e.data;
        // Find the emoji div by emoji character and set the background color
        const emojiDivs = document.querySelectorAll(".emoji-box");
        emojiDivs.forEach((div) => {
            if (div.querySelector(".emoji").textContent === emoji) {
                div.style.backgroundColor = color;
            }
        });
    });
}

function displayEmojis(emojis) {
    const container = document.getElementById("emojiContainer");
    container.innerHTML = ""; // Clear previous emojis
    emojis.forEach(({ emoji, name }) => {
        const emojiBox = document.createElement("div");
        emojiBox.className = "emoji-box";
        emojiBox.innerHTML = `<div class="emoji">${emoji}</div><div class="emoji-name">${name}</div>`;
        container.appendChild(emojiBox);

        // Send emoji to the Web Worker for background color processing
        if (emojiWorker) {
            emojiWorker.postMessage({ emoji, size: 128 });
        }

        // Existing click event listener to copy emoji
        emojiBox.addEventListener("click", function () {
            navigator.clipboard
                .writeText(emoji)
                .then(() => {
                    // Copy feedback mechanism (e.g., show/hide a popup)
                })
                .catch((err) =>
                    console.error("Error copying emoji to clipboard", err)
                );
        });
    });
}

let emojis = []; // Ensure emojis is accessible globally

document.addEventListener("DOMContentLoaded", function () {
    fetch("unique_emojis.txt")
        .then((response) => response.text())
        .then((data) => {
            emojis = data
                .split("\n")
                .filter((line) => line.trim() !== "")
                .map((line) => {
                    const parts = line.split("|");
                    // Ensure that both emoji and name exist; use a placeholder if necessary
                    const emoji = parts[0].trim();
                    const name =
                        parts.length > 1 ? parts[1].trim() : "Unnamed Emoji";
                    return { emoji, name };
                });
            displayEmojis(emojis);
            attachSearchListener(); // Attach the search listener only after emojis are loaded
        });
});

document
    .getElementById("randomizeButton")
    .addEventListener("click", function () {
        // Shuffle the emojis array
        emojis = shuffleArray(emojis);
        // Display the shuffled emojis
        displayEmojis(emojis);
    });

// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

function attachSearchListener() {
    const searchInput = document.getElementById("emojiSearch");
    searchInput.addEventListener("input", function () {
        const searchValue = this.value.toLowerCase();
        const filteredEmojis = emojis.filter(
            (emoji) =>
                emoji.name && emoji.name.toLowerCase().includes(searchValue)
        );
        displayEmojis(filteredEmojis);
    });
}

/*function displayEmojis(emojis) {
    const container = document.getElementById("emojiContainer");
    container.innerHTML = ""; // Clear previous content
    emojis.forEach(({ emoji, name }) => {
        const emojiBox = document.createElement("div");
        emojiBox.className = "emoji-box";
        emojiBox.innerHTML = `<div class="emoji">${emoji}</div><div class="emoji-name">${name}</div>`;

        container.appendChild(emojiBox);

        // Add click event listener to copy emoji and show popup
        emojiBox.addEventListener("click", function () {
            navigator.clipboard
                .writeText(emoji)
                .then(() => {
                    // Show popup
                    const popup = document.getElementById("copyPopup");
                    popup.className = "copy-popup fade-in";

                    // Hide popup after 2 seconds
                    setTimeout(() => {
                        popup.className = "copy-popup fade-out";
                    }, 2000);
                })
                .catch((err) =>
                    console.error("Error copying emoji to clipboard", err)
                );
        });
    });
}*/
