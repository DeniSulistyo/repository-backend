const prisma = require("../db/prisma");

const createSubChapter = async (req, res) => {
  const { chapterId, title, description } = req.body;
  try {
    const subChapter = await prisma.subChapter.create({
      data: {
        chapterId,
        title,
        description,
      },
    });
    res
      .status(201)
      .json({ message: "Subbab berhasil dibuat", data: subChapter });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal membuat subbab", error: error.message });
  }
};

module.exports = { createSubChapter };
