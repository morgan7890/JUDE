const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

const youtubeApiKey = "YOUR_YOUTUBE_API_KEY"; // Replace with your API key

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Middleware to parse JSON request bodies

// --- Real /api/search Route ---
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Search query is required." });
  }

  const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${youtubeApiKey}`;

  try {
    const response = await axios.get(youtubeApiUrl);
    const items = response.data.items;

    if (items && items.length > 0) {
      const video = items[0]; // Get the first result
      const videoDetails = {
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        channel: video.snippet.channelTitle,
        duration: "Unknown", // You might want to fetch this separately if needed
        views: "Unknown", // You might want to fetch this separately if needed
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      };

      res.json(videoDetails);
    } else {
      res.status(404).json({ error: "No results found." });
    }
  } catch (error) {
    console.error("Error during YouTube search:", error);
    res.status(500).json({ error: "Failed to perform search." });
  }
});

// Your /api/download route remains the same
// ...

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
