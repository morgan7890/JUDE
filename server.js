const express = require("express");
const path = require("path");
const ytDlp = require('yt-dlp');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// SEARCH ROUTE
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing search query" });

  try {
    const searchResponse = await ytDlp.search(query);
    const video = searchResponse[0]; // First result

    res.json({
      title: video.title,
      thumbnail: video.thumbnail,
      channel: video.uploader,
      duration: video.duration,
      views: video.views,
      url: video.url
    });
  } catch (err) {
    console.error("Error searching video:", err.message);
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
    const format = type === 'audio' ? 'bestaudio' : 'bestvideo';
    const options = {
      format,
      output: '-',
      quiet: true
    };

    const stream = ytDlp(videoUrl, options);

    // Set content type based on the download type (audio or video)
    if (type === 'audio') {
      res.setHeader('Content-Type', 'audio/mpeg');
    } else {
      res.setHeader('Content-Type', 'video/mp4');
    }

    // Stream the file directly to the client
    stream.pipe(res);
    
    stream.on('end', () => {
      console.log('Download complete');
    });

    stream.on('error', (err) => {
      console.error('Error during download stream:', err.message);
      res.status(500).json({ error: "Failed to fetch download link" });
    });

  } catch (error) {
    console.error("Download error:", error.message);
    res.status(500).json({ error: "Failed to fetch download link" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
