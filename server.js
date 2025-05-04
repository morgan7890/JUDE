const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// SEARCH ROUTE
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    const response = await axios.get(`https://youtube-api-v1.vercel.app/api/v1/yt/search?q=${encodeURIComponent(query)}`);
    const video = response.data[0]; // first result

    res.json({
      title: video.title,
      thumbnail: video.thumbnail,
      channel: video.channel,
      duration: video.duration,
      views: video.views,
      url: video.url
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch video details" });
  }
});

// DOWNLOAD ROUTE
app.get("/api/download", async (req, res) => {
  const videoUrl = req.query.url;
  const type = req.query.type;

  if (!videoUrl || !type) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const response = await axios.post("https://youtube-api-v1.vercel.app/api/v1/yt/download", {
      url: videoUrl,
    });

    const downloadUrl = type === "audio" ? response.data.audio : response.data.video;
    return res.redirect(downloadUrl);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch download link" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
