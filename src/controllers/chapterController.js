const prisma = require("../db/prisma");

// ✅ Get semua chapter (urut berdasarkan `order`)
exports.getChapters = async (req, res) => {
  try {
    const chapters = await prisma.chapter.findMany({
      orderBy: { order: "asc" },
    });
    res.json({ message: "Berhasil mengambil data bab", data: chapters });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data bab",
      error: error.message,
    });
  }
};

exports.getChaptersByProgramStudi = async (req, res) => {
  const { programStudiId } = req.query;
  try {
    const whereClause = programStudiId
      ? { programStudiId: Number(programStudiId) }
      : {};
    const chapters = await prisma.chapter.findMany({
      where: whereClause,
    });
    res.json({ message: "Berhasil mengambil data bab", data: chapters });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data bab",
      error: error.message,
    });
  }
};

// ✅ Get subchapter berdasarkan chapterId
exports.getSubChaptersByChapter = async (req, res) => {
  const chapterId = Number(req.params.id);
  try {
    const subChapters = await prisma.subChapter.findMany({
      where: { chapterId },
      orderBy: { order: "asc" },
    });
    res.json({ message: "Berhasil mengambil data subbab", data: subChapters });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil data subbab",
      error: error.message,
    });
  }
};

// ✅ Create chapter
exports.createChapter = async (req, res) => {
  const { title, description, programStudiId, order } = req.body;
  try {
    const chapter = await prisma.chapter.create({
      data: {
        title,
        description,
        programStudiId,
        order,
      },
    });
    res.status(201).json({ message: "Bab berhasil dibuat", data: chapter });
  } catch (error) {
    res.status(500).json({
      message: "Gagal membuat bab",
      error: error.message,
    });
  }
};

// ✅ Update chapter
exports.updateChapter = async (req, res) => {
  const { id } = req.params;
  const { title, description, order } = req.body;

  try {
    const existingChapter = await prisma.chapter.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingChapter) {
      return res.status(404).json({ message: "Chapter tidak ditemukan" });
    }

    const updatedChapter = await prisma.chapter.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        order,
      },
    });

    res.json({
      message: "Chapter berhasil diperbarui",
      data: updatedChapter,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui chapter",
      error: error.message,
    });
  }
};

// Delete Chapter
// Delete Chapter - versi lengkap dan aman
exports.deleteChapter = async (req, res) => {
  const chapterId = parseInt(req.params.id);

  try {
    const existingChapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
    });

    if (!existingChapter) {
      return res.status(404).json({ message: "Chapter tidak ditemukan" });
    }

    // Ambil semua dokumen di chapter ini
    const documents = await prisma.document.findMany({
      where: { chapterId },
      select: { id: true },
    });
    const documentIds = documents.map((doc) => doc.id);

    if (documentIds.length > 0) {
      // Hapus komentar terkait dokumen
      await prisma.comment.deleteMany({
        where: { documentId: { in: documentIds } },
      });

      // Hapus shared link dokumen
      await prisma.sharedLink.deleteMany({
        where: { documentId: { in: documentIds } },
      });

      // Hapus dokumen
      await prisma.document.deleteMany({
        where: { id: { in: documentIds } },
      });
    }

    // Ambil semua subchapter dari chapter ini
    const subChapters = await prisma.subChapter.findMany({
      where: { chapterId },
      select: { id: true },
    });
    const subChapterIds = subChapters.map((s) => s.id);

    if (subChapterIds.length > 0) {
      // Ambil semua sub-subchapter dari subchapter
      const subSubChapters = await prisma.subSubChapter.findMany({
        where: { subChapterId: { in: subChapterIds } },
        select: { id: true },
      });
      const subSubChapterIds = subSubChapters.map((ss) => ss.id);

      if (subSubChapterIds.length > 0) {
        // Hapus dokumen di sub-subchapter
        await prisma.document.deleteMany({
          where: { subSubChapterId: { in: subSubChapterIds } },
        });
      }

      // Hapus sub-subchapter
      await prisma.subSubChapter.deleteMany({
        where: { subChapterId: { in: subChapterIds } },
      });

      // Hapus subchapter
      await prisma.subChapter.deleteMany({
        where: { chapterId },
      });
    }

    // Hapus chapter terakhir
    await prisma.chapter.delete({
      where: { id: chapterId },
    });

    res.json({ message: "Chapter berhasil dihapus" });
  } catch (error) {
    console.error("Error hapus chapter:", error);
    res.status(500).json({
      message: "Gagal menghapus chapter",
      error: error.message,
    });
  }
};
