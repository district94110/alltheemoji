// emojiWorker.js
self.addEventListener(
    "message",
    function (e) {
        const { emoji, size } = e.data;
        const canvas = new OffscreenCanvas(size, size);
        const ctx = canvas.getContext("2d");

        ctx.textBaseline = "top";
        ctx.font = `${size}px Arial`;
        ctx.fillText(emoji, 0, 0);

        const imageData = ctx.getImageData(0, 0, size, size);
        const colorCounts = {};
        let maxCount = 0;
        let dominantColor = null;

        for (let i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i + 3] > 0) {
                const color = `${imageData.data[i]}-${imageData.data[i + 1]}-${
                    imageData.data[i + 2]
                }`;
                colorCounts[color] = (colorCounts[color] || 0) + 1;
                if (colorCounts[color] > maxCount) {
                    maxCount = colorCounts[color];
                    dominantColor = color;
                }
            }
        }

        if (dominantColor) {
            const [r, g, b] = dominantColor
                .split("-")
                .map((n) => parseInt(n, 10));
            // Send the dominant color back to the main thread
            self.postMessage({ emoji, color: `rgba(${r}, ${g}, ${b}, 0.2)` });
        }
    },
    false
);
