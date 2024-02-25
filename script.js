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

function setEmojiBackground(emoji, emojiDiv) {
    const canvas = document.createElement("canvas");
    const size = 128; // Size for the canvas
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "top";
    ctx.font = `${size}px Arial`;
    ctx.fillText(emoji, 0, 0);

    const imageData = ctx.getImageData(0, 0, size, size);
    const colorCounts = {}; // Object to hold color frequency
    let maxCount = 0;
    let dominantColor = null;

    for (let i = 0; i < imageData.data.length; i += 4) {
        // Skip transparent pixels
        if (imageData.data[i + 3] > 0) {
            const color = `${imageData.data[i]}-${imageData.data[i + 1]}-${
                imageData.data[i + 2]
            }`;
            colorCounts[color] = (colorCounts[color] || 0) + 1;

            if (colorCounts[color] >= maxCount) {
                maxCount = colorCounts[color];
                dominantColor = color;
            }
        }
    }

    if (dominantColor) {
        const [r, g, b] = dominantColor.split("-").map((n) => parseInt(n, 10));
        // Adjust the color to be lighter if needed
        const lighterColor = `rgb(${Math.min(255, r + 200)}, ${Math.min(
            255,
            g + 200
        )}, ${Math.min(255, b + 200)})`;
        emojiDiv.style.backgroundColor = lighterColor;
    }
}

function displayEmojis(emojis) {
    const container = document.getElementById("emojiContainer");
    container.innerHTML = ""; // Clear previous emojis
    emojis.forEach(({ emoji, name }) => {
        const emojiBox = document.createElement("div");
        emojiBox.className = "emoji-box";
        emojiBox.innerHTML = `<div class="emoji">${emoji}</div><div class="emoji-name">${name}</div>`;
        container.appendChild(emojiBox);

        // Set background color based on the emoji
        setEmojiBackground(emoji, emojiBox);

        // Add event listeners for other interactions (e.g., copying to clipboard)
        emojiBox.addEventListener("click", function () {
            navigator.clipboard
                .writeText(emoji)
                .then(() => {
                    // Implement the copy feedback mechanism here
                })
                .catch((err) =>
                    console.error("Error copying emoji to clipboard", err)
                );
        });
    });
}
