const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Middleware to parse JSON request bodies

// --- NEW: /api/search ROUTE (Placeholder - You still need to implement real search) ---
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Search query is required." });
  }

  try {
    // --- REPLACE THIS WITH YOUR ACTUAL SEARCH LOGIC ---
    console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Placeholder search for: ${query}`);
    const dummyResponse = {
      title: `Search result for: ${query} (Placeholder)`,
      thumbnail: "https://via.placeholder.com/480/00C2FF/FFFFFF/?Text=Placeholder",
      channel: "Dummy Channel",
      duration: "3:30",
      views: "1,000,000",
      url: "https://example.com/dummyvideo",
    };
    res.json(dummyResponse);

  } catch (error) {
    console.error(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Error during placeholder search:`, error);
    res.status(500).json({ error: "Failed to perform search." });
  }
});

// --- UPDATED: /api/download ROUTE with more detailed error logging ---
app.post("/api/download", async (req, res) => {
  const { url: videoUrl, type } = req.body; // Expecting URL and type in the body

  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required for download." });
  }

  console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Attempting download for URL: ${videoUrl} (Type: ${type})`);

  try {
    const response = await axios.post(
      "https://youtube-api-v1.vercel.app/api/v1/yt/download",
      { url: videoUrl }
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
