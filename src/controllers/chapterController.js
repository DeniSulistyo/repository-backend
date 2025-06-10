const prisma = require("../db/prisma");

exports.getChapters = async (req, res) => {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { order: "asc" },
    });
    res.json(chapters);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data bab", error: error.message });
  }
};

exports.getSubChaptersByChapter = async (req, res) => {
  const chapterId = Number(req.params.id);
  try {
    const subChapters = await prisma.subChapter.findMany({
      where: { chapterId },
      orderBy: { order: "asc" },
    });
    res.json(subChapters);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data subbab", error: error.message });
  }
};

exports.createChapter = async (req, res) => {
  const { title, description, programStudiId } = req.body;
  try {
    const chapter = await prisma.chapter.create({
      data: { title, description, programStudiId },
    });
    res.status(201).json(chapter);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal membuat bab", error: error.message });
  }
};

exports.createSubChapter = async (req, res) => {
  const { chapterId, title, order } = req.body;
  try {
    const subChapter = await prisma.subChapter.create({
      data: {
        chapterId,
        title,
        order,
      },
    });
    res.status(201).json(subChapter);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal membuat subbab", error: error.message });
  }
};

// Update Chapter
exports.updateChapter = async (req, res) => {
  const { id } = req.params;
  const { title, order } = req.body;

  try {
    // Cek apakah chapter ada
    const existingChapter = await prisma.chapter.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingChapter) {
      return res.status(404).json({ message: "Chapter tidak ditemukan" });
    }

    // Update data chapter
    const updatedChapter = await prisma.chapter.update({
      where: { id: parseInt(id) },
      data: {
        title,
        order,
      },
    });

    res.json({
      message: "Chapter berhasil diupdate",
      data: updatedChapter,
    });
  } catch (error) {
    console.error("Error update chapter:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Delete Chapter
exports.deleteChapter = async (req, res) => {
  const { id } = req.params;

  try {
    // Cek apakah chapter ada
    const existingChapter = await prisma.chapter.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingChapter) {
      return res.status(404).json({ message: "Chapter tidak ditemukan" });
    }

    // Delete chapter
    await prisma.chapter.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Chapter berhasil dihapus" });
  } catch (error) {
    console.error("Error hapus chapter:", error);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
