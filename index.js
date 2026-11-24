const express = require("express");
const animeRouter = require("./routes/anime");
const studiosRouter = require("./routes/studios");
const { logger, notFound, errorHandler } = require("./middleware");

const app = express();
const PORT = 6767;

app.use(logger); // 1. logger: semua request tercatat
app.use(express.json()); // 2. baca body JSON

// 3. routes
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Anime List API",
    name: "Regith Rayabi",
    theme: "Anime List",
  });
});

app.use("/anime", animeRouter);
app.use("/studios", studiosRouter);

app.get("/files/*path", (req, res) => {
  res.json({ path: req.params.path });
});

app.use(notFound); // 4. URL tak dikenal -> 404
app.use(errorHandler); // 5. error handler, paling akhir

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
