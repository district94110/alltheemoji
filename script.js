let emojis = []; // Ensure emojis is accessible globally

document.addEventListener("DOMContentLoaded", function () {
    fetch("emojis.txt")
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

function displayEmojis(emojis) {
    const container = document.getElementById("emojiContainer");
    container.innerHTML = ""; // Clear previous content
    emojis.forEach(({ emoji, name }) => {
        const emojiBox = document.createElement("div");
        emojiBox.className = "emoji-box";
        emojiBox.innerHTML = `<div class="emoji">${emoji}</div><div class="emoji-name">${name}</div><div class="tooltip">Copied to clipboard</div>`;

        container.appendChild(emojiBox);

        // Add click event listener to show tooltip and copy emoji
        emojiBox.addEventListener("click", function () {
            const tooltip = this.querySelector(".tooltip");
            navigator.clipboard
                .writeText(emoji)
                .then(() => {
                    tooltip.style.visibility = "visible";
                    tooltip.style.opacity = "1";
                    setTimeout(() => {
                        tooltip.style.opacity = "0";
                        tooltip.style.visibility = "hidden";
                    }, 2000); // Hide tooltip after 2 seconds
                })
                .catch((err) =>
                    console.error("Error copying emoji to clipboard", err)
                );
        });
    });
}
