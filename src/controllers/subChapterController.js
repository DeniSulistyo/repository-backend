const prisma = require("../db/prisma");

// ✅ CREATE (sudah kamu punya)
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


// create activity log  
    const log = await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        programStudiId: req.user.programStudiId,

        documentId: null,
        activity: "Create SubChapter",
      },
      include: {
        user: {
          select: { id: true, name: true, role: true, programStudi: true },
        },
        programStudi: {
          select: { id: true, name: true },
        },
      },
    });

    res
      .status(201)
      .json({ message: "Subbab berhasil dibuat", data: subChapter, log });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal membuat subbab", error: error.message });
  }
};

const getSubChapterById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const subChapter = await prisma.subChapter.findUnique({
      where: { id },
      include: {
        documents: {
          where: { isDeleted: false },
          include: {
            uploadedBy: {
              select: { id: true, name: true, programStudi: true },
            },
          },
        },
        subSubChapters: {
          include: {
            documents: {
              where: { isDeleted: false },
              include: {
                uploadedBy: {
                  select: { id: true, name: true, programStudi: true },
                },
              },
            },
          },
        },
      },
    });
    res
      .status(200)
      .json({ message: "Data subbab ditemukan", data: subChapter });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Gagal mengambil data subbab", error: error.message });
  }
};

// ✅ GET by chapterId
const getSubChaptersByChapter = async (req, res) => {
  const chapterId = parseInt(req.params.chapterId);
  if (isNaN(chapterId)) {
    return res.status(400).json({ message: "chapterId tidak valid" });
  }

  try {
    const subChapters = await prisma.subChapter.findMany({
      where: { chapterId },
      include: {
        documents: {
          where: { isDeleted: false },
        },
        subSubChapters: {
          include: {
            documents: {
              where: { isDeleted: false },
            },
          },
        },
      },
    });

    res
      .status(200)
      .json({ message: "Data subbab ditemukan", data: subChapters });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data subbab", error: error.message });
  }
};

// ✅ UPDATE
const updateSubChapter = async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID subbab tidak valid" });
  }

  try {
    const updated = await prisma.subChapter.update({
      where: { id },
      data: { title, description },
    });

    res
      .status(200)
      .json({ message: "Subbab berhasil diperbarui", data: updated });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal memperbarui subbab", error: error.message });
  }
};

// ✅ DELETE
const deleteSubChapter = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID tidak valid" });
  }

  try {
    await prisma.subChapter.delete({ where: { id } });
    const log = await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        programStudiId: req.user.programStudiId,
        documentId: null,
        activity: "Delete SubChapter",
      },
      include: {
        user: {
          select: { id: true, name: true, role: true, programStudi: true },
        },
        programStudi: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(200).json({ message: "Subbab berhasil dihapus", log });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus subbab", error: error.message });
  }
};

module.exports = {
  createSubChapter,
  getSubChaptersByChapter,
  getSubChapterById,
  updateSubChapter,
  deleteSubChapter,
};
