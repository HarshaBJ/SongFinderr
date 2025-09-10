const resultsContainer = document.getElementById("results");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  resultsContainer.innerHTML = "<p>Searching...</p>";

  try {
    const apiUrl = window.location.origin + "/api";

    const artistsRes = await fetch(`${apiUrl}/similar-artists?q=${encodeURIComponent(query)}`);
    const artists = await artistsRes.json();

    const tracksRes = await fetch(`${apiUrl}/similar-tracks?q=${encodeURIComponent(query)}`);
    const tracks = await tracksRes.json();

    resultsContainer.innerHTML = "";

    if ((!artists || artists.length === 0) && (!tracks || tracks.length === 0)) {
      resultsContainer.innerHTML = "<p>No results found. Try another search.</p>";
      return;
    }

    if (artists && artists.length > 0) {
      const artistHeader = document.createElement("h3");
      artistHeader.textContent = "Similar Artists:";
      resultsContainer.appendChild(artistHeader);

      const row = document.createElement("div");
      row.className = "row";
      artists.forEach((artist) => {
        const col = document.createElement("div");
        col.className = "col-md-3 col-sm-6 mb-4";
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100";
        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = artist.image || "https://via.placeholder.com/150";
        img.alt = artist.name;
        const body = document.createElement("div");
        body.className = "card-body";
        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = artist.name;
        const link = document.createElement("a");
        link.href = artist.url;
        link.target = "_blank";
        link.className = "btn btn-sm btn-primary mt-2";
        link.textContent = "View on Last.fm";
        body.appendChild(title);
        body.appendChild(link);
        card.appendChild(img);
        card.appendChild(body);
        col.appendChild(card);
        row.appendChild(col);
      });
      resultsContainer.appendChild(row);
    }

    if (tracks && tracks.length > 0) {
      const trackHeader = document.createElement("h3");
      trackHeader.textContent = "Similar Tracks:";
      resultsContainer.appendChild(trackHeader);

      const row = document.createElement("div");
      row.className = "row";
      tracks.forEach((track) => {
        const col = document.createElement("div");
        col.className = "col-md-3 col-sm-6 mb-4";
        const card = document.createElement("div");
        card.className = "card shadow-sm h-100";
        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = track.image || "https://via.placeholder.com/150";
        img.alt = track.name;
        const body = document.createElement("div");
        body.className = "card-body";
        const title = document.createElement("h5");
        title.className = "card-title";
        title.textContent = track.name;
        const subtitle = document.createElement("p");
        subtitle.className = "card-text";
        subtitle.textContent = track.artist;
        const link = document.createElement("a");
        link.href = track.url;
        link.target = "_blank";
        link.className = "btn btn-sm btn-primary mt-2";
        link.textContent = "View on Last.fm";
        body.appendChild(title);
        body.appendChild(subtitle);
        body.appendChild(link);
        card.appendChild(img);
        card.appendChild(body);
        col.appendChild(card);
        row.appendChild(col);
      });
      resultsContainer.appendChild(row);
    }
  } catch (err) {
    console.error(err);
    resultsContainer.innerHTML = "<p>Error fetching results.</p>";
  }
});