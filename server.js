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
    if (!query) {
        console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Error: Missing search query`);
        return res.status(400).json({ error: "Missing search query" });
    }

    console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Searching for: ${query}`);

    try {
        const searchResponse = await ytDlp.search(query);

        if (!searchResponse || searchResponse.length === 0) {
            console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] No results found for query: ${query}`);
            return res.status(404).json({ error: "No results found" });
        }

        const video = searchResponse[0]; // Take the first result

        const responseData = {
            title: video.title,
            thumbnail: video.thumbnail,
            channel: video.uploader,
            duration: video.duration,
            views: video.views,
            url: video.url
        };

        console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Search successful. First result: ${responseData.title}`);
        res.json(responseData);

    } catch (err) {
        console.error(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Error searching video:`, err);
        res.status(500).json({ error: "Failed to fetch video details" });
    }
});

// DOWNLOAD ROUTE
app.get("/api/download", async (req, res) => {
    const videoUrl = req.query.url;
    const type = req.query.type;

    if (!videoUrl || !type) {
        console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Error: Missing download parameters (url or type)`);
        return res.status(400).json({ error: "Missing parameters" });
    }

    console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Attempting to download: ${videoUrl} as ${type}`);

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
            console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Download complete for: ${videoUrl}`);
        });

        stream.on('error', (err) => {
            console.error(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Error during download stream for ${videoUrl}:`, err.message);
            res.status(500).json({ error: "Failed to fetch download link" });
        });

    } catch (error) {
        console.error(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] Download error for ${videoUrl}:`, error.message);
        res.status(500).json({ error: "Failed to fetch download link" });
    }
});

app.listen(PORT, () => {
    console.log(`[${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}] ✅ Server running on http://localhost:${PORT}`);
});
