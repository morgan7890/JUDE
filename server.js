const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Middleware to parse JSON request bodies

// --- NEW: /api/search ROUTE with real API call ---
// Example: Searching YouTube API (You need to use your own YouTube API key)
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Search query is required." });
  }

  try {
    // Example: Replace this with actual YouTube API search logic
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=YOUR_YOUTUBE_API_KEY`;
    const response = await axios.get(apiUrl);
    
    if (response.data.items.length > 0) {
      const video = response.data.items[0]; // First result
      const result = {
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        channel: video.snippet.channelTitle,
        duration: "Unknown", // This will need another API call to get the duration
        views: "Unknown", // Similarly, you might need another call to get view count
        url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
      };
      res.json(result);
    } else {
      res.status(404).json({ error: "No results found." });
    }

  } catch (error) {
    console.error("Error during search API call:", error.message);
    res.status(500).json({ error: "Failed to perform search." });
  }
});

// --- UPDATED: /api/download ROUTE with more detailed error logging ---
app.post("/api/download", async (req, res) => {
  const { url: videoUrl, type } = req.body; // Expecting URL and type in the body

  if (!videoUrl || !type) {
    return res.status(400).json({ error: "Both video URL and type are required for download." });
  }

  console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Attempting download for URL: ${videoUrl} (Type: ${type})`);

  try {
    const response = await axios.post(
      "https://youtube-api-v1.vercel.app/api/v1/yt/download",
      { url: videoUrl, type }
    );

    console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Third-party API response status: ${response.status}`);
    console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Third-party API response data:`, response.data);

    res.json(response.data);

  } catch (error) {
    console.error(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Error during download request to third-party API:`, error.message);
    if (error.response) {
      console.error(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Third-party API error response status: ${error.response.status}`);
      console.error(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Third-party API error response data:`, error.response.data);
    }
    res.status(500).json({ error: "Failed to fetch download links." });
  }
});

app.listen(PORT, () => {
  console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Server running on port ${PORT}`);
});
