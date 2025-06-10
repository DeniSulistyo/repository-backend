const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config(); // Load environment variables dari .env

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Import routes
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");
const documentRoutes = require("./src/routes/documents");
const chapterRoutes = require("./src/routes/chapters");
const subChapterRoutes = require("./src/routes/subChapter");

// routes dengan prefix API masing-masing
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/subchapters", subChapterRoutes);

// Route default
app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
