document.addEventListener("DOMContentLoaded", function () {
    fetch("emojis.txt")
        .then((response) => response.text())
        .then((data) => {
            const emojis = data.split("\n").map((line) => {
                const [emoji, name] = line.split(",");
                return { emoji, name };
            });
            displayEmojis(emojis);
        });

    const searchInput = document.getElementById("emojiSearch");
    searchInput.addEventListener("input", function () {
        const searchValue = this.value.toLowerCase();
        const filteredEmojis = emojis.filter((emoji) =>
            emoji.name.includes(searchValue)
        );
        displayEmojis(filteredEmojis);
    });
});

function displayEmojis(emojis) {
    const container = document.getElementById("emojiContainer");
    container.innerHTML = "";
    emojis.forEach(({ emoji, name }) => {
        const emojiBox = document.createElement("div");
        emojiBox.className = "emoji-box";
        emojiBox.innerHTML = `<div class="emoji">${emoji}</div><div class="emoji-name">${name}</div>`;
        container.appendChild(emojiBox);
    });
}
