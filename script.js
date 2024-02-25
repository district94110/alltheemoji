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
    const size = 128; // Adjust size as needed
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white"; // Optional: Fill background to improve color calculation
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textBaseline = "top";
    ctx.font = `${size}px Arial`; // Adjust font size and family as needed
    ctx.fillText(emoji, 0, 0);

    const imageData = ctx.getImageData(0, 0, size, size);
    let total = { r: 0, g: 0, b: 0, count: 0 };

    for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] > 0) {
            // Ignore fully transparent pixels
            total.r += imageData.data[i];
            total.g += imageData.data[i + 1];
            total.b += imageData.data[i + 2];
            total.count++;
        }
    }

    if (total.count === 0) return; // If no pixels were analyzed, exit the function

    const average = {
        r: total.r / total.count,
        g: total.g / total.count,
        b: total.b / total.count
    };

    const lighterColor = `rgb(${Math.min(255, average.r + 100)}, ${Math.min(
        255,
        average.g + 100
    )}, ${Math.min(255, average.b + 100)})`;
    emojiDiv.style.backgroundColor = lighterColor;
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
