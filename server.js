const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Middleware to parse JSON request bodies

// --- NEW: /api/search ROUTE ---
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Search query is required." });
  }

  try {
    // --- REPLACE THIS WITH YOUR ACTUAL SEARCH LOGIC ---
    // Example (for YouTube Data API, you'd need to set up the API client):
    // const youtubeApiKey = 'YOUR_YOUTUBE_API_KEY';
    // const searchResults = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtubeApiKey}&maxResults=1`);
    // if (searchResults.data.items && searchResults.data.items.length > 0) {
    //   const videoId = searchResults.data.items[0].id.videoId;
    //   const videoDetails = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${youtubeApiKey}`);
    //   if (videoDetails.data.items && videoDetails.data.items.length > 0) {
    //     const details = videoDetails.data.items[0];
    //     const responseData = {
    //       title: details.snippet.title,
    //       thumbnail: details.snippet.thumbnails.medium.url,
    //       channel: details.snippet.channelTitle,
    //       duration: details.contentDetails.duration, // Format this as needed
    //       views: details.statistics.viewCount,
    //       url: `https://www.youtube.com/watch?v=${videoId}`, // Construct the video URL
    //     };
    //     return res.json(responseData);
    //   }
    // }
    // --- END OF PLACEHOLDER SEARCH LOGIC ---

    // For now, let's send a dummy response for testing:
    const dummyResponse = {
      title: `Search result for: ${query}`,
      thumbnail: "https://via.placeholder.com/480/00C2FF/FFFFFF/?Text=Placeholder",
      channel: "Dummy Channel",
      duration: "3:30",
      views: "1,000,000",
      url: "https://example.com/dummyvideo",
    };
    res.json(dummyResponse);

  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).json({ error: "Failed to perform search." });
  }
});

// --- UPDATED: /api/download ROUTE (still POST) ---
app.post("/api/download", async (req, res) => {
  const { url: videoUrl, type } = req.body; // Expecting URL and type in the body

  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required for download." });
  }

  try {
    const response = await axios.post(
      "https://youtube-api-v1.vercel.app/api/v1/yt/download",
      { url: videoUrl }
    );

    // You might need to adjust how you send the download link to the client
    // based on the response from the third-party API.
    res.json(response.data);
  } catch (error) {
    console.error("Error during download:", error);
    res.status(500).json({ error: "Failed to fetch download links." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
