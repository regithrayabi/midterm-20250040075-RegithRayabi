const express = require("express");
const { requireAuth, createError } = require("../middleware");
const router = express.Router();

// Data awal studio (disimpan di memori, tanpa database)
let studios = [
  {
    id: 1,
    name: "MAPPA",
    city: "Tokyo",
    founded: 2011,
    famousWork: "Jujutsu Kaisen",
  },
  {
    id: 2,
    name: "Ufotable",
    city: "Tokyo",
    founded: 2000,
    famousWork: "Demon Slayer",
  },
  {
    id: 3,
    name: "Bones",
    city: "Tokyo",
    founded: 1998,
    famousWork: "Fullmetal Alchemist: Brotherhood",
  },
  {
    id: 4,
    name: "Madhouse",
    city: "Tokyo",
    founded: 1972,
    famousWork: "Death Note",
  },
  {
    id: 5,
    name: "White Fox",
    city: "Tokyo",
    founded: 2007,
    famousWork: "Steins;Gate",
  },
];

let nextId = 6;

function findIndexOr404(id) {
  const index = studios.findIndex((s) => s.id === Number(id));
  if (index === -1) {
    throw createError(404, "Studio not found");
  }
  return index;
}

function validate(body = {}) {
  const { name, city, founded, famousWork } = body;

  if (!name || !city || !famousWork) {
    throw createError(400, "name, city, and famousWork are required");
  } else if (typeof founded !== "number") {
    throw createError(400, "founded must be a number");
  }
}

// /studios
router
  .route("/")
  .get((req, res) => {
    res.json(studios);
  })
  .post((req, res) => {
    validate(req.body);

    const { name, city, founded, famousWork } = req.body;
    const newStudio = { id: nextId++, name, city, founded, famousWork };

    studios.push(newStudio);
    res.status(201).json(newStudio);
  });

// /studios/:id
router
  .route("/:id")
  .get((req, res) => {
    res.json(studios[findIndexOr404(req.params.id)]);
  })
  .put((req, res) => {
    const index = findIndexOr404(req.params.id);
    validate(req.body);

    const { name, city, founded, famousWork } = req.body;
    studios[index] = { id: studios[index].id, name, city, founded, famousWork };

    res.json(studios[index]);
  })
  .delete(requireAuth, (req, res) => {
    const index = findIndexOr404(req.params.id);
    const [removed] = studios.splice(index, 1);

    res.json({ message: "Studio deleted", data: removed });
  });

module.exports = router;
