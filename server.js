const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config(); // Load environment variables dari .env

const app = express();

// app.use(cors());
const corsOptions = {
  origin: ["http://localhost:5173", "https://eviden-frontend.vercel.app"],
  credentials: true,
};

app.use(cors(corsOptions));

// cors for deployment 

app.use(express.json());
app.use(morgan("dev"));

// Import routes
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");
const documentRoutes = require("./src/routes/documents");
const chapterRoutes = require("./src/routes/chapters");
const subChapterRoutes = require("./src/routes/subChapter");
const commentRoutes = require("./src/routes/comment");

// routes dengan prefix API masing-masing
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/subchapters", subChapterRoutes);
app.use("/api/comments", commentRoutes);

// Route default
app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
