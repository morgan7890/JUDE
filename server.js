const express = require("express");
const path = require("path");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/api/download", async (req, res) => {
  const { videoUrl } = req.body;

  try {
    const response = await axios.post("https://youtube-api-v1.vercel.app/api/v1/yt/download", {
      url: videoUrl,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch download links" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});