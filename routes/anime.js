const express = require("express");
const { requireAuth, createError } = require("../middleware");
const router = express.Router();

// Data awal (disimpan di memori, tanpa database)
let anime = [
  {
    id: 1,
    title: "Fullmetal Alchemist: Brotherhood",
    genre: "Action",
    episodes: 64,
    rating: 9.1,
    status: "completed",
  },
  {
    id: 2,
    title: "Death Note",
    genre: "Thriller",
    episodes: 37,
    rating: 8.6,
    status: "completed",
  },
  {
    id: 3,
    title: "Steins;Gate",
    genre: "Sci-Fi",
    episodes: 24,
    rating: 9.0,
    status: "completed",
  },
  {
    id: 4,
    title: "Demon Slayer",
    genre: "Action",
    episodes: 26,
    rating: 8.4,
    status: "completed",
  },
  {
    id: 5,
    title: "One Punch Man",
    genre: "Comedy",
    episodes: 12,
    rating: 8.5,
    status: "completed",
  },
  {
    id: 6,
    title: "Toradora!",
    genre: "Romance",
    episodes: 25,
    rating: 8.1,
    status: "completed",
  },
  {
    id: 7,
    title: "Frieren: Beyond Journey's End",
    genre: "Fantasy",
    episodes: 28,
    rating: 9.3,
    status: "completed",
  },
  {
    id: 8,
    title: "Haikyuu!!",
    genre: "Sports",
    episodes: 25,
    rating: 8.4,
    status: "completed",
  },
  {
    id: 9,
    title: "Another",
    genre: "Horror",
    episodes: 12,
    rating: 7.5,
    status: "completed",
  },
  {
    id: 10,
    title: "Monster",
    genre: "Mystery",
    episodes: 74,
    rating: 8.9,
    status: "completed",
  },
  {
    id: 11,
    title: "Violet Evergarden",
    genre: "Drama",
    episodes: 13,
    rating: 8.5,
    status: "completed",
  },
  {
    id: 12,
    title: "Barakamon",
    genre: "Slice of Life",
    episodes: 12,
    rating: 8.1,
    status: "completed",
  },
  {
    id: 13,
    title: "Code Geass",
    genre: "Mecha",
    episodes: 25,
    rating: 8.7,
    status: "completed",
  },
  {
    id: 14,
    title: "Your Lie in April",
    genre: "Music",
    episodes: 22,
    rating: 8.6,
    status: "completed",
  },
  {
    id: 15,
    title: "One Piece",
    genre: "Adventure",
    episodes: 1100,
    rating: 8.7,
    status: "ongoing",
  },
];

let nextId = 16; // karena data awal sudah sampai id 15

// Cari index anime berdasarkan id, lempar 404 kalau tidak ada
function findIndexOr404(id) {
  const index = anime.findIndex((a) => a.id === Number(id));
  if (index === -1) {
    throw createError(404, "Anime not found");
  }
  return index;
}

// Validasi body: lempar error 400 kalau tidak valid
function validate(body = {}) {
  const { title, genre, episodes, rating, status } = body;

  if (!title || !genre || !status) {
    throw createError(400, "title, genre, and status are required");
  } else if (typeof episodes !== "number" || typeof rating !== "number") {
    throw createError(400, "episodes and rating must be numbers");
  }
}

// /anime
router
  .route("/")
  .get((req, res) => {
    res.json(anime);
  })
  .post((req, res) => {
    validate(req.body);

    const { title, genre, episodes, rating, status } = req.body;
    const newAnime = { id: nextId++, title, genre, episodes, rating, status };

    anime.push(newAnime);
    res.status(201).json(newAnime);
  });

// GET /anime/search?title=death (harus sebelum /:id)
router.get("/search", (req, res) => {
  const { title } = req.query;

  if (typeof title !== "string" || !title) {
    throw createError(400, "query 'title' is required");
  }

  const result = anime.filter((a) =>
    a.title.toLowerCase().includes(title.toLowerCase()),
  );
  res.json(result);
});

// GET /anime/genre atau /anime/genre/Action (harus sebelum /:id)
router.get("/genre{/:name}", (req, res) => {
  const { name } = req.params;

  // Tanpa nilai: tampilkan semua
  if (!name) {
    return res.json(anime);
  }

  const result = anime.filter(
    (a) => a.genre.toLowerCase() === name.toLowerCase(),
  );
  res.json(result);
});

// /anime/:id
router
  .route("/:id")
  .get(async (req, res) => {
    res.json(anime[findIndexOr404(req.params.id)]);
  })
  .put(async (req, res) => {
    const index = findIndexOr404(req.params.id);
    validate(req.body);

    const { title, genre, episodes, rating, status } = req.body;
    anime[index] = {
      id: anime[index].id, // id tetap, tidak bisa diubah
      title,
      genre,
      episodes,
      rating,
      status,
    };

    res.json(anime[index]);
  })
  .delete(requireAuth, async (req, res) => {
    const index = findIndexOr404(req.params.id);
    const [removed] = anime.splice(index, 1);

    res.json({ message: "Anime deleted", data: removed });
  });

module.exports = router;
