const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY; // Your Last.fm API key

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/similar-artists", async (req, res) => {
  const artist = req.query.q;
  try {
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${encodeURIComponent(artist)}&api_key=${API_KEY}&format=json&limit=12`
    );
    const data = await response.json();
    const results = data.similarartists.artist.map((a) => ({
      name: a.name,
      url: a.url,
      image:
        a.image && a.image.length > 2 && a.image[2]["#text"]
          ? a.image[2]["#text"]
          : "https://via.placeholder.com/150",
    }));
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch similar artists" });
  }
});

app.get("/api/similar-tracks", async (req, res) => {
  const track = req.query.q;
  try {
    const response = await fetch(
      `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&track=${encodeURIComponent(track)}&api_key=${API_KEY}&format=json&limit=12`
    );
    const data = await response.json();
    const results = data.similartracks.track.map((t) => ({
      name: t.name,
      artist: t.artist.name,
      url: t.url,
      image:
        t.image && t.image.length > 2 && t.image[2]["#text"]
          ? t.image[2]["#text"]
          : "https://via.placeholder.com/150",
    }));
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch similar tracks" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
