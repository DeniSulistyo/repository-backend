const prisma = require("../db/prisma");

// ✅ GET semua SubSubChapter
exports.getAllSubSubChapters = async (req, res) => {
  try {
    const subSubChapters = await prisma.subSubChapter.findMany({
      include: {
        subChapter: { select: { id: true, title: true } }, // ikutkan info subchapter
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(subSubChapters);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil sub-sub-chapter",
      error: error.message,
    });
  }
};

// ✅ GET SubSubChapter berdasarkan ID
exports.getSubSubChapterById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const subSubChapter = await prisma.subSubChapter.findUnique({
      where: { id },
      include: {
        documents: {
          where: { isDeleted: false },
        },
        subChapter: true,
      },
    });
    if (!subSubChapter) {
      return res
        .status(404)
        .json({ message: "Sub-sub-chapter tidak ditemukan" });
    }
    res.json(subSubChapter);
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil sub-sub-chapter",
      error: error.message,
    });
  }
};

exports.getSubSubChaptersBySubChapter = async (req, res) => {
  try {
    const subChapterId = Number(req.params.id);
    const subSubChapters = await prisma.subSubChapter.findMany({
      where: { subChapterId },
      include: {
        subChapter: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({
      message: "Sub-sub-chapter berhasil ditemukan",
      data: subSubChapters,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Gagal mengambil sub-sub-chapter",
      error: error.message,
    });
  }
};

// ✅ POST buat SubSubChapter baru
exports.createSubSubChapter = async (req, res) => {
  try {
    const { title, subChapterId } = req.body;

    if (!title || !subChapterId) {
      return res
        .status(400)
        .json({ message: "Title dan SubChapterId harus diisi" });
    }

    const newSubSubChapter = await prisma.subSubChapter.create({
      data: {
        title,
        subChapterId: parseInt(subChapterId),
      },
    });

    res.status(201).json({
      message: "Sub-sub-chapter berhasil dibuat",
      data: newSubSubChapter,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal membuat sub-sub-chapter", error: error.message });
  }
};

// ✅ PUT edit SubSubChapter
exports.updateSubSubChapter = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, subChapterId } = req.body;

    const updatedSubSubChapter = await prisma.subSubChapter.update({
      where: { id },
      data: {
        title,
        subChapterId: subChapterId ? parseInt(subChapterId) : undefined,
      },
    });

    res.json({
      message: "Sub-sub-chapter berhasil diperbarui",
      data: updatedSubSubChapter,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal memperbarui sub-sub-chapter",
      error: error.message,
    });
  }
};

// ✅ DELETE SubSubChapter
exports.deleteSubSubChapter = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.subSubChapter.delete({
      where: { id },
    });
    res.json({ message: "Sub-sub-chapter berhasil dihapus" });
  } catch (error) {
    res.status(500).json({
      message: "Gagal menghapus sub-sub-chapter",
      error: error.message,
    });
  }
};
